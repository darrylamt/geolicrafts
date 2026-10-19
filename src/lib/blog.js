// Cover image for a blog post: the uploaded cover if there is one, otherwise a
// matching photo from the site (old WordPress links are treated as missing).
const LOCAL_IMAGES = {
  'geolicrafts-ceo-vision':  '/pics/founder.webp',
  'training-centre-dodowa':  '/pics/ife/group-pic.webp',
  'bolga-baskets-global':    '/pics/workers1.webp',
  'drums-cultural-heritage': '/pics/process.webp',
}
const CATEGORY_IMAGES = {
  News:      '/pics/founder.webp',
  Community: '/pics/training.webp',
  Crafts:    '/pics/process.webp',
}
export const DEFAULT_COVER = '/pics/process.webp'

export function coverFor(post) {
  const own = post.image_url && !/geolicrafts\.com\/wp-content/.test(post.image_url) ? post.image_url : null
  return own || LOCAL_IMAGES[post.slug] || CATEGORY_IMAGES[post.category] || DEFAULT_COVER
}
