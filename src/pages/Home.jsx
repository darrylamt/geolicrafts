import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import KenteDivider from '../components/ui/KenteDivider'

/* ── image constants ── */
const IMG = {
  hero:      'https://geolicrafts.com/wp-content/uploads/2023/02/Geolicrafts-Website-Banner-01.jpg',
  djembe:    'https://geolicrafts.com/wp-content/uploads/2023/05/afroton-ads02-djembe-standard-30-32-cm_1_DRU0041870-000-690x690.jpg',
  djembeCarved: 'https://geolicrafts.com/wp-content/uploads/2023/05/DRU707a_c4c5f1e2-41a8-4e85-b688-5e56d79a88ef_grande.webp',
  djembePro: 'https://geolicrafts.com/wp-content/uploads/2023/05/546603.jpg',
  dundum:    'https://geolicrafts.com/wp-content/uploads/2023/05/465c92b360326a2a3dc707771cc4e622-drums-instruments.jpg',
  ashiko:    'https://geolicrafts.com/wp-content/uploads/2023/05/ashiko-drum-terre-500x500.jpg',
  roundBasket:  'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg',
  ovalBasket:   'https://geolicrafts.com/wp-content/uploads/2023/07/e74c6a66-5ad9-57dd-a852-a38c82b27660__50419.jpg',
  laundryBasket:'https://geolicrafts.com/wp-content/uploads/2023/05/102193.jpg',
  youthBasket:  'https://geolicrafts.com/wp-content/uploads/2023/05/IMG_2216-500x500.jpg',
  mask:      'https://geolicrafts.com/wp-content/uploads/2023/05/9oNj9bg.jpg',
  fan:       'https://geolicrafts.com/wp-content/uploads/2023/05/51vp1k5fpCL._SX466.jpg',
  hat:       'https://geolicrafts.com/wp-content/uploads/2023/05/billabong-5693-8086126-1.jpg',
  george:    '/Akologo.jpeg',
  // Real on-site photos
  process:   '/pics/process.jpeg',
  workers1:  '/pics/workers1.jpeg',
  training:  '/pics/training.jpeg',
  warehouse: '/pics/warehouse2.jpeg',
  founder:   '/pics/founder.jpeg',
}

const categories = [
  {
    title: 'African Drums',
    image: IMG.dundum,
    items: ['Djembe Standard', 'Djembe Carved', 'Djembe Professional', 'Dundum', 'Ashiko', 'Bougarabou'],
  },
  {
    title: 'Bolga Baskets',
    image: IMG.roundBasket,
    items: ['Round Baskets', 'Oval Baskets', 'Laundry Baskets', 'Bicycle Baskets', 'Pot Baskets', 'Youth Shopper'],
  },
  {
    title: 'Crafts & Fashion',
    image: IMG.mask,
    items: ['African Masks', 'Fabric Fans', 'Straw Hats', 'Metal Bells', 'Key Holders', 'Accessories'],
  },
]

const collectionItems = [
  { title: 'Djembe Standard',     sub: 'Musical Instruments',  img: IMG.djembe,      tall: true  },
  { title: 'Round Basket',        sub: 'Baskets & Weaving',    img: IMG.roundBasket, tall: false },
  { title: 'African Mask',        sub: 'Wood Carvings',        img: IMG.mask,        tall: false },
  { title: 'Djembe Carved',       sub: 'Musical Instruments',  img: IMG.djembeCarved,tall: true  },
  { title: 'Oval Basket',         sub: 'Baskets & Weaving',    img: IMG.ovalBasket,  tall: false },
  { title: 'Fabric Fan',          sub: 'Crafts & Fashion',     img: IMG.fan,         tall: false },
  { title: 'Ashiko Drum',         sub: 'Musical Instruments',  img: IMG.ashiko,      tall: true  },
  { title: 'Straw Hat',           sub: 'Crafts & Fashion',     img: IMG.hat,         tall: false },
  { title: 'Laundry Basket',      sub: 'Baskets & Weaving',    img: IMG.laundryBasket,tall: false},
]

const milestones = [
  { year: '2004', title: 'The Foundation',    text: 'George Akologo registers Geolicrafts in Accra with 4 local carvers.' },
  { year: '2008', title: 'First Export',       text: 'First shipment of Bolga baskets reaches the United Kingdom.' },
  { year: '2012', title: 'Cooperative',        text: 'Fair wages and profit-sharing model across 3 regions.' },
  { year: '2016', title: 'Training Centre',    text: 'Dodowa facility opens, certifying 200+ youths annually.' },
  { year: '2020', title: '$1M Investment',     text: 'Invest For Employment grants $1M+ to scale to 2,000+ trainees.' },
  { year: 'Today','title': 'Global Reach',     text: '90% export rate, 65+ artisans, shipping worldwide.' },
]

