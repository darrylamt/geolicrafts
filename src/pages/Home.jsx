import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

/* ── image constants ── */
const IMG = {
  dundum:      'https://geolicrafts.com/wp-content/uploads/2023/05/465c92b360326a2a3dc707771cc4e622-drums-instruments.jpg',
  roundBasket: 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg',
  mask:        'https://geolicrafts.com/wp-content/uploads/2023/05/9oNj9bg.jpg',
  // Real on-site photos
  workshop:  '/pics/workers.jpeg',
  process:   '/pics/process.jpeg',
  workers1:  '/pics/workers1.jpeg',
  training:  '/pics/training.jpeg',
  warehouse: '/pics/warehouse2.jpeg',
  founder:   '/pics/founder.jpeg',
}

const categories = [
  {
    title: 'African Drums',
    category: 'Musical Instruments',
    image: IMG.dundum,
    items: ['Djembe', 'Dundum', 'Ashiko', 'Bougarabou'],
  },
  {
    title: 'Bolga Baskets',
    category: 'Baskets & Weaving',
    image: IMG.roundBasket,
    items: ['Round', 'Oval', 'Laundry', 'Shopper'],
  },
  {
    title: 'Crafts & Fashion',
    category: 'Textiles & Fashion',
    image: IMG.mask,
    items: ['Masks', 'Fabric fans', 'Straw hats', 'Bells'],
  },
]

const stats = [
  { value: '20+', label: 'Years of craft' },
  { value: '65+', label: 'Master artisans' },
  { value: '2,000+', label: 'Youth trained' },
  { value: '90%', label: 'Exported globally' },
]

const process = [
  { img: IMG.process, title: 'Wood carving', text: 'Drum bodies shaped by hand from a single Tweneboa log.' },
  { img: IMG.workers1, title: 'Basket weaving', text: 'Elephant grass woven in tight spirals, Bolgatanga-style.' },
  { img: IMG.training, title: 'Fashion & sewing', text: 'New skills for rural women and youth at our training centre.' },
]

const markets = [
  { country: 'Germany', role: 'Primary market' },
  { country: 'Italy', role: 'Key retailer' },
  { country: 'United States', role: 'Major importer' },
  { country: 'United Kingdom', role: 'Export market' },
  { country: 'Netherlands', role: 'Distribution' },
  { country: 'Ghana', role: 'Home' },
]

