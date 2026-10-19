import { useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, Plus, Check, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import { useI18n } from '../i18n'
import Seo from '../components/ui/Seo'
import { useQuote } from '../context/QuoteContext'
import { useProducts, imageFor, quoteEntry, onImgError } from '../lib/products'
import { useCategories } from '../lib/content'
import { productPath } from '../lib/site'

const PAGE_SIZE = 12
const SORTS = ['featured', 'newest', 'name']

export default function Products() {
  const { products, loading } = useProducts()
  const { t, tc } = useI18n()
  const [params, setParams] = useSearchParams()
  // ?q= pre-fills the search (old WordPress product links redirect here as /products?q=djembe-carved-2)
  const [search, setSearch] = useState(() =>
    (params.get('q') || '').replace(/-\d+$/, '').replace(/[-_]+/g, ' ').trim()
  )
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('featured')
  const ALL_CATEGORIES = ['All', ...useCategories(products)]
  const searchRef = useRef()
  const gridRef = useRef()

  const category = ALL_CATEGORIES.includes(params.get('category')) ? params.get('category') : 'All'

  const q = search.trim().toLowerCase()
  const filtered = products.filter(p => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    return matchesSearch && (category === 'All' || p.category === category)
  })
  // Products arrive in the "featured" order; other sorts are applied on top
  if (sort === 'newest') filtered.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))

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
      <Seo title={category === 'All' ? t('nav.collections') : tc(category)} description={t('products.intro')} />
      <PageHeader
        eyebrow={t('products.eyebrow')}
        title={<>{t('products.title')} <em className="text-clay-600">{t('products.titleEm')}</em></>}
        description={t('products.intro')}
      >
        <Link to="/catalogue" className="btn-secondary mt-8">
          <Download size={15} /> {t('products.catalogue')}
        </Link>
      </PageHeader>

      {/* ─── Filter bar ─── */}
      <div className="sticky top-16 md:top-[72px] z-30 bg-stone-50/85 backdrop-blur-xl border-y border-stone-200/70">
        <div className="container-page py-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:w-72 shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder={t('products.search')}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input h-10 rounded-full pl-10 pr-10"
              aria-label={t('products.search')}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchRef.current?.focus() }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 icon-btn h-7 w-7"
                aria-label={t('products.clearSearch')}
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
                {tc(cat)}
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
              <p className="font-display text-4xl text-stone-900 mb-3">{t('products.emptyTitle')}</p>
              <p className="text-stone-500 mb-8">{t('products.emptyText')}</p>
              <button onClick={clearAll} className="btn-secondary">{t('common.clearFilters')}</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-stone-500 tabular-nums">
                  {filtered.length === 1 ? t('products.piece') : t('products.pieces', { count: filtered.length })}
                  {category !== 'All' && <> {t('products.in')} <span className="text-stone-900">{tc(category)}</span></>}
                </p>
                <div className="flex items-center gap-1">
                  {hasActiveFilter && (
                    <button onClick={clearAll} className="btn-ghost btn-sm">
                      <X size={14} /> {t('common.clear')}
                    </button>
                  )}
                  <label className="sr-only" htmlFor="sort">{t('products.sort')}</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1) }}
                    className="input h-9 w-auto rounded-full text-[13px] bg-transparent ring-0 hover:bg-stone-900/5 focus:ring-2"
                  >
                    {SORTS.map(s => <option key={s} value={s}>{t(`products.sort_${s}`)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                {paginated.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={changePage}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                labels={{ showing: t('common.showing'), of: t('common.of'), previous: t('common.previous'), next: t('common.next') }}
                className="mt-16 pt-8 border-t border-stone-200"
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}

function ProductCard({ product }) {
  const { t, tc } = useI18n()
  const { add, has } = useQuote()
  const inQuote = has(product.id)

  const quickAdd = e => {
    e.preventDefault()
    if (inQuote) return
    add(quoteEntry(product))
    toast.success(t('products.added'))
  }

  return (
    <Link to={productPath(product)} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 ring-offset-4 ring-offset-stone-50 group-focus-visible:ring-2 group-focus-visible:ring-clay-500">
        <img
          src={imageFor(product)}
          alt={product.name}
          loading="lazy"
          onError={onImgError}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <button
          onClick={quickAdd}
          aria-label={inQuote ? t('products.inQuote') : t('products.addToQuote')}
          title={inQuote ? t('products.inQuote') : t('products.addToQuote')}
          className={`absolute right-3 bottom-3 grid place-items-center h-10 w-10 rounded-full shadow-md transition-all duration-300 ${
            inQuote
              ? 'bg-stone-900 text-white'
              : 'bg-white/95 text-stone-900 hover:bg-stone-900 hover:text-white lg:opacity-0 lg:translate-y-1 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 focus-visible:opacity-100'
          }`}
        >
          {inQuote ? <Check size={16} /> : <Plus size={16} />}
        </button>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-stone-900 shadow-sm">
            {t('products.featured')}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-stone-500">{tc(product.category)}</p>
      <h3 className="mt-1 font-sans text-[15px] font-medium tracking-normal text-stone-900 leading-snug group-hover:text-clay-700 transition-colors">
        {product.name}
      </h3>
    </Link>
  )
}
