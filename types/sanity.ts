import { PortableTextBlock } from '@portabletext/react-native'

export type Locale = {
  _id: string
  _type: string
  code: string
  title: string
  nativeName?: string
}

export type ImageDimensions = {
  width: number
  height: number
  aspectRatio: number
}

// A Sanity image projection that keeps the asset ref (for urlFor) plus a resolved url fallback.
export type ImageRef = {
  asset?: { _ref?: string; _type?: string; url?: string }
  url?: string
  dim?: ImageDimensions
} | null

export type SocialPost = {
  _key?: string
  _type?: string
  url?: string
}

export type CategoryListItem = {
  _id: string
  _type: string
  title: string
  slug?: string
}

// Flat node used to compute the category descendant set client-side.
export type CategoryTreeNode = {
  _id: string
  _type?: string
  title?: string
  topLevelNode?: boolean
  parentId?: string | null
  slug?: string
}

export type Category = {
  _id: string
  _type: string
  title: string
  slug?: string
  topLevelNode?: boolean
  parentId?: string | null
  parent?: { _id: string; _type: string; title: string } | null
}

export type ProductMediaImage = {
  _key: string
  _type: 'image'
  asset?: { _ref?: string; _type?: string; url?: string }
  url?: string
  dim?: ImageDimensions
}

export type ProductMediaVideo = {
  _key: string
  _type: 'video'
  title?: string
}

export type ProductMediaSocial = {
  _key: string
  _type: 'socialPost'
  url?: string
}

export type ProductMedia = ProductMediaImage | ProductMediaVideo | ProductMediaSocial

export type ProductListItem = {
  _id: string
  _type: string
  title: string
  slug?: string
  image?: ProductMediaImage | null
}

export type Product = {
  _id: string
  _type: string
  title: string
  slug?: string
  description?: PortableTextBlock[]
  imagesAndVideos?: ProductMedia[]
  parents?: { _id: string; _type: string; title: string; slug?: string }[]
  socialPosts?: SocialPost[]
}

export type EventListItem = {
  _id: string
  _type: string
  title: string
  slug?: string
  date?: string
  location?: string
  image?: ImageRef
}

export type EventDoc = {
  _id: string
  _type: string
  title: string
  date?: string
  location?: string
  description?: PortableTextBlock[]
  image?: ImageRef
  socialPosts?: SocialPost[]
}

export type StoreAddress = {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export type StoreListItem = {
  _id: string
  _type: string
  title: string
  image?: ImageRef
  address?: StoreAddress
}

export type StoreDoc = StoreListItem & {
  phone?: string
  hours?: string
  location?: { lat: number; lng: number; _type?: string }
}