const milestones = [
  { year: '2004', title: 'The foundation', text: 'George Akologo registers Geolicrafts in Accra with 4 local carvers.' },
  { year: '2008', title: 'First export', text: 'First shipment of Bolga baskets reaches the United Kingdom.' },
  { year: '2012', title: 'Cooperative', text: 'Fair wages and profit-sharing model across 3 regions.' },
  { year: '2016', title: 'Training centre', text: 'Dodowa facility opens, certifying 200+ youths annually.' },
  { year: '2020', title: '$1M investment', text: 'Invest For Employment grants $1M+ to scale to 2,000+ trainees.' },
  { year: 'Today', title: 'Global reach', text: '90% export rate, 65+ artisans, shipping worldwide.' },
]

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
      <div>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 max-w-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end animate-fade-up">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-stone-300" />
                Dodowa, Ghana · Since 2004
              </p>
              <h1 className="text-[3.4rem] sm:text-7xl lg:text-[6.5rem] leading-[0.92] text-stone-900">
                Crafting Ghana's soul <em className="text-clay-600">into the world.</em>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Hand-carved drums, Bolga baskets and carvings — made by 65+ artisans and shipped to collectors and retailers on three continents.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary btn-lg">
                  Explore collections <ArrowRight size={16} />
                </Link>
                <Link to="/about" className="btn-ghost btn-lg">Our story</Link>
              </div>
            </div>
          </div>

          <div className="relative mt-14 md:mt-20 rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-200 animate-fade-up [animation-delay:120ms]">
            <img
              src={IMG.workshop}
              alt="Geolicrafts artisans carving drums at the Dodowa workshop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
            <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 flex items-center gap-3 rounded-full bg-white/85 backdrop-blur-md pl-2 pr-5 py-2 shadow-lg shadow-stone-950/10">
              <span className="grid place-items-center h-8 w-8 rounded-full bg-clay-600 text-white text-xs font-semibold">65+</span>
              <span className="text-sm text-stone-800">Artisans at work in Dodowa</span>
            </div>
          </div>

          {/* Stats */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-14 md:mt-20 pt-10 border-t border-stone-200">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-5xl md:text-6xl text-stone-900 leading-none">{value}</dd>
                <p className="mt-3 text-sm text-stone-500">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Collections ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <SectionHead
            eyebrow="Collections"
            title="Three traditions, one workshop."
            action={
              <Link to="/products" className="link-arrow hidden md:inline-flex shrink-0">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {categories.map(({ title, category, image, items }) => (
              <Link
                key={title}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-white/90 text-stone-900 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl text-stone-900">{title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-stone-500">{items.join(' · ')}</p>
              </Link>
            ))}
          </div>
          <Link to="/products" className="btn-secondary w-full mt-10 md:hidden">
            View all collections
          </Link>
        </div>
      </section>

      {/* ─── Story ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200">
            <img
              src={IMG.process}
              alt="Artisan carving a djembe drum by hand"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-5">Our story</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-8">
              From a workshop of five to a team of sixty-five.
            </h2>
            <div className="space-y-5 text-stone-600 leading-relaxed max-w-lg">
              <p>
                Founded in 2004 by George Akologo, Geolicrafts has grown into one of Ghana's leading craft exporters — sending authentic African drums, Bolga baskets and carvings to Europe, the USA and beyond.
              </p>
              <p>
                Our Training Centre in Dodowa, supported by over $1M from Invest For Employment, equips 2,000+ rural youth and women with craft skills for lasting livelihoods.
              </p>
            </div>
            <Link to="/about" className="link-arrow mt-10">
              More about us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <SectionHead eyebrow="The process" title="Crafted by hand, checked by eye." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {process.map(({ img, title, text }, i) => (
              <figure key={title}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
                  <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="mt-5 flex gap-4">
                  <span className="text-xs text-stone-400 tabular-nums pt-1.5">0{i + 1}</span>
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
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">Global reach</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-8">
              Made in Ghana. <em className="text-clay-600">Loved worldwide.</em>
            </h2>
            <p className="text-stone-600 leading-relaxed max-w-md">
              90% of everything we make is exported. From Dodowa to Amsterdam and New York, our pieces reach collectors, retailers and cultural enthusiasts across three continents.
            </p>
          </div>
          <ul className="lg:col-span-7 border-t border-stone-200 self-end">
            {markets.map(({ country, role }) => (
              <li key={country} className="group flex items-center justify-between py-5 border-b border-stone-200">
                <span className="font-display text-3xl text-stone-900 group-hover:translate-x-1 transition-transform">{country}</span>
                <span className="text-sm text-stone-500">{role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Warehouse ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-300">
            <img
              src={IMG.warehouse}
              alt="Geolicrafts export warehouse — hundreds of drums ready to ship"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-14">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-4">Export ready</p>
              <h2 className="text-4xl md:text-6xl text-white leading-[1] max-w-2xl">
                Packed, labelled and shipping every week.
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Journey ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <SectionHead eyebrow="Since 2004" title="The journey so far." />
          <ol className="border-t border-stone-200">
            {milestones.map(({ year, title, text }) => (
              <li key={year} className="grid grid-cols-12 gap-4 py-6 md:py-8 border-b border-stone-200">
                <span className="col-span-12 md:col-span-3 font-display text-4xl text-clay-600 leading-none">{year}</span>
                <span className="col-span-12 md:col-span-3 font-medium text-stone-900">{title}</span>
                <span className="col-span-12 md:col-span-6 text-stone-500 leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Founder ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200">
            <img
              src={IMG.founder}
              alt="George Akologo, Founder"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 20%' }}
            />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8">The founder</p>
            <blockquote className="font-display text-4xl md:text-5xl leading-[1.1] text-stone-900">
              “The wood speaks — our duty is simply to translate its language for the world.”
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-stone-300" />
              <div>
                <p className="font-medium text-stone-900">George Akologo</p>
                <p className="text-sm text-stone-500">Founder & Managing Director</p>
              </div>
            </div>
            <Link to="/about" className="link-arrow mt-10">
              Read the full story <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="rounded-[2rem] bg-clay-600 text-white px-6 py-16 sm:px-12 md:py-24 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-6">Akwaaba — welcome</p>
            <h2 className="text-5xl md:text-7xl leading-[0.95] max-w-3xl mx-auto">
              Let's make something together.
            </h2>
            <p className="mt-6 text-white/80 text-lg max-w-lg mx-auto">
              Buyers, partners and lovers of African craft — we'd love to hear from you.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-light btn-lg">
                Get in touch <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-outline-light btn-lg">Browse collections</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
