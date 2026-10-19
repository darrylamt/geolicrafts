import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { supabase, getStorageUrl } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'

const PAGE_SIZE = 12
const FALLBACK_IMG = 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg'

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

const ALL_CATEGORIES = ['All', 'Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion', 'Gifts & Souvenirs']

const imageFor = p => p.image_url || getStorageUrl('products', p.image_path) || FALLBACK_IMG

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [active, setActive] = useState(null)
  const [params, setParams] = useSearchParams()
  const searchRef = useRef()
  const gridRef = useRef()

  const category = ALL_CATEGORIES.includes(params.get('category')) ? params.get('category') : 'All'

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

  const q = search.trim().toLowerCase()
  const filtered = products.filter(p => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    return matchesSearch && (category === 'All' || p.category === category)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilter = search || category !== 'All'

  const setCategory = cat => {
    setPage(1)
    setParams(cat === 'All' ? {} : { category: cat }, { replace: true })
  }

  const changePage = p => {
    setPage(p)
    const top = gridRef.current?.getBoundingClientRect().top + window.scrollY - 160
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const clearAll = () => {
    setSearch('')
    setCategory('All')
  }

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title={<>Objects made <em className="text-clay-600">by hand.</em></>}
        description="Drums, baskets, carvings and textiles — each piece made in Dodowa with skill and cultural pride."
      />

      {/* ─── Filter bar ─── */}
      <div className="sticky top-16 md:top-[72px] z-30 bg-stone-50/85 backdrop-blur-xl border-y border-stone-200/70">
        <div className="container-page py-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:w-72 shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search the collection"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input h-10 rounded-full pl-10 pr-10"
              aria-label="Search products"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchRef.current?.focus() }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 icon-btn h-7 w-7"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`shrink-0 h-10 px-4 rounded-full text-sm transition-colors ${
                  category === cat
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-900/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Grid ─── */}
      <section ref={gridRef} className="py-10 md:py-14 min-h-[60vh]">
        <div className="container-page">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-2xl bg-stone-200/70" />
                  <div className="mt-4 h-3 w-1/3 rounded-full bg-stone-200/70" />
                  <div className="mt-2 h-4 w-2/3 rounded-full bg-stone-200/70" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-4xl text-stone-900 mb-3">Nothing found.</p>
              <p className="text-stone-500 mb-8">Try a different search or category.</p>
              <button onClick={clearAll} className="btn-secondary">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-stone-500 tabular-nums">
                  {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                  {category !== 'All' && <> in <span className="text-stone-900">{category}</span></>}
                </p>
                {hasActiveFilter && (
                  <button onClick={clearAll} className="btn-ghost btn-sm -mr-3">
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                {paginated.map(product => (
                  <ProductCard key={product.id} product={product} onOpen={() => setActive(product)} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={changePage}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                className="mt-16 pt-8 border-t border-stone-200"
              />
            </>
          )}
        </div>
      </section>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </>
  )
}

function ProductCard({ product, onOpen }) {
  return (
    <button onClick={onOpen} className="group text-left focus-visible:outline-none">
      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 ring-offset-4 ring-offset-stone-50 group-focus-visible:ring-2 group-focus-visible:ring-clay-500">
        <img
          src={imageFor(product)}
          alt={product.name}
          loading="lazy"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-4 text-xs text-stone-500">{product.category}</p>
      <h3 className="mt-1 font-sans text-[15px] font-medium tracking-normal text-stone-900 leading-snug group-hover:text-clay-700 transition-colors">
        {product.name}
      </h3>
    </button>
  )
}

function ProductModal({ product, onClose }) {
  return (
    <Modal open={!!product} onClose={onClose} size="xl">
      {product && (
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto md:min-h-[480px] bg-stone-100 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl overflow-hidden">
            <img
              src={imageFor(product)}
              alt={product.name}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-10 flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <span className="chip">{product.category}</span>
              <button onClick={onClose} className="icon-btn -mt-1 -mr-2" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <h2 className="mt-6 text-4xl md:text-5xl leading-[1] text-stone-900">{product.name}</h2>
            {product.description && (
              <p className="mt-5 text-stone-600 leading-relaxed">{product.description}</p>
            )}
            <ul className="mt-8 space-y-3 text-sm border-t border-stone-100 pt-6">
              <li className="flex justify-between"><span className="text-stone-500">Made in</span><span className="text-stone-900">Dodowa, Ghana</span></li>
              <li className="flex justify-between"><span className="text-stone-500">Availability</span><span className="text-stone-900">Retail & wholesale</span></li>
              <li className="flex justify-between"><span className="text-stone-500">Shipping</span><span className="text-stone-900">Worldwide</span></li>
            </ul>
            <div className="mt-auto pt-10">
              <Link
                to={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn-primary btn-lg w-full"
              >
                Enquire about this piece <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
