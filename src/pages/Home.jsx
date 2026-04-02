import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, Globe, Heart } from 'lucide-react'
import KenteDivider from '../components/ui/KenteDivider'
import { Adinkrahene, Dwennimmen, GyeNyame, Sankofa } from '../components/ui/AdinkraSymbol'

const stats = [
  { value: '20+', label: 'Years of Craft', icon: Award },
  { value: '45+', label: 'Skilled Artisans', icon: Users },
  { value: '2,000+', label: 'People Trained', icon: Heart },
  { value: '90%', label: 'Global Export', icon: Globe },
]

const categories = [
  {
    title: 'African Drums',
    description: 'Hand-carved djembe and talking drums — the heartbeat of West Africa.',
    image: 'https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=600&q=80',
    badge: 'Musical',
  },
  {
    title: 'Bolga Baskets',
    description: 'Traditional woven baskets from Bolgatanga, crafted by skilled women.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    badge: 'Weaving',
  },
  {
    title: 'Wood Carvings',
    description: 'Akuaba dolls, masks, and sculptures celebrating Akan tradition.',
    image: 'https://images.unsplash.com/photo-1605812830455-2fadc57dc68d?w=600&q=80',
    badge: 'Carvings',
  },
  {
    title: 'Kente & Fashion',
    description: 'Handcrafted fashion and textiles weaving colour into everyday life.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80',
    badge: 'Textiles',
  },
]

