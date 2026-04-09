import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getStorageUrl } from '../lib/supabase'
import KenteDivider from '../components/ui/KenteDivider'

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

const ALL_CATEGORIES = ['All', 'Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setProducts(FALLBACK_PRODUCTS)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'All' || p.category === category
    return matchesSearch && matchesCat
  })

  return (
    <>
      {/* Page Header */}
      <section className="pt-24 pb-0 mudcloth-bg relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-4 h-1 rounded-full bg-accra-500 inline-block" />
            <span className="w-4 h-1 rounded-full bg-kente-400 inline-block" />
            <span className="w-4 h-1 rounded-full bg-forest-500 inline-block" />
          </div>
          <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Handcrafted in Ghana
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Products
          </h1>
          <p className="text-forest-200 text-lg max-w-2xl mx-auto">
            Authentic African arts, musical instruments, and handcrafted gifts — each piece made with skill and cultural pride.
          </p>
        </div>
        <KenteDivider height={10} />
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-30 bg-white border-b border-sand-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-forest-700 text-white'
                      : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 kente-weave-bg min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[4/3] bg-earth-200" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-earth-200 rounded w-3/4" />
                    <div className="h-3 bg-earth-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Filter size={48} className="mx-auto text-earth-300 mb-4" />
              <p className="text-earth-500 text-lg">No products found.</p>
              <button onClick={() => { setSearch(''); setCategory('All') }} className="btn-ghost mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-earth-500 text-sm mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map(product => (
                  <div key={product.id} className="card group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image_url || getStorageUrl('products', product.image_path)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg' }}
                      />
                    </div>
                    <div className="p-5">
                      <span className="badge text-xs mb-2">{product.category}</span>
                      <h3 className="font-display font-semibold text-lg text-earth-900 mb-1">{product.name}</h3>
                      <p className="text-earth-500 text-sm leading-relaxed">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
