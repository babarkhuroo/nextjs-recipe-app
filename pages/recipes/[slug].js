import { useState } from 'react'
import { groq } from 'next-sanity'
import {
  getClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from '../../lib/sanity'

const recipeQuery = groq`
*[_type == 'recipe' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}
`

export default function OneRecipe({ data, preview }) {
  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe?.slug },
    initialData: data.recipe,
    enabled: preview && data.recipe?.slug,
  })

  const [likes, setLikes] = useState(data?.recipe?.likes)

  const addLike = async () => {
    const res = await fetch('/api/handleLike', {
      method: 'POST',
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error))
    const data = await res.json()

    setLikes(data.likes)
  }

  return (
    <article className='recipe'>
      <h1>{recipe.name}</h1>
      <button className='like-button' onClick={addLike}>
        {likes} ❤️
      </button>
      <main className='content'>
        <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
        <div className='breakdown'>
          <ul className='ingredients'>
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className='ingredient'>
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <span>
            <PortableText
              value={recipe?.instructions}
              className='instructions'
            />
          </span>
        </div>
      </main>
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "recipe" && defined(slug.current)]{
            "params":{
                "slug":slug.current
            }
        }`
  )
  return { paths, fallback: true }
}

export async function getStaticProps({ params, preview = false }) {
  const { slug } = params
  const recipe = await getClient(preview).fetch(recipeQuery, { slug })
  return { props: { data: { recipe }, preview } }
}
