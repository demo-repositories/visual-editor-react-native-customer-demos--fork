import groq from 'groq'

// All locales configured in the studio (l10n.locale documents).
export const LOCALES_QUERY = groq`*[_type == "l10n.locale"] | order(title asc){
  _id,
  _type,
  code,
  title,
  nativeName
}`

// Top-level categories for the chosen locale (the "Store" home tiles).
export const TOP_CATEGORIES_QUERY = groq`*[_type == "category" && language == $locale && topLevelNode == true] | order(title asc){
  _id,
  _type,
  title,
  "slug": slug.current
}`

// Every category in the locale, flattened for client-side descendant computation.
export const ALL_CATEGORIES_QUERY = groq`*[_type == "category" && language == $locale]{
  _id,
  _type,
  title,
  topLevelNode,
  "parentId": parent._ref,
  "slug": slug.current
}`

// A single category by id (used by the category screen).
export const CATEGORY_BY_ID_QUERY = groq`*[_type == "category" && _id == $id][0]{
  _id,
  _type,
  title,
  topLevelNode,
  "parentId": parent._ref,
  "slug": slug.current,
  "parent": parent->{ _id, _type, title }
}`

// Direct children of a category in the chosen locale.
export const SUBCATEGORIES_QUERY = groq`*[_type == "category" && language == $locale && parent._ref == $id] | order(title asc){
  _id,
  _type,
  title,
  "slug": slug.current
}`

// Products attached to the category or any of its descendants ($ids = descendant id set).
export const PRODUCTS_IN_CATEGORIES_QUERY = groq`*[_type == "product" && language == $locale && count(parents[@._ref in $ids]) > 0] | order(title asc){
  _id,
  _type,
  title,
  "slug": slug.current,
  "image": imagesAndVideos[_type == "image"][0]{
    _key,
    _type,
    asset,
    "url": asset->url,
    "dim": asset->metadata.dimensions
  }
}`

// A single product (PDP). The image members keep their standard local asset ref
// (urlFor / asset->url), so the Media Library global ref is not needed for rendering.
export const PRODUCT_BY_ID_QUERY = groq`*[_type == "product" && _id == $id][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
  imagesAndVideos[]{
    _key,
    _type,
    _type == "image" => {
      asset,
      "url": asset->url,
      "dim": asset->metadata.dimensions
    },
    _type == "video" => { title },
    _type == "socialPost" => { url }
  },
  parents[]->{ _id, _type, title, "slug": slug.current },
  socialPosts[]{ _key, _type, url }
}`

// Events for the chosen locale (grid).
export const EVENTS_QUERY = groq`*[_type == "event" && language == $locale] | order(date desc){
  _id,
  _type,
  title,
  "slug": slug.current,
  date,
  location,
  image{ asset, "url": asset->url }
}`

// A single event.
export const EVENT_BY_ID_QUERY = groq`*[_type == "event" && _id == $id][0]{
  _id,
  _type,
  title,
  date,
  location,
  description,
  image{ asset, "url": asset->url },
  socialPosts[]{ _key, _type, url }
}`

// Stores for the chosen locale (grid).
export const STORES_QUERY = groq`*[_type == "store" && language == $locale] | order(title asc){
  _id,
  _type,
  title,
  image{ asset, "url": asset->url },
  address
}`

// A single store.
export const STORE_BY_ID_QUERY = groq`*[_type == "store" && _id == $id][0]{
  _id,
  _type,
  title,
  image{ asset, "url": asset->url },
  address,
  phone,
  hours,
  location
}`
