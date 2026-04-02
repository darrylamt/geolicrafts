import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, Heart, Leaf } from 'lucide-react'

const milestones = [
  { year: '2004', event: 'Geolicrafts founded in Accra with 5 artisans by George Akologo.' },
  { year: '2010', event: 'Expanded product range to include Bolga baskets, wood carvings, and textiles.' },
  { year: '2015', event: 'Reached 45+ skilled artisans; began exporting to Europe and the USA.' },
  { year: '2021', event: 'Exported handicraft products worth 771,000 euros — 3% of Ghana\'s total exports.' },
  { year: '2023', event: 'Opened Dodowa Training Centre with $1M+ grant from Invest For Employment.' },
  { year: 'Today', event: 'Serving global markets, training 2,000+ artisans, and championing Ghanaian craft culture.' },
]

const values = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Every product meets stringent standards before leaving our workshop. We never compromise on the quality that defines Ghanaian craft.',
  },
  {
    icon: Heart,
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
    description: 'We use locally sourced, sustainable materials and support eco-friendly production methods across all our craft lines.',
  },
]

const team = [
  {
    name: 'George Akologo',
    role: 'Founder & CEO',
    bio: 'Originally from Upper East Ghana, George founded Geolicrafts in 2004 with a mission to make Ghanaian craftsmanship a global force.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
]

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-earth-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605812830455-2fadc57dc68d?w=1200&q=60')` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-4">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            About Geolicrafts
          </h1>
          <p className="text-earth-300 text-lg max-w-2xl mx-auto">
            Two decades of crafting Ghana's cultural heritage — one piece at a time.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge mb-4">The Beginning</span>
              <h2 className="section-title text-left">A Vision Born in Accra</h2>
              <p className="text-earth-600 leading-relaxed mb-5">
                In 2004, George Akologo — a craftsman from Ghana's Upper East Region — started Geolicrafts in the Burman Camp area of Accra with just five workers and an unwavering belief: that Ghana's artisans had the talent to serve the world.
              </p>
              <p className="text-earth-600 leading-relaxed mb-5">
                What began as a small workshop producing African drums and traditional baskets has grown into one of Ghana's most respected craft exporters. Today, Geolicrafts employs over 45 skilled artisans and exports 90% of its products to Europe, the United States, and beyond.
              </p>
              <p className="text-earth-600 leading-relaxed mb-8">
                In 2021, the company exported products worth 771,000 euros — representing approximately 3% of Ghana's total handicraft exports. For us, every number behind a product is a person, a family, a community sustained.
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
              <div className="absolute -bottom-6 -left-6 bg-brand-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="font-display text-4xl font-bold">20+</div>
                <div className="text-brand-200 text-sm mt-1">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">Our values guide every chisel stroke, every weave, every drum beat.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-display font-semibold text-lg text-earth-900 mb-2">{title}</h3>
                <p className="text-earth-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">Two decades of growth, craftsmanship, and community impact.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-100" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0 shadow-md">
                    {year}
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm flex-1 mt-2">
                    <p className="text-earth-700 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Centre */}
      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=700&q=80"
              alt="Training Centre"
              className="rounded-2xl w-full h-[420px] object-cover"
            />
            <div>
              <span className="badge mb-4">Dodowa Training Centre</span>
              <h2 className="section-title text-left">Investing in Ghana's Future</h2>
              <p className="text-earth-600 leading-relaxed mb-5">
                With over $1 million in grant funding from Invest For Employment (a German Development Cooperation initiative),
                Geolicrafts opened a state-of-the-art vocational training centre in Dodowa, Greater Accra Region.
              </p>
              <p className="text-earth-600 leading-relaxed mb-5">
                The facility is designed to train approximately 2,000 young people — with a particular focus on rural women — in handicraft creation, sewing, fashion design, and artisan skills.
              </p>
              <p className="text-earth-600 leading-relaxed mb-8">
                "Every time we train someone, we are investing in a family. We are investing in a community." — George Akologo
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="font-display text-3xl font-bold text-brand-600">2,000+</div>
                  <div className="text-earth-500 text-sm">People to be trained</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-brand-600">$1M+</div>
                  <div className="text-earth-500 text-sm">Grant funding secured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Our Leadership</h2>
          <p className="section-subtitle mb-12">Driven by passion for craft and community.</p>
          <div className="flex justify-center">
            {team.map(member => (
              <div key={member.name} className="max-w-sm text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 ring-4 ring-brand-100"
                />
                <h3 className="font-display font-bold text-xl text-earth-900">{member.name}</h3>
                <p className="text-brand-600 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-earth-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