const values = [
  { symbol: 'GyeNyame', label: 'Gye Nyame', meaning: 'Except God', text: 'Rooted in faith and purpose, every craft we make honours a tradition greater than ourselves.' },
  { symbol: 'Sankofa', label: 'Sankofa', meaning: 'Go back and fetch it', text: 'We look to Ghana\'s past to craft products that carry centuries of culture into the future.' },
  { symbol: 'Adinkrahene', label: 'Adinkrahene', meaning: 'Greatness & leadership', text: 'We lead the Ghanaian handicraft sector with quality, vision, and community impact.' },
  { symbol: 'Dwennimmen', label: 'Dwennimmen', meaning: 'Humility & strength', text: 'We uplift our artisans with humility — their strength is the foundation of our story.' },
]

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580464135093-36b6bfda896e?w=1920&q=85')` }}
        />
        {/* Deep green / Ghana forest overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950/90 via-forest-900/75 to-sand-950/70" />

        {/* Adinkra watermark layer */}
        <div className="absolute inset-0 adinkra-bg opacity-60 pointer-events-none" />

        {/* Kente stripe at very top */}
        <div className="absolute top-0 inset-x-0 z-20">
          <KenteDivider height={6} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-16">
          {/* Ghana flag colours badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-accra-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-kente-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-forest-600 inline-block" />
            <span className="text-sand-300 text-sm font-medium tracking-widest uppercase ml-1">
              Made in Ghana
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
            Crafting Ghana's<br />
            <span className="text-kente-300">Soul Into The World</span>
          </h1>
          <p className="text-xl md:text-2xl text-sand-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Authentic African arts, musical instruments, and handcrafted gifts —
            woven with the spirit of Ghana, reaching every corner of the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-gold text-base px-8 py-4">
              Explore Our Crafts <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-base"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={12} />

      {/* ─── Stats bar ─── */}
      <section className="bg-forest-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center text-white">
                <Icon size={28} className="mx-auto mb-2 text-kente-300" />
                <div className="text-3xl font-bold font-display text-kente-300">{value}</div>
                <div className="text-forest-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={12} />

      {/* ─── Products ─── */}
      <section className="py-24 kente-weave-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Handcrafted in Ghana</span>
            <h2 className="section-title">Our Crafts</h2>
            <p className="section-subtitle">
              Every product is made with pride, preserving centuries of Ghanaian artistry passed down through generations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ title, description, image, badge }) => (
              <Link key={title} to="/products" className="card group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  {/* Kente colour strip on hover */}
                  <div className="absolute bottom-0 inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <KenteDivider height={5} />
                  </div>
                  <span className="absolute top-3 left-3 badge">{badge}</span>
                </div>
                <div className="p-5 border-l-4 border-forest-700">
                  <h3 className="font-display font-semibold text-lg text-sand-900 mb-1">{title}</h3>
                  <p className="text-sand-500 text-sm leading-relaxed">{description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={12} />

      {/* ─── Mission ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-green mb-4">Est. 2004 · Accra, Ghana</span>
              <h2 className="section-title text-left">
                Empowering Artisans,<br />Preserving Culture
              </h2>
              <p className="text-sand-600 leading-relaxed mb-5">
                Founded by George Akologo in Accra's Burman Camp area, Geolicrafts has grown from a workshop of 5 to a team of 45+ skilled artisans.
                Today, we export authentic African crafts — drums, Bolga baskets, carvings, and textiles — to Europe, the USA, and beyond.
              </p>
              <p className="text-sand-600 leading-relaxed mb-8">
                Through our vocational training centre in Dodowa — supported by over $1 million from Invest For Employment — we're equipping 2,000+ rural youth and women with craft skills for lasting livelihoods.
              </p>
              <Link to="/about" className="btn-primary">
                Learn Our Story <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80"
                  alt="Artisan at work"
                  className="rounded-2xl w-full h-52 object-cover"
                />
                {/* Ghana flag colours accent */}
                <div className="rounded-xl overflow-hidden h-3">
                  <KenteDivider height={12} />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="rounded-xl overflow-hidden h-3">
                  <KenteDivider height={12} />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=500&q=80"
                  alt="Crafts display"
                  className="rounded-2xl w-full h-52 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Adinkra values ─── */}
      <section className="py-24 mudcloth-bg relative overflow-hidden">
        {/* Decorative top kente bar */}
        <div className="absolute top-0 inset-x-0">
          <KenteDivider height={8} />
        </div>
        <div className="absolute bottom-0 inset-x-0">
          <KenteDivider height={8} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Guided by Adinkra
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Our Values in Symbols
            </h2>
            <p className="text-forest-200 text-lg max-w-2xl mx-auto">
              The Adinkra symbols of the Akan people carry profound wisdom. These four guide everything we do at Geolicrafts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ symbol, label, meaning, text }) => {
              const symbols = { GyeNyame, Sankofa, Adinkrahene, Dwennimmen }
              const Sym = symbols[symbol]
              return (
                <div
                  key={label}
                  className="bg-forest-900/60 border border-forest-700/50 rounded-2xl p-6 text-center hover:border-kente-400/50 transition-colors"
                >
                  <div className="flex justify-center mb-4">
                    <Sym size={56} color="#F5A200" opacity={0.9} />
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-0.5">{label}</h3>
                  <p className="text-kente-300 text-xs font-medium tracking-wide uppercase mb-3">
                    "{meaning}"
                  </p>
                  <p className="text-forest-200 text-sm leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Blog teaser ─── */}
      <section className="py-24 kente-weave-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge mb-4">Latest Stories</span>
          <h2 className="section-title">From Our Blog</h2>
          <p className="section-subtitle mb-12">
            News, stories, and insights from the heart of Ghana's craft industry.
          </p>
          <Link to="/blog" className="btn-primary">
            Read the Blog <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={12} />

      {/* ─── CTA ─── */}
      <section className="py-24 bg-forest-950 relative overflow-hidden">
        {/* Adinkra pattern watermark */}
        <div className="absolute inset-0 adinkra-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          {/* Adinkrahene — greatness symbol */}
          <div className="flex justify-center mb-6 opacity-30">
            <Adinkrahene size={80} color="#F5A200" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 text-white">Akwaaba — Welcome</h2>
          <p className="text-forest-300 text-lg mb-8">
            Whether you're a buyer, partner, or simply a lover of African culture —
            we'd love to hear from you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-kente-400 hover:bg-kente-500 text-sand-950 font-bold px-10 py-4 rounded-lg transition-colors shadow-xl text-base"
          >
            Get In Touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Bottom kente bar */}
      <KenteDivider height={10} />
    </>
  )
}
