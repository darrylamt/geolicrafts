import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n'
import Seo from '../components/ui/Seo'
import { useProducts, imageFor, onImgError } from '../lib/products'
import { useTestimonials, usePartners } from '../lib/content'
import { productPath } from '../lib/site'

/* ── image constants ── */
const IMG = {
  dundum:      '/images/products/dundum-drums.webp',
  roundBasket: '/images/products/bolga-basket-round.webp',
  mask:        '/images/products/carved-mask.webp',
  // Real on-site photos
  workshop:  '/pics/workers.webp',
  process:   '/pics/process.webp',
  workers1:  '/pics/workers1.webp',
  training:  '/pics/training.webp',
  warehouse: '/pics/warehouse2.webp',
  founder:   '/pics/founder.webp',
}

// Paired by index with home.collections.items in the dictionaries
const categories = [
  { category: 'Musical Instruments', image: IMG.dundum },
  { category: 'Baskets & Weaving', image: IMG.roundBasket },
  { category: 'Textiles & Fashion', image: IMG.mask },
]
const processImages = [IMG.process, IMG.workers1, IMG.training]

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 md:mb-14">
      <div>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 max-w-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default function Home() {
  const { t } = useI18n()

  return (
    <div>
      <Seo description={t('home.intro')} />
      {/* ─── Hero ─── */}
      <section className="pt-24 md:pt-44 pb-14 md:pb-28">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end animate-fade-up">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-clay-400" />
                {t('home.eyebrow')}
              </p>
              <h1 className="text-[3.4rem] sm:text-7xl lg:text-[6.5rem] leading-[0.92] text-stone-900">
                {t('home.title')} <em className="text-clay-600">{t('home.titleEm')}</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="text-stone-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8">{t('home.intro')}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary btn-lg">
                  {t('home.explore')} <ArrowRight size={16} />
                </Link>
                <Link to="/about" className="btn-ghost btn-lg">{t('home.ourStory')}</Link>
              </div>
            </div>
          </div>

          <div className="relative mt-10 md:mt-20 rounded-3xl md:rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-200 animate-fade-up [animation-delay:120ms]">
            <img
              src={IMG.workshop}
              alt="Geolicrafts artisans carving drums at the Dodowa workshop"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
            <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 flex items-center gap-3 rounded-full bg-white/85 backdrop-blur-md pl-2 pr-5 py-2 shadow-lg shadow-stone-950/10">
              <span className="grid place-items-center h-8 w-8 rounded-full bg-clay-600 text-white text-xs font-semibold">65+</span>
              <span className="text-sm text-stone-800">{t('home.badge')}</span>
            </div>
          </div>

          {/* Stats */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mt-10 md:mt-20 pt-8 md:pt-10 border-t border-stone-200">
            {t('home.stats').map(({ value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-5xl md:text-6xl text-clay-600 leading-none">{value}</dd>
                <p className="mt-3 text-sm text-stone-500">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Collections ─── */}
      <section className="py-14 md:py-28 bg-clay-50">
        <div className="container-page">
          <SectionHead
            eyebrow={t('home.collections.eyebrow')}
            title={t('home.collections.title')}
            action={
              <Link to="/products" className="link-arrow hidden md:inline-flex shrink-0">
                {t('home.collections.viewAll')} <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t('home.collections.items').map(({ title, items }, i) => (
              <Link
                key={title}
                to={`/products?category=${encodeURIComponent(categories[i].category)}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={categories[i].image}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-white/90 text-stone-900 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <h3 className="mt-4 md:mt-5 text-3xl text-stone-900">{title}</h3>
                <p className="mt-1.5 text-sm text-stone-500">{items}</p>
              </Link>
            ))}
          </div>
          <Link to="/products" className="btn-secondary w-full mt-10 md:hidden">
            {t('home.collections.viewAllMobile')}
          </Link>
        </div>
      </section>

      <FeaturedProducts />

      {/* ─── Story ─── */}
      <section className="py-14 md:py-28">
        <div className="container-page grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <div className="relative aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200">
            <img
              src={IMG.process}
              alt="Artisan carving a djembe drum by hand"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-5">{t('home.story.eyebrow')}</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-6 md:mb-8">{t('home.story.title')}</h2>
            <div className="space-y-5 text-stone-600 leading-relaxed max-w-lg">
              <p>{t('home.story.p1')}</p>
              <p>{t('home.story.p2')}</p>
            </div>
            <Link to="/about" className="link-arrow mt-10">
              {t('home.story.cta')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="py-14 md:py-28 bg-ochre-50">
        <div className="container-page">
          <SectionHead eyebrow={t('home.process.eyebrow')} title={t('home.process.title')} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 md:gap-6">
            {t('home.process.steps').map(({ title, text }, i) => (
              <figure key={title}>
                <div className="aspect-[4/3] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
                  <img src={processImages[i]} alt={title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="mt-4 md:mt-5 flex gap-4">
                  <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-ochre-400 text-stone-900 text-xs font-semibold tabular-nums">0{i + 1}</span>
                  <div>
                    <p className="font-medium text-stone-900">{title}</p>
                    <p className="text-sm text-stone-500 mt-1 leading-relaxed">{text}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Global reach ─── */}
      <section className="py-14 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{t('home.reach.eyebrow')}</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-8">
              {t('home.reach.title')} <em className="text-clay-600">{t('home.reach.titleEm')}</em>
            </h2>
            <p className="text-stone-600 leading-relaxed max-w-md">{t('home.reach.text')}</p>
          </div>
          <ul className="lg:col-span-7 border-t border-stone-200 self-end">
            {t('home.reach.markets').map(({ country, role }) => (
              <li key={country} className="group flex items-center justify-between gap-4 py-4 md:py-5 border-b border-stone-200">
                <span className="font-display text-2xl md:text-3xl text-stone-900 group-hover:translate-x-1 group-hover:text-clay-600 transition">{country}</span>
                <span className="text-sm text-stone-500 text-right">{role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Warehouse ─── */}
      <section className="pb-14 md:pb-28">
        <div className="container-page">
          <div className="relative rounded-3xl md:rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-300">
            <img
              src={IMG.warehouse}
              alt="Geolicrafts export warehouse — hundreds of drums ready to ship"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-4">{t('home.warehouse.eyebrow')}</p>
              <h2 className="text-4xl md:text-6xl text-white leading-[1] max-w-2xl">{t('home.warehouse.title')}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Journey ─── */}
      <section className="py-14 md:py-28 bg-forest-900 text-white [&_h2]:text-white [&_.eyebrow]:text-ochre-300">
        <div className="container-page">
          <SectionHead eyebrow={t('home.journey.eyebrow')} title={t('home.journey.title')} />
          <ol className="border-t border-white/15">
            {t('home.journey.milestones').map(({ year, title, text }) => (
              <li key={year} className="grid grid-cols-12 gap-x-4 gap-y-2 py-5 md:py-8 border-b border-white/15">
                <span className="col-span-12 md:col-span-3 font-display text-4xl text-ochre-300 leading-none">{year}</span>
                <span className="col-span-12 md:col-span-3 font-medium text-white">{title}</span>
                <span className="col-span-12 md:col-span-6 text-white/70 leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Founder ─── */}
      <section className="py-14 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200">
            <img
              src={IMG.founder}
              alt="George Akologo"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 20%' }}
            />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 md:mb-8">{t('home.founder.eyebrow')}</p>
            <blockquote className="font-display text-3xl md:text-5xl leading-[1.1] text-stone-900">
              {t('home.founder.quote')}
            </blockquote>
            <div className="mt-6 md:mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-clay-400" />
              <div>
                <p className="font-medium text-stone-900">George Akologo</p>
                <p className="text-sm text-stone-500">{t('home.founder.role')}</p>
              </div>
            </div>
            <Link to="/about" className="link-arrow mt-10">
              {t('home.founder.cta')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ─── CTA ─── */}
      <section className="pb-14 md:pb-28">
        <div className="container-page">
          <div className="rounded-3xl md:rounded-[2rem] bg-clay-600 text-white px-6 py-12 sm:px-12 md:py-24 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-6">{t('home.cta.eyebrow')}</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl leading-[0.95] max-w-3xl mx-auto">{t('home.cta.title')}</h2>
            <p className="mt-6 text-white/80 text-lg max-w-lg mx-auto">{t('home.cta.text')}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-light btn-lg">
                {t('home.cta.primary')} <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-outline-light btn-lg">{t('home.cta.secondary')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Shown only when products are marked "featured" in the admin
function FeaturedProducts() {
  const { t, tc } = useI18n()
  const { products } = useProducts()
  const featured = products.filter(p => p.featured).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section className="py-14 md:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow={t('home.featured.eyebrow')}
          title={t('home.featured.title')}
          action={
            <Link to="/products" className="link-arrow hidden md:inline-flex shrink-0">
              {t('home.collections.viewAll')} <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {featured.map(p => (
            <Link key={p.id} to={productPath(p)} className="group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={imageFor(p)}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  onError={onImgError}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-4 text-xs text-stone-500">{tc(p.category)}</p>
              <h3 className="mt-1 font-sans text-[15px] font-medium tracking-normal text-stone-900 group-hover:text-clay-700 transition-colors">
                {p.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Shown only once testimonials or partner logos are added in Admin → Testimonials
function Testimonials() {
  const { t } = useI18n()
  const testimonials = useTestimonials()
  const partners = usePartners()
  if (testimonials.length === 0 && partners.length === 0) return null

  return (
    <section className="py-14 md:py-28 bg-white">
      <div className="container-page">
        {testimonials.length > 0 && (
          <>
            <SectionHead eyebrow={t('home.trust.eyebrow')} title={t('home.trust.title')} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.slice(0, 6).map(item => (
                <figure key={item.id} className="rounded-2xl bg-stone-50 ring-1 ring-stone-200/70 p-7 md:p-8 flex flex-col">
                  <blockquote className="font-display text-2xl leading-snug text-stone-900 flex-1">“{item.quote}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-clay-100 text-clay-700 text-sm font-semibold uppercase">
                      {item.name?.[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-stone-900">{item.name}</span>
                      <span className="block text-xs text-stone-500 truncate">
                        {[item.role, item.company, item.country].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {partners.length > 0 && (
          <div className={testimonials.length > 0 ? 'mt-20' : ''}>
            <p className="eyebrow text-center mb-10">{t('home.trust.partners')}</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {partners.map(partner => {
                const logo = (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    loading="lazy"
                    className="h-10 md:h-12 w-auto max-w-[160px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition"
                  />
                )
                return (
                  <li key={partner.id}>
                    {partner.website
                      ? <a href={partner.website} target="_blank" rel="noopener noreferrer" title={partner.name}>{logo}</a>
                      : logo}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
