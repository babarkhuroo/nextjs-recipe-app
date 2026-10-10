import { previewClient } from '../../lib/sanity'

const ID_PATTERN = /^[a-zA-Z0-9-]{1,64}$/

export default async function likeButtonHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
  }

  const _id = body?._id
  if (typeof _id !== 'string' || !ID_PATTERN.test(_id)) {
    return res.status(400).json({ error: 'Invalid recipe id' })
  }

  try {
    // Only published recipes can be liked
    const recipeId = await previewClient.fetch(
      `*[_type == "recipe" && _id == $id][0]._id`,
      { id: _id }
    )
    if (!recipeId) {
      return res.status(404).json({ error: 'Recipe not found' })
    }

    const data = await previewClient
      .patch(recipeId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit()

    return res.status(200).json({ likes: data.likes })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Could not save like' })
  }
}