/* ── Gallery item with hover overlay ── */
function GalleryItem({ img, title, sub, className = '' }) {
  return (
    <Link to="/products" className={`group relative overflow-hidden rounded-2xl block ${className}`}>
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#3B1F0A]/0 group-hover:bg-[#3B1F0A]/55 transition-all duration-300 rounded-2xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
        <p className="font-display font-black text-white text-xl md:text-2xl leading-tight drop-shadow-lg">{title}</p>
        <p className="text-white/70 text-xs tracking-widest uppercase mt-2 font-semibold">{sub}</p>
      </div>
    </Link>
  )
}

/* ── shared styles ── */
const RULE = 'border-t border-[#3B1F0A]/15 pt-4 mb-6'
const CAT_HEADING = 'font-display text-xl font-bold text-[#3B1F0A] tracking-tight flex items-center justify-between group-hover:text-[#C1440E] transition-colors'

export default function Home() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen">

      {/* ─── Hero ─── */}
      <section className="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
        <img
          src={IMG.hero}
          alt="Geolicrafts — Authentic African Craftsmanship"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B1F0A]/80 via-[#3B1F0A]/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-20">
          <p className="text-[#F5A200] text-[11px] tracking-[0.3em] uppercase font-semibold mb-4">
            Est. 2004 · Accra, Ghana
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white font-black leading-[1.05] max-w-4xl mb-8">
            Crafting Ghana's<br />Soul Into The World
          </h1>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 border border-white/50 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-8 py-3 hover:bg-white hover:text-[#3B1F0A] transition-all duration-300"
          >
            View Our Collections <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── 3-column category row ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#3B1F0A]/10">
          {categories.map(({ title, image, items }) => (
            <Link key={title} to="/products" className="group block px-0 md:px-8 first:pl-0 last:pr-0 py-8 md:py-0">
              <div className={RULE}>
                <h2 className={CAT_HEADING}>
                  {title}
                  <ArrowRight size={16} className="text-[#3B1F0A]/40 group-hover:text-[#C1440E] group-hover:translate-x-1 transition-all duration-200" />
                </h2>
              </div>
              <div className="overflow-hidden mb-5">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="text-sm text-[#3B1F0A]/70 border-b border-[#3B1F0A]/10 pb-2 hover:text-[#3B1F0A] transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={8} />

      {/* ─── Welcome / About ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
        {/* Left */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-20 bg-[#F5F0E8]">
          <p className="text-[#C1440E] text-[11px] tracking-[0.3em] uppercase font-semibold mb-6">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-[#3B1F0A] leading-tight mb-6">
            Welcome To<br />Geolicrafts
          </h2>
          <p className="text-[#3B1F0A]/65 leading-relaxed mb-4 max-w-md">
            Founded in 2004 by George Akologo, Geolicrafts has grown from a workshop of 5 to a team of 65+ skilled artisans based in Dodowa, Greater Accra — exporting authentic African drums, Bolga baskets, carvings, and crafts to Europe, the USA, and beyond.
          </p>
          <p className="text-[#3B1F0A]/65 leading-relaxed mb-8 max-w-md">
            Our Training Centre in Dodowa — supported by over $1M from Invest For Employment — equips 2,000+ rural youth and women with craft skills for lasting livelihoods.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[#3B1F0A] text-[11px] tracking-[0.2em] uppercase font-bold hover:text-[#C1440E] transition-colors group"
          >
            More About Us
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right — image */}
        <div className="relative overflow-hidden min-h-[360px]">
          <img
            src={IMG.process}
            alt="Artisan carving a djembe drum by hand"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Terracotta stat badge */}
          <div className="absolute bottom-6 left-6 bg-[#3B1F0A] text-white px-6 py-4 shadow-xl">
            <div className="font-display text-3xl font-black text-[#F5A200]">90%</div>
            <div className="text-xs tracking-widest uppercase text-white/70 mt-0.5">Global Export Rate</div>
          </div>
        </div>
      </section>

      {/* ─── Collection grid ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header row */}
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#3B1F0A]">Our Collection</h2>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold text-[#3B1F0A]/60 hover:text-[#C1440E] transition-colors group"
          >
            View All
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <p className="text-[#3B1F0A]/50 text-sm mb-10 max-w-lg">
          Every piece is handcrafted in Ghana using centuries-old indigenous techniques, passed down through generations of master artisans.
        </p>

        {/* Photo gallery grid — Marwa style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {/* Row 1: wide hero + portrait */}
          <GalleryItem img={IMG.dundum}      title="African Drums"   sub="Musical Instruments"  className="col-span-2 h-[220px] md:h-[340px]" />
          <GalleryItem img={IMG.roundBasket} title="Round Basket"    sub="Baskets & Weaving"     className="col-span-1 h-[180px] md:h-[340px]" />

          {/* Row 2: three equal */}
          <GalleryItem img={IMG.mask}        title="African Mask"    sub="Wood Carvings"         className="col-span-1 h-[160px] md:h-[260px]" />
          <GalleryItem img={IMG.djembe}      title="Djembe Standard" sub="Musical Instruments"  className="col-span-1 h-[160px] md:h-[260px]" />
          <GalleryItem img={IMG.ovalBasket}  title="Oval Basket"     sub="Baskets & Weaving"     className="col-span-2 md:col-span-1 h-[160px] md:h-[260px]" />

          {/* Row 3: two */}
          <GalleryItem img={IMG.fan}         title="Fabric Fan"      sub="Crafts & Fashion"      className="col-span-1 h-[160px] md:h-[260px]" />
          <GalleryItem img={IMG.djembeCarved}title="Djembe Carved"   sub="Musical Instruments"  className="col-span-1 md:col-span-2 h-[160px] md:h-[260px]" />
        </div>

        {/* Mobile view all */}
        <div className="mt-10 md:hidden text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-[#3B1F0A] text-[#3B1F0A] text-[11px] tracking-[0.2em] uppercase font-bold px-8 py-3 hover:bg-[#3B1F0A] hover:text-white transition-colors"
          >
            View All Collections <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ─── Crafted by Hand ─── */}
      <section className="bg-[#1a1a1a] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#F5A200] text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">The Process</p>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white">Crafted by Hand</h2>
            </div>
            <p className="hidden md:block text-white/40 text-sm max-w-xs text-right leading-relaxed">
              Every piece starts with raw wood or grass — shaped, finished, and checked by our artisans in Dodowa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="overflow-hidden group">
              <img
                src={IMG.process}
                alt="Hands carving a djembe drum"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Wood Carving</p>
            </div>
            <div className="overflow-hidden group">
              <img
                src={IMG.workers1}
                alt="Artisans weaving Bolga baskets"
                className="w-full h-[380px] object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Basket Weaving</p>
            </div>
            <div className="overflow-hidden group">
              <img
                src={IMG.training}
                alt="Women training in fashion and sewing"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Fashion & Sewing</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={8} />

      {/* ─── Export markets ─── */}
      <section className="bg-[#3B1F0A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <p className="text-[#F5A200] text-[11px] tracking-[0.3em] uppercase font-semibold mb-4">Global Reach</p>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-6">
                Made in Ghana.<br />Loved Worldwide.
              </h2>
              <p className="text-white/60 leading-relaxed mb-6 max-w-md">
                90% of everything we make is exported. From Accra to Amsterdam, Dodowa to New York — Geolicrafts products reach collectors, retailers, and cultural enthusiasts across three continents.
              </p>
              <p className="text-white/60 leading-relaxed mb-8 max-w-md">
                Our major buyers include retailers in <strong className="text-white/80">Germany</strong>, <strong className="text-white/80">Italy</strong>, and the <strong className="text-white/80">United States</strong> — with plans for international warehouse hubs and craft roadshows underway.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#F5A200] text-[11px] tracking-[0.2em] uppercase font-bold hover:text-white transition-colors group"
              >
                Our Story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right — market grid */}
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {[
                { country: 'Germany',       flag: '🇩🇪', role: 'Primary Market'   },
                { country: 'Italy',         flag: '🇮🇹', role: 'Key Retailer'     },
                { country: 'United States', flag: '🇺🇸', role: 'Major Importer'   },
                { country: 'United Kingdom',flag: '🇬🇧', role: 'Export Market'    },
                { country: 'Netherlands',   flag: '🇳🇱', role: 'Distribution'     },
                { country: 'Ghana',         flag: '🇬🇭', role: 'Home Market'      },
              ].map(({ country, flag, role }) => (
                <div key={country} className="bg-[#3B1F0A] p-6 text-center hover:bg-[#4a2810] transition-colors duration-200">
                  <div className="text-3xl mb-2">{flag}</div>
                  <p className="font-display font-bold text-white text-sm leading-tight">{country}</p>
                  <p className="text-white/35 text-[10px] uppercase tracking-widest mt-1">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Warehouse / Scale ─── */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden">
        <img
          src={IMG.warehouse}
          alt="Geolicrafts export warehouse — hundreds of drums ready to ship"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3B1F0A]/65" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#F5A200] text-[11px] tracking-[0.3em] uppercase font-semibold mb-4">Export Ready</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
            Scale That Speaks
          </h2>
          <p className="text-white/60 max-w-lg text-lg leading-relaxed">
            Hundreds of hand-crafted drums and baskets — packed, labelled, and shipping to Europe and the USA every week.
          </p>
        </div>
      </section>

      {/* ─── Journey timeline ─── */}
      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p className="text-[#C1440E] text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">Since 2004</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white">The Journey</h2>
          </div>

          {/* Mobile: vertical left-line stack */}
          <div className="md:hidden relative pl-6 border-l border-[#C1440E]/30 space-y-6">
            {milestones.map(({ year, title, text }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[1.625rem] top-5 w-3 h-3 rounded-full bg-[#C1440E] ring-4 ring-[#C1440E]/20" />
                <div className="bg-[#252525] p-5 hover:bg-[#2a2a2a] transition-colors duration-200">
                  <p className="font-display text-2xl font-black text-[#C1440E] mb-1">{year}</p>
                  <h4 className="font-display font-bold text-white text-base mb-1">{title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: alternating left-right */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#C1440E]/30" />
            <div className="space-y-6">
              {milestones.map(({ year, title, text }, i) => {
                const isLeft = i % 2 === 0
                return (
                  <div key={year} className={`flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-[calc(50%-2rem)] bg-[#252525] p-6 hover:bg-[#2a2a2a] transition-colors duration-200">
                      <p className="font-display text-2xl font-black text-[#C1440E] mb-2">{year}</p>
                      <h4 className="font-display font-bold text-white text-base mb-2">{title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                    </div>
                    <div className="flex flex-col items-center shrink-0 pt-6">
                      <div className="w-3 h-3 rounded-full bg-[#C1440E] ring-4 ring-[#C1440E]/20" />
                    </div>
                    <div className="w-[calc(50%-2rem)]" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={8} />

      {/* ─── Team spotlight ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
        {/* Image */}
        <div className="relative overflow-hidden min-h-[360px] order-2 lg:order-1">
          <img
            src={IMG.founder}
            alt="George Akologo, Founder"
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" style={{ objectPosition: '50% 20%' }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 order-1 lg:order-2 bg-[#F5F0E8]">
          <p className="text-[#C1440E] text-[11px] tracking-[0.3em] uppercase font-semibold mb-6">The Founder</p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#3B1F0A] leading-tight mb-2">
            George Akologo
          </h2>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#3B1F0A]/45 font-semibold mb-8">
            Founder & Managing Director
          </p>
          <blockquote className="border-l-4 border-[#F5A200] pl-5 font-display text-xl text-[#3B1F0A] italic mb-8 leading-snug">
            "The wood speaks — our duty is simply to translate its language for the world."
          </blockquote>
          <p className="text-[#3B1F0A]/60 leading-relaxed mb-8 max-w-md text-sm">
            Originally from Ghana's Upper East Region, George founded Geolicrafts in 2004 with a mission to make Ghanaian craftsmanship a global force, while keeping its soul firmly rooted in African tradition.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[#3B1F0A] text-[11px] tracking-[0.2em] uppercase font-bold hover:text-[#C1440E] transition-colors group"
          >
            Full Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── Stats band ─── */}
      <section className="bg-[#C1440E] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:divide-x md:divide-white/20">
            {[
              { value: '20+',    label: 'Years of Craft' },
              { value: '65+',    label: 'Master Artisans' },
              { value: '2,000+', label: 'Youth Trained' },
              { value: '90%',    label: 'Global Export' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center px-4">
                <div className="font-display text-4xl font-black text-white mb-1">{value}</div>
                <div className="text-[11px] tracking-widest uppercase text-white/70 font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#F5F0E8] py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-5xl font-black text-[#3B1F0A] mb-4">
            Akwaaba — Welcome
          </h2>
          <p className="text-[#3B1F0A]/60 text-lg mb-8">
            Whether you're a buyer, partner, or simply a lover of African culture — we'd love to connect.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-[#3B1F0A] text-white text-[11px] tracking-[0.2em] uppercase font-bold px-10 py-4 hover:bg-[#C1440E] transition-colors duration-300"
          >
            Get In Touch <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <KenteDivider height={8} />
    </div>
  )
}
