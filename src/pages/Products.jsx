import { useState, useEffect, useRef } from 'react'
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getStorageUrl } from '../lib/supabase'
import KenteDivider from '../components/ui/KenteDivider'

const PAGE_SIZE = 12

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
  const [page, setPage] = useState(1)
  const searchRef = useRef()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setProducts(error || !data || data.length === 0 ? FALLBACK_PRODUCTS : data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (category === 'All' || p.category === category)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilter = search || category !== 'All'

  const handleFilterChange = (newSearch, newCategory) => {
    if (newSearch !== undefined) setSearch(newSearch)
    if (newCategory !== undefined) setCategory(newCategory)
    setPage(1)
  }

  return (
    <>
      {/* ─── Header ─── */}
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
            Our Collections
          </h1>
          <p className="text-forest-200 text-base max-w-xl mx-auto">
            Authentic African arts, musical instruments, and handcrafted gifts — each piece made with skill and cultural pride.
          </p>
        </div>
        <KenteDivider height={10} />
      </section>

      {/* ─── Sticky Filter Bar ─── */}
      <div className="sticky top-0 z-30 bg-[#F5F0E8] border-b border-[#3B1F0A]/10 shadow-sm">
        {/* Search row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => handleFilterChange(e.target.value, undefined)}
              className="w-full bg-white border border-[#3B1F0A]/15 rounded-lg pl-9 pr-9 py-2.5 text-sm text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-kente-400/50 focus:border-kente-400 transition-all"
            />
            {search && (
              <button
                onClick={() => { handleFilterChange('', undefined); searchRef.current?.focus() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category scroll row — single line, scrollable, no wrapping */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange(undefined, cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                  category === cat
                    ? 'bg-[#3B1F0A] text-[#F5A200]'
                    : 'bg-white border border-[#3B1F0A]/15 text-[#3B1F0A]/60 hover:border-[#3B1F0A]/40 hover:text-[#3B1F0A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Products Grid ─── */}
      <section className="py-8 md:py-12 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse shadow-sm">
                  <div className="aspect-square bg-sand-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-sand-200 rounded w-1/2" />
                    <div className="h-4 bg-sand-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <SlidersHorizontal size={40} className="mx-auto text-sand-300 mb-4" />
              <p className="text-sand-500 font-medium mb-1">No products found</p>
              <p className="text-sand-400 text-sm mb-6">Try a different search or category</p>
              <button
                onClick={() => { handleFilterChange('', 'All') }}
                className="px-5 py-2 bg-[#3B1F0A] text-white text-sm font-medium rounded-lg hover:bg-[#3B1F0A]/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Count + active filter indicator */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sand-500 text-xs">
                  {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                  {category !== 'All' && <span className="ml-1">in <span className="text-[#3B1F0A] font-medium">{category}</span></span>}
                </p>
                {hasActiveFilter && (
                  <button
                    onClick={() => handleFilterChange('', 'All')}
                    className="text-xs text-[#C1440E] hover:underline flex items-center gap-1"
                  >
                    <X size={11} /> Clear all
                  </button>
                )}
              </div>

              {/* 2-col mobile · 3-col tablet · 4-col desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {paginated.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#3B1F0A]/10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 text-sm text-[#3B1F0A]/60 hover:text-[#3B1F0A] disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-lg border border-[#3B1F0A]/15 bg-white hover:bg-[#3B1F0A]/5 transition-colors"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                        acc.push(p)
                        return acc
                      }, [])
                      .map((p, i) => (
                        <button
                          key={i}
                          onClick={() => typeof p === 'number' && setPage(p)}
                          className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                            p === page
                              ? 'bg-[#3B1F0A] text-[#F5A200]'
                              : typeof p === 'number'
                              ? 'bg-white border border-[#3B1F0A]/15 text-[#3B1F0A]/60 hover:bg-[#3B1F0A]/5'
                              : 'text-[#3B1F0A]/30 cursor-default'
                          }`}
                        >
                          {p}
                        </button>
                      ))
                    }
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 text-sm text-[#3B1F0A]/60 hover:text-[#3B1F0A] disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-lg border border-[#3B1F0A]/15 bg-white hover:bg-[#3B1F0A]/5 transition-colors"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Square image */}
      <div className="aspect-square overflow-hidden relative bg-sand-100">
        <img
          src={product.image_url || getStorageUrl('products', product.image_path)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg' }}
          loading="lazy"
        />
        {/* Category chip over image */}
        <span className="absolute top-2 left-2 bg-[#3B1F0A]/80 text-[#F5A200] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
          {product.category.split(' ')[0]}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-display font-semibold text-sm md:text-base text-[#3B1F0A] leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-[#3B1F0A]/50 text-xs leading-relaxed line-clamp-2 hidden sm:block">
          {product.description}
        </p>
      </div>

      {/* Kente bottom accent on hover */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-accra-500 via-kente-400 to-forest-600" />
    </div>
  )
}
