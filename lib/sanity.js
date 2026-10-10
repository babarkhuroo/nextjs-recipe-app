import { createClient } from '@sanity/client'
import { PortableText as PortableTextComponent } from '@portabletext/react'
import { createImageUrlBuilder } from '@sanity/image-url'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-10-21',
  useCdn: false,
}

export const sanityClient = createClient(config)

export const previewClient = createClient({
  ...config,
  token: process.env.SANITY_WRITE_TOKEN,
})

export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient

export const urlFor = (source) => createImageUrlBuilder(config).image(source)

export const PortableText = (props) => (
  <PortableTextComponent components={{}} {...props} />
)
