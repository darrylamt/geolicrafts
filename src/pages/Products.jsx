import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getStorageUrl } from '../lib/supabase'
import KenteDivider from '../components/ui/KenteDivider'

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Djembe Drum', category: 'Musical Instruments', description: 'Hand-carved djembe drum made from authentic Ghanaian wood with goat-skin head.', image_url: 'https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=600&q=80' },
  { id: 2, name: 'Bolga Basket (Large)', category: 'Baskets & Weaving', description: 'Traditional woven basket from Bolgatanga, crafted by skilled women artisans.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 3, name: 'Kente Wall Art', category: 'Textiles & Fashion', description: 'Framed Kente cloth wall art celebrating Ghana\'s royal weaving tradition.', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80' },
  { id: 4, name: 'Carved Mask', category: 'Wood Carvings', description: 'Decorative hand-carved wooden mask, inspired by traditional Ghanaian masquerade.', image_url: 'https://images.unsplash.com/photo-1605812830455-2fadc57dc68d?w=600&q=80' },
  { id: 5, name: 'Talking Drum', category: 'Musical Instruments', description: 'Hourglass-shaped talking drum used in traditional Ghanaian ceremonies.', image_url: 'https://images.unsplash.com/photo-1567504586306-49050d59f8d3?w=600&q=80' },
  { id: 6, name: 'Straw Hat', category: 'Baskets & Weaving', description: 'Hand-woven straw hat with intricate geometric patterns.', image_url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80' },
  { id: 7, name: 'Fertility Doll', category: 'Wood Carvings', description: 'Traditional Akuaba fertility doll carved from dark Ghanaian wood.', image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80' },
  { id: 8, name: 'Batik Fabric', category: 'Textiles & Fashion', description: 'Hand-dyed batik fabric using traditional resist-dyeing techniques.', image_url: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=600&q=80' },
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
        <div className="absolute inset-0 adinkra-bg opacity-50 pointer-events-none" />
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
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80' }}
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
