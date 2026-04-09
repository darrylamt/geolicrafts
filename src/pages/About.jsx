import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, Leaf } from 'lucide-react'
import KenteDivider from '../components/ui/KenteDivider'

const milestones = [
  { year: '2004', event: 'Geolicrafts founded in Dodowa, Greater Accra by George Akologo with 5 artisans.', color: 'bg-accra-500' },
  { year: '2008', event: 'Expanded product range to include Bolga baskets, Akuaba carvings, and kente textiles.', color: 'bg-kente-400' },
  { year: '2015', event: 'Grew to 65+ artisans; began exporting regularly to Europe and the United States.', color: 'bg-forest-600' },
  { year: '2021', event: 'Exported products worth 771,000 euros — representing ~3% of Ghana\'s total handicraft exports.', color: 'bg-accra-600' },
  { year: '2023', event: 'Opened Dodowa Training Centre with $1M+ grant from Invest For Employment.', color: 'bg-kente-500' },
  { year: 'Today', event: 'Serving global markets, training 2,000+ artisans, championing Ghana\'s craft heritage worldwide.', color: 'bg-forest-700' },
]

const values = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Every product meets stringent standards before leaving our workshop. We never compromise on the quality that defines Ghanaian craft.',
  },
  {
    icon: Users,
    title: 'Community Empowerment',
    description: 'We create sustainable livelihoods for rural youth and women through skills training and fair employment.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: '90% of our products are exported internationally, bringing authentic African culture to homes around the world.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practice',
    description: 'We use locally sourced, sustainable materials and support eco-friendly production across all our craft lines.',
  },
]

export default function About() {
  return (
    <>
      {/* ─── Header ─── */}
      <section className="pt-24 pb-0 mudcloth-bg relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16 pt-10">
          {/* Ghana flag bar */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-4 h-1 rounded-full bg-accra-500 inline-block" />
            <span className="w-4 h-1 rounded-full bg-kente-400 inline-block" />
            <span className="w-4 h-1 rounded-full bg-forest-500 inline-block" />
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
                in Accra's Dodowa, Greater Accra with just five workers and a belief that Ghana's artisans had the talent
                to serve the world.
              </p>
              <p className="text-sand-600 leading-relaxed mb-5">
                Two decades on, Geolicrafts employs 65+ artisans and exports 90% of its products —
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
                src="/pics/workers.jpeg"
                alt="Artisans carving drums in the Dodowa workshop"
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

      {/* ─── Values ─── */}
      <section className="py-24 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge mb-4">Our Values</span>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">
              Four principles guide everything at Geolicrafts — from the workshop floor to global export markets.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow border-t-4 border-[#C1440E]">
                <div className="w-12 h-12 bg-[#3B1F0A] flex items-center justify-center mb-6">
                  <Icon size={22} className="text-[#F5A200]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#3B1F0A] mb-3">{title}</h3>
                <p className="text-[#3B1F0A]/60 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kente divider ─── */}
      <KenteDivider height={10} />

      {/* ─── Timeline ─── */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#C1440E]/20 text-[#C1440E] text-xs font-bold px-3 py-1 mb-4 tracking-widest uppercase">Est. 2004 — Dodowa, Ghana</span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">Our Journey</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Two decades of growth, craftsmanship, and community impact across Ghana.</p>
          </div>
          {/* Mobile: vertical left-line stack */}
          <div className="md:hidden relative pl-6 border-l border-[#C1440E]/30 space-y-6">
            {milestones.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[1.625rem] top-5 w-3 h-3 rounded-full bg-[#C1440E] ring-4 ring-[#C1440E]/20" />
                <div className="bg-[#252525] p-5 hover:bg-[#2a2a2a] transition-colors duration-200">
                  <p className="font-display text-2xl font-black text-[#C1440E] mb-2">{year}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: alternating left-right */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#C1440E]/30" />
            <div className="space-y-6">
              {milestones.map(({ year, event }, i) => {
                const isLeft = i % 2 === 0
                return (
                  <div key={year} className={`flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-[calc(50%-2rem)] bg-[#252525] p-6 hover:bg-[#2a2a2a] transition-colors duration-200">
                      <p className="font-display text-2xl font-black text-[#C1440E] mb-2">{year}</p>
                      <p className="text-white/60 text-sm leading-relaxed">{event}</p>
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

      {/* ─── Training Centre ─── */}
      <section className="py-24 mudcloth-bg relative overflow-hidden">
        <div className="absolute top-0 inset-x-0"><KenteDivider height={8} /></div>
        <div className="absolute bottom-0 inset-x-0"><KenteDivider height={8} /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="/pics/trainingschoolbuilding.jpeg"
                alt="Dodowa Training Centre building"
                className="rounded-2xl w-full h-[420px] object-cover object-bottom"
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

      {/* ─── Facility photos ─── */}
      <section className="bg-[#F5F0E8] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="inline-block bg-[#C1440E]/10 text-[#C1440E] text-xs font-bold px-3 py-1 mb-3 tracking-widest uppercase">Our Compound</span>
            <h2 className="font-display text-3xl font-black text-[#3B1F0A]">The Dodowa Facility</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="overflow-hidden group">
              <img
                src="/pics/adminblock.jpeg"
                alt="Geolicrafts admin block — Dodowa"
                className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-[#3B1F0A]/50 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Admin Block</p>
            </div>
            <div className="overflow-hidden group">
              <img
                src="/pics/trainingbuilding1.jpeg"
                alt="Training centre new building"
                className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-[#3B1F0A]/50 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Training Centre</p>
            </div>
            <div className="overflow-hidden group">
              <img
                src="/pics/warehouse1.jpeg"
                alt="Export warehouse packed with drums and baskets"
                className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <p className="text-[#3B1F0A]/50 text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">Export Warehouse</p>
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
                  src="/pics/founder.jpeg"
                  alt="George Akologo"
                  className="w-32 h-32 rounded-full object-cover object-top ring-4 ring-kente-400"
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
