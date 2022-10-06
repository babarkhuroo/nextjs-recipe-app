import { previewClient } from '../../lib/sanity'

export default async function likeButtonHandler(req, res) {
  const { _id } = JSON.parse(req.body)
  const data = await previewClient
    .patch(_id)
    .setIfMissing({ likes: 0 })
    .inc({ likes: 1 })
    .commit()
    .catch((error) => console.log(error))

  res.status(200).json({ likes: data.likes })
}
