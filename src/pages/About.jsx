import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, Leaf } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { useI18n } from '../i18n'
import Seo from '../components/ui/Seo'

// Paired by index with about.values.items / about.facility.items in the dictionaries
const valueIcons = [Award, Users, Globe, Leaf]
const facilityImages = ['/pics/adminblock.webp', '/pics/trainingbuilding1.webp', '/pics/warehouse1.webp']

export default function About() {
  const { t } = useI18n()

  return (
    <>
      <Seo title={t('nav.about')} description={t('about.beginning.p1')} />
      <PageHeader
        eyebrow={t('about.eyebrow')}
        title={<>{t('about.title')} <em className="text-clay-600">{t('about.titleEm')}</em></>}
        description={t('about.intro')}
      />

      {/* ─── Hero image ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-200">
            <img
              src="/pics/workers.webp"
              alt="Artisans carving drums in the Dodowa workshop"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── Founder story ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{t('about.beginning.eyebrow')}</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900">{t('about.beginning.title')}</h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-stone-600 text-lg leading-relaxed">
            <p>{t('about.beginning.p1')}</p>
            <p>
              {t('about.beginning.p2')} <span className="text-stone-900 font-medium">{t('about.beginning.p2Strong')}</span>.
            </p>
            <blockquote className="!mt-12 pl-6 border-l-2 border-clay-500">
              <p className="font-display text-3xl leading-snug text-stone-900">{t('about.beginning.quote')}</p>
              <footer className="mt-4 text-sm text-stone-500">{t('about.beginning.quoteBy')}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <p className="eyebrow mb-5">{t('about.values.eyebrow')}</p>
          <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 max-w-2xl mb-14">{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 rounded-2xl overflow-hidden ring-1 ring-stone-200">
            {t('about.values.items').map(({ title, text }, i) => {
              const Icon = valueIcons[i]
              return (
                <div key={title} className="bg-white p-8">
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-clay-50 text-clay-600 mb-8">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-sans text-base font-semibold tracking-normal text-stone-900 mb-2">{title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-5">{t('about.journey.eyebrow')}</p>
              <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900">{t('about.journey.title')}</h2>
            </div>
          </div>
          <ol className="lg:col-span-8 border-t border-stone-200">
            {t('about.journey.milestones').map(({ year, text }) => (
              <li key={year} className="grid grid-cols-12 gap-4 py-7 border-b border-stone-200">
                <span className="col-span-12 sm:col-span-3 font-display text-4xl text-clay-600 leading-none">{year}</span>
                <span className="col-span-12 sm:col-span-9 text-stone-600 leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Training centre ─── */}
      <section className="py-20 md:py-28 bg-stone-950 text-white">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-stone-800">
            <img
              src="/pics/trainingschoolbuilding.webp"
              alt="Dodowa Training Centre building"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-5">{t('about.training.eyebrow')}</p>
            <h2 className="text-4xl md:text-6xl leading-[1] mb-8">{t('about.training.title')}</h2>
            <div className="space-y-5 text-stone-300 leading-relaxed">
              <p>{t('about.training.p1')}</p>
              <p>{t('about.training.p2')}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="font-display text-5xl text-clay-300">2,000+</p>
                <p className="text-sm text-stone-400 mt-2">{t('about.training.stat1')}</p>
              </div>
              <div>
                <p className="font-display text-5xl text-clay-300">$1M+</p>
                <p className="text-sm text-stone-400 mt-2">{t('about.training.stat2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Facility ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow mb-5">{t('about.facility.eyebrow')}</p>
          <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-14">{t('about.facility.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {t('about.facility.items').map((label, i) => (
              <figure key={label}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200">
                  <img src={facilityImages[i]} alt={label} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="mt-4 text-sm text-stone-600">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Leadership ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="card p-6 sm:p-10 md:p-12 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <img
              src="/pics/founder.webp"
              alt="George Akologo"
              loading="lazy"
              className="md:col-span-4 w-full aspect-square rounded-2xl object-cover object-top"
            />
            <div className="md:col-span-8">
              <p className="eyebrow mb-4">{t('about.leadership.eyebrow')}</p>
              <h3 className="text-4xl md:text-5xl text-stone-900">George Akologo</h3>
              <p className="text-sm text-clay-600 mt-2 mb-6">{t('about.leadership.role')}</p>
              <p className="text-stone-600 leading-relaxed max-w-xl">{t('about.leadership.text')}</p>
              <Link to="/contact" className="btn-primary mt-8">
                {t('about.leadership.cta')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
