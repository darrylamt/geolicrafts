import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useI18n } from '../i18n'
import Seo from '../components/ui/Seo'
import { useQuote } from '../context/QuoteContext'
import { useProducts, findProduct, galleryFor, imageFor, quoteEntry, onImgError } from '../lib/products'
import { productPath, whatsappLink } from '../lib/site'
import QtyStepper from '../components/ui/QtyStepper'
import { WhatsAppIcon } from '../components/ui/WhatsAppButton'
import ShareButton from '../components/ui/ShareButton'

export default function ProductPage() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-20 container-page grid lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
        <div className="aspect-square rounded-[2rem] bg-stone-200/70" />
        <div className="space-y-4 py-4">
          <div className="h-3 w-1/4 rounded-full bg-stone-200/70" />
          <div className="h-12 w-3/4 rounded-full bg-stone-200/70" />
          <div className="h-4 w-full rounded-full bg-stone-200/70" />
          <div className="h-4 w-2/3 rounded-full bg-stone-200/70" />
        </div>
      </div>
    )
  }

  const product = findProduct(products, slug)

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-24">
        <h1 className="text-5xl md:text-7xl text-stone-900 mb-8">{t('product.notFoundTitle')}</h1>
        <Link to="/products" className="btn-primary">
          <ArrowLeft size={16} /> {t('product.notFoundCta')}
        </Link>
      </div>
    )
  }

  // key resets gallery/quantity state when navigating between products
  return <ProductDetail key={product.id} product={product} products={products} />
}

function ProductDetail({ product, products }) {
  const { t, tc } = useI18n()
  const { items, add } = useQuote()
  const images = galleryFor(product)
  const [active, setActive] = useState(0)
  const existing = items.find(i => i.id === product.id)
  const [qty, setQty] = useState(existing?.qty || 1)

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const specs = [
    ['dimensions', product.dimensions],
    ['materials', product.materials],
    ['colors', product.colors],
    ['minOrder', product.min_order],
    ['leadTime', product.lead_time],
    ['madeIn', t('product.madeInValue')],
    ['availability', t('product.availabilityValue')],
    ['shipping', t('product.shippingValue')],
  ].filter(([, v]) => v)

  const addToQuote = () => {
    add(quoteEntry(product), qty)
    toast.success(t('products.added'))
  }

  return (
    <>
      <Seo title={product.name} description={product.description} image={`/api/og?type=product&slug=${encodeURIComponent(productPath(product).split('/').pop())}`} type="product" />

      <section className="pt-20 md:pt-32 pb-14 md:pb-28">
        <div className="container-page">
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="btn-ghost btn-sm -ml-3 mb-3 md:mb-6">
            <ArrowLeft size={14} /> {tc(product.category)}
          </Link>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-16">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="aspect-square rounded-3xl md:rounded-[2rem] overflow-hidden bg-stone-100">
                <img
                  src={images[active]}
                  alt={product.name}
                  onError={onImgError}
                  className="w-full h-full object-cover animate-fade-in"
                  key={images[active]}
                />
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-3">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      aria-label={`Image ${i + 1}`}
                      aria-current={i === active}
                      className={`aspect-square rounded-xl overflow-hidden bg-stone-100 transition ${
                        i === active ? 'ring-2 ring-stone-900 ring-offset-2 ring-offset-stone-50' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" onError={onImgError} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-5 lg:pt-4">
              <div className="lg:sticky lg:top-28">
                <span className="chip">{tc(product.category)}</span>
                <h1 className="mt-4 md:mt-5 text-4xl md:text-6xl leading-[0.95] text-stone-900">{product.name}</h1>
                {product.description && (
                  <p className="mt-4 md:mt-6 text-stone-600 md:text-lg leading-relaxed whitespace-pre-line">{product.description}</p>
                )}

                <dl className="mt-6 md:mt-8 border-t border-stone-200">
                  {specs.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-6 py-3 md:py-3.5 border-b border-stone-200 text-sm">
                      <dt className="text-stone-500">{t(`product.${key}`)}</dt>
                      <dd className="text-stone-900 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3">
                  <QtyStepper value={qty} onChange={setQty} label={t('product.quantity')} />
                  <button onClick={addToQuote} className="btn-primary btn-lg flex-1 min-w-[12rem]">
                    {existing ? <><Check size={16} /> {t('product.updateQuote')}</> : t('product.addToQuote')}
                  </button>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-3 mt-3">
                  <a
                    href={whatsappLink(t('product.whatsappText', { name: product.name }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary btn-lg"
                  >
                    <span className="text-[#25D366]"><WhatsAppIcon size={18} /></span> {t('product.askWhatsapp')}
                  </a>
                  <ShareButton title={product.name} text={product.description || product.name} />
                </div>
                <Link
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Mail size={14} /> {t('product.emailEnquiry')}
                </Link>

                <p className="mt-6 md:mt-8 text-xs text-stone-400 leading-relaxed">{t('product.handmade')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-14 md:py-28 bg-white">
          <div className="container-page">
            <div className="flex items-end justify-between gap-6 mb-6 md:mb-10">
              <h2 className="text-3xl md:text-5xl leading-[1] text-stone-900">
                {t('product.related', { category: tc(product.category) })}
              </h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="link-arrow shrink-0 hidden sm:inline-flex">
                {t('home.collections.viewAll')} <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-4 md:gap-x-6 md:gap-y-10">
              {related.map(p => (
                <Link key={p.id} to={productPath(p)} className="group">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={imageFor(p)}
                      alt={p.name}
                      loading="lazy"
                      onError={onImgError}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-3 md:mt-4 font-sans text-[15px] font-medium tracking-normal text-stone-900 group-hover:text-clay-700 transition-colors">
                    {p.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
