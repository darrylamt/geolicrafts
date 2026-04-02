import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, Heart, Leaf } from 'lucide-react'
import KenteDivider from '../components/ui/KenteDivider'
import { Adinkrahene, GyeNyame, Sankofa, Dwennimmen } from '../components/ui/AdinkraSymbol'

const milestones = [
  { year: '2004', event: 'Geolicrafts founded in Accra\'s Burman Camp by George Akologo with 5 artisans.', color: 'bg-accra-500' },
  { year: '2008', event: 'Expanded product range to include Bolga baskets, Akuaba carvings, and kente textiles.', color: 'bg-kente-400' },
  { year: '2015', event: 'Grew to 45+ artisans; began exporting regularly to Europe and the United States.', color: 'bg-forest-600' },
  { year: '2021', event: 'Exported products worth 771,000 euros — representing ~3% of Ghana\'s total handicraft exports.', color: 'bg-accra-600' },
  { year: '2023', event: 'Opened Dodowa Training Centre with $1M+ grant from Invest For Employment.', color: 'bg-kente-500' },
  { year: 'Today', event: 'Serving global markets, training 2,000+ artisans, championing Ghana\'s craft heritage worldwide.', color: 'bg-forest-700' },
]

const values = [
  {
    icon: Award,
    symbol: GyeNyame,
    symbolName: 'Gye Nyame',
    symbolMeaning: '"Except God"',
    title: 'Quality Craftsmanship',
    description: 'Every product meets stringent standards before leaving our workshop. We never compromise on the quality that defines Ghanaian craft.',
  },
  {
    icon: Heart,
    symbol: Dwennimmen,
    symbolName: 'Dwennimmen',
    symbolMeaning: '"Humility & Strength"',
    title: 'Community Empowerment',
    description: 'We create sustainable livelihoods for rural youth and women through skills training and fair employment.',
  },
  {
    icon: Globe,
    symbol: Sankofa,
    symbolName: 'Sankofa',
    symbolMeaning: '"Go back and fetch it"',
    title: 'Global Reach',
    description: '90% of our products are exported internationally, bringing authentic African culture to homes around the world.',
  },
  {
    icon: Leaf,
    symbol: Adinkrahene,
    symbolName: 'Adinkrahene',
    symbolMeaning: '"Greatness & Leadership"',
    title: 'Sustainable Practice',
    description: 'We use locally sourced, sustainable materials and support eco-friendly production across all our craft lines.',
  },
]

