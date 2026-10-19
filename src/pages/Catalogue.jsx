import { Link } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { useI18n } from '../i18n'
import { useProducts, imageFor, onImgError, CATEGORIES } from '../lib/products'
import { SITE } from '../lib/site'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

// A print-optimised page: "Download PDF" opens the browser's print dialog,
// so the catalogue is always generated from the live product list.
export default function Catalogue() {
  const { t, tc, formatDate } = useI18n()
  const { products, loading } = useProducts()

  // Known categories first, then anything else found in the data
  const extra = [...new Set(products.map(p => p.category))].filter(c => !CATEGORIES.includes(c))
  const sections = [...CATEGORIES, ...extra]
    .map(cat => ({ cat, items: products.filter(p => p.category === cat) }))
    .filter(s => s.items.length)

  const spec = p => [p.dimensions, p.materials, p.min_order && `${t('product.minOrder')}: ${p.min_order}`].filter(Boolean).join(' · ')

  return (
    <div className="catalogue bg-stone-200 min-h-screen print:bg-white">
      <title>{`${t('catalogue.title')} — Geolicrafts`}</title>
      <style>{`
        @page { size: A4; margin: 14mm 12mm; }
        @media print {
          html, body { background: #fff !important; }
          .catalogue * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cat-sheet { box-shadow: none !important; margin: 0 !important; width: auto !important; padding: 0 !important; border-radius: 0 !important; }
          .cat-break { break-before: page; }
          .cat-item { break-inside: avoid; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-stone-50/90 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-[210mm] mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/products" className="btn-ghost btn-sm -ml-3">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">{t('catalogue.back')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => window.print()} disabled={loading} className="btn-primary btn-sm">
              <Download size={14} /> {t('catalogue.download')}
            </button>
          </div>
        </div>
      </div>
      <p className="print:hidden text-center text-xs text-stone-500 pt-4 px-4">{t('catalogue.hint')}</p>

      {loading ? (
        <p className="text-center text-stone-500 py-24">{t('catalogue.loading')}</p>
      ) : (
        <div className="cat-sheet bg-white max-w-[210mm] mx-auto my-6 sm:my-10 px-6 sm:px-14 py-12 shadow-xl sm:rounded-sm">
          {/* Cover */}
          <section className="min-h-[240mm] flex flex-col">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
              <span className="font-display text-2xl">Geolicrafts</span>
            </div>
            <div className="mt-auto mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-6">
                {t('catalogue.title')} · {formatDate(new Date(), { month: 'long', year: 'numeric' })}
              </p>
              <h1 className="font-display text-6xl sm:text-7xl leading-[0.95] text-stone-900">
                {t('home.title')} <em className="text-clay-600">{t('home.titleEm')}</em>
              </h1>
              <p className="mt-6 text-lg text-stone-500 max-w-md">{t('catalogue.subtitle')}</p>
            </div>
            <div className="h-56 rounded-2xl overflow-hidden bg-stone-200">
              <img src="/pics/workers.jpeg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mt-10 grid sm:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500 mb-3">{t('catalogue.contents')}</p>
                <ol className="space-y-1.5">
                  {sections.map(({ cat, items }, i) => (
                    <li key={cat} className="flex justify-between gap-4 border-b border-dotted border-stone-300 pb-1.5">
                      <span>{String(i + 1).padStart(2, '0')} &nbsp;{tc(cat)}</span>
                      <span className="text-stone-500 tabular-nums">{items.length === 1 ? t('products.piece') : t('catalogue.pieces', { count: items.length })}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500 mb-3">{t('catalogue.wholesale')}</p>
                <p>{SITE.email}</p>
                {SITE.phones.map(p => <p key={p}>{p}</p>)}
                <p className="text-stone-500 mt-2">{SITE.address}</p>
              </div>
            </div>
          </section>

          {/* Categories */}
          {sections.map(({ cat, items }, i) => (
            <section key={cat} className="cat-break pt-12">
              <div className="flex items-baseline justify-between gap-4 pb-4 mb-8 border-b-2 border-stone-900">
                <h2 className="font-display text-4xl text-stone-900">
                  <span className="text-clay-600 mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {tc(cat)}
                </h2>
                <span className="text-xs text-stone-500">{items.length === 1 ? t('products.piece') : t('catalogue.pieces', { count: items.length })}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                {items.map(p => (
                  <article key={p.id} className="cat-item">
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <img src={imageFor(p)} alt={p.name} onError={onImgError} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="mt-3 font-sans text-sm font-semibold tracking-normal text-stone-900 leading-snug">{p.name}</h3>
                    {p.description && <p className="mt-1 text-[11px] text-stone-500 leading-snug line-clamp-3">{p.description}</p>}
                    {spec(p) && <p className="mt-1.5 text-[11px] text-stone-700">{spec(p)}</p>}
                  </article>
                ))}
              </div>
            </section>
          ))}

          <footer className="cat-item mt-16 pt-6 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap justify-between gap-2">
            <span>{t('catalogue.footer')}</span>
            <span>geolicrafts.com · {SITE.email}</span>
          </footer>
        </div>
      )}
    </div>
  )
}
