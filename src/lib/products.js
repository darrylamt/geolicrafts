import { useEffect, useState } from 'react'
import { supabase, getStorageUrl } from './supabase'
import { productPath, slugify } from './site'

export const FALLBACK_IMG = 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg'

export const CATEGORIES = ['Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion', 'Gifts & Souvenirs']

// Shown when the database is empty or unreachable
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Djembe Drum', category: 'Musical Instruments', description: 'Hand-carved djembe drum made from authentic Ghanaian wood with goat-skin head.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/afroton-ads02-djembe-standard-30-32-cm_1_DRU0041870-000-690x690.jpg' },
  { id: 2, name: 'Bolga Basket (Large)', category: 'Baskets & Weaving', description: 'Traditional woven basket from Bolgatanga, crafted by skilled women artisans.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg' },
  { id: 3, name: 'Fabric Fan', category: 'Textiles & Fashion', description: 'Handcrafted fabric fan made with vibrant African print cloth.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/51vp1k5fpCL._SX466.jpg' },
  { id: 4, name: 'Carved Mask', category: 'Wood Carvings', description: 'Decorative hand-carved wooden mask, inspired by traditional Ghanaian masquerade.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/9oNj9bg.jpg' },
  { id: 5, name: 'Dundum Drum', category: 'Musical Instruments', description: 'Bass drum used in traditional West African ensembles and ceremonies.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/465c92b360326a2a3dc707771cc4e622-drums-instruments.jpg' },
  { id: 6, name: 'Straw Hat', category: 'Baskets & Weaving', description: 'Hand-woven straw hat with intricate geometric patterns.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/billabong-5693-8086126-1.jpg' },
  { id: 7, name: 'Oval Basket', category: 'Baskets & Weaving', description: 'Colourful oval basket woven from elephant grass by Bolgatanga artisans.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/07/e74c6a66-5ad9-57dd-a852-a38c82b27660__50419.jpg' },
  { id: 8, name: 'Djembe Carved', category: 'Musical Instruments', description: 'Ornately carved djembe with traditional Akan motifs along the body.', image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/DRU707a_c4c5f1e2-41a8-4e85-b688-5e56d79a88ef_grande.webp' },
]

export const imageFor = p => p.image_url || getStorageUrl('products', p.image_path) || FALLBACK_IMG
export const galleryFor = p => [imageFor(p), ...(Array.isArray(p.images) ? p.images.filter(Boolean) : [])]

// What gets stored in the quote list for a product
export const quoteEntry = p => ({ id: p.id, name: p.name, category: p.category, image: imageFor(p), path: productPath(p) })

export const onImgError = e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }

// One fetch shared by every page during a visit
let cache = null
function fetchAll() {
  if (!cache) {
    cache = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => (error || !data?.length ? FALLBACK_PRODUCTS : data))
  }
  return cache
}

// Call after admin edits so public pages refetch
export const invalidateProducts = () => { cache = null }

export function useProducts() {
  const [products, setProducts] = useState(null)
  useEffect(() => {
    let alive = true
    fetchAll().then(p => alive && setProducts(p))
    return () => { alive = false }
  }, [])
  return { products: products || [], loading: products === null }
}

// Accepts either a DB slug ("djembe-drum") or the pre-migration form ("djembe-drum--<id>")
export function findProduct(products, param) {
  const sep = param.lastIndexOf('--')
  if (sep !== -1) {
    const id = param.slice(sep + 2)
    return products.find(p => String(p.id) === id)
  }
  return products.find(p => p.slug === param) || products.find(p => slugify(p.name) === param)
}