export default function About() {
  return (
    <>
      {/* ─── Header ─── */}
      <section className="pt-24 pb-0 mudcloth-bg relative overflow-hidden">
        <div className="absolute inset-0 adinkra-bg opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16 pt-10">
          {/* Ghana flag bar */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-4 h-1 rounded-full bg-accra-500 inline-block" />
            <span className="w-4 h-1 rounded-full bg-kente-400 inline-block" />
            <span className="w-4 h-1 rounded-full bg-forest-500 inline-block" />
          </div>
          {/* Adinkra symbol decoration */}
          <div className="flex justify-center mb-6 opacity-40">
            <Adinkrahene size={64} color="#F5A200" />
          </div>
          <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            About Geolicrafts
          </h1>
          <p className="text-forest-200 text-lg max-w-2xl mx-auto">
            Two decades of crafting Ghana's cultural heritage — one chisel stroke, one weave, one drumbeat at a time.
          </p>
        </div>
        <KenteDivider height={10} />
      </section>

      {/* ─── Founder Story ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-green mb-4">The Beginning</span>
              <h2 className="section-title text-left">A Vision Born in Accra</h2>
              <p className="text-sand-600 leading-relaxed mb-5">
                In 2004, George Akologo — a craftsman from Ghana's Upper East Region — started Geolicrafts
                in Accra's Burman Camp with just five workers and a belief that Ghana's artisans had the talent
                to serve the world.
              </p>
              <p className="text-sand-600 leading-relaxed mb-5">
                Two decades on, Geolicrafts employs 45+ artisans and exports 90% of its products —
                African drums, Bolga baskets, Akuaba carvings, kente textiles — to Europe, the USA, and beyond.
                In 2021 alone, our exports were valued at <strong className="text-forest-700">771,000 euros</strong>.
              </p>
              <p className="text-sand-600 leading-relaxed mb-8 italic border-l-4 border-kente-400 pl-4">
                "I always believed that our hands — the craft in our hands — could build this nation."
                <span className="block text-sm text-sand-400 mt-1 not-italic">— George Akologo, Founder & CEO</span>
              </p>
              <Link to="/contact" className="btn-primary">
                Connect With Us <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80"
                alt="Artisans at work"
                className="rounded-2xl w-full h-[480px] object-cover"
              />
              {/* Kente accent on image */}
              <div className="absolute bottom-0 inset-x-0 rounded-b-2xl overflow-hidden">
                <KenteDivider height={8} />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-forest-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="font-display text-4xl font-bold text-kente-300">20+</div>
                <div className="text-forest-200 text-sm mt-1">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={10} />

      {/* ─── Values with Adinkra ─── */}
      <section className="py-24 kente-weave-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge mb-4">Our Values</span>
            <h2 className="section-title">Guided by Adinkra Wisdom</h2>
            <p className="section-subtitle">
              The Adinkra symbols of the Akan people carry timeless truths. Each one mirrors a pillar of how we work.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ symbol: Sym, symbolName, symbolMeaning, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-kente-400">
                <div className="flex justify-center mb-3">
                  <Sym size={44} color="#006B3F" opacity={0.85} />
                </div>
                <p className="text-center text-xs text-kente-600 font-semibold uppercase tracking-wide mb-4">
                  {symbolName} · <span className="text-sand-400 normal-case font-normal">{symbolMeaning}</span>
                </p>
                <h3 className="font-display font-semibold text-lg text-sand-900 mb-2 text-center">{title}</h3>
                <p className="text-sand-500 text-sm leading-relaxed text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={10} />

      {/* ─── Timeline ─── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-green mb-4">Sankofa — Look Back to Move Forward</span>
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">Two decades of growth, craftsmanship, and community impact across Ghana.</p>
          </div>
          <div className="relative">
            {/* Vertical line in kente gold */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accra-500 via-kente-400 to-forest-600" />
            <div className="space-y-8">
              {milestones.map(({ year, event, color }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className={`w-16 h-16 ${color} text-white rounded-full flex items-center justify-center text-xs font-bold font-display shrink-0 shadow-md`}>
                    {year}
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm flex-1 mt-2 border-l-4 border-kente-200 hover:border-kente-400 transition-colors">
                    <p className="text-sand-700 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Training Centre ─── */}
      <section className="py-24 mudcloth-bg relative overflow-hidden">
        <div className="absolute top-0 inset-x-0"><KenteDivider height={8} /></div>
        <div className="absolute bottom-0 inset-x-0"><KenteDivider height={8} /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=700&q=80"
                alt="Training Centre Dodowa"
                className="rounded-2xl w-full h-[420px] object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 rounded-b-2xl overflow-hidden">
                <KenteDivider height={6} />
              </div>
            </div>
            <div>
              <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                Dodowa Training Centre
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">
                Investing in Ghana's Future
              </h2>
              <p className="text-forest-200 leading-relaxed mb-5">
                With over <strong className="text-kente-400">$1 million in grant funding</strong> from Invest For Employment
                (German Development Cooperation), Geolicrafts opened a state-of-the-art vocational training centre in Dodowa,
                Greater Accra Region.
              </p>
              <p className="text-forest-300 leading-relaxed mb-5">
                The facility trains approximately <strong className="text-kente-400">2,000 young people</strong> — with a focus on rural women —
                in handicraft creation, sewing, fashion design, and artisan skills.
              </p>
              <p className="text-kente-300 italic border-l-4 border-kente-500 pl-4 text-sm leading-relaxed mb-8">
                "Every time we train someone, we are investing in a family. We are investing in a community."
                <span className="block mt-1 text-forest-400 not-italic">— George Akologo</span>
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="font-display text-3xl font-bold text-kente-400">2,000+</div>
                  <div className="text-forest-400 text-sm">People to be trained</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-kente-400">$1M+</div>
                  <div className="text-forest-400 text-sm">Grant funding secured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section className="py-24 kente-weave-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge mb-4">Our Leadership</span>
          <h2 className="section-title">The People Behind the Craft</h2>
          <p className="section-subtitle mb-12">Driven by passion for craft, community, and cultural preservation.</p>
          <div className="flex justify-center">
            <div className="max-w-sm text-center">
              <div className="relative inline-block mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                  alt="George Akologo"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-kente-400"
                />
                {/* Kente ring */}
                <div className="absolute inset-0 rounded-full ring-8 ring-forest-200 opacity-20" />
              </div>
              <h3 className="font-display font-bold text-xl text-sand-900">George Akologo</h3>
              <p className="text-forest-700 font-medium text-sm mb-3">Founder & CEO</p>
              <p className="text-sand-500 text-sm leading-relaxed">
                Originally from Ghana's Upper East Region, George founded Geolicrafts in 2004 with a mission to make
                Ghanaian craftsmanship a global force — while keeping its soul firmly rooted in African tradition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom kente */}
      <KenteDivider height={10} />
    </>
  )
}
