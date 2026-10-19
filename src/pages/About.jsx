import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, Leaf } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'

const milestones = [
  { year: '2004', event: 'Geolicrafts founded in Dodowa, Greater Accra by George Akologo with 5 artisans.' },
  { year: '2008', event: 'Expanded product range to include Bolga baskets, Akuaba carvings, and kente textiles.' },
  { year: '2015', event: 'Grew to 65+ artisans; began exporting regularly to Europe and the United States.' },
  { year: '2021', event: 'Exported products worth 771,000 euros — representing ~3% of Ghana\'s total handicraft exports.' },
  { year: '2023', event: 'Opened Dodowa Training Centre with $1M+ grant from Invest For Employment.' },
  { year: 'Today', event: 'Serving global markets, training 2,000+ artisans, championing Ghana\'s craft heritage worldwide.' },
]

const values = [
  {
    icon: Award,
    title: 'Quality craftsmanship',
    description: 'Every product meets stringent standards before leaving our workshop. We never compromise on the quality that defines Ghanaian craft.',
  },
  {
    icon: Users,
    title: 'Community empowerment',
    description: 'We create sustainable livelihoods for rural youth and women through skills training and fair employment.',
  },
  {
    icon: Globe,
    title: 'Global reach',
    description: '90% of our products are exported internationally, bringing authentic African culture to homes around the world.',
  },
  {
    icon: Leaf,
    title: 'Sustainable practice',
    description: 'We use locally sourced, sustainable materials and support eco-friendly production across all our craft lines.',
  },
]

const facility = [
  { src: '/pics/adminblock.jpeg', label: 'Admin block' },
  { src: '/pics/trainingbuilding1.jpeg', label: 'Training centre' },
  { src: '/pics/warehouse1.jpeg', label: 'Export warehouse' },
]

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>Two decades of <em className="text-clay-600">Ghanaian craft.</em></>}
        description="One chisel stroke, one weave, one drumbeat at a time — since 2004."
      />

      {/* ─── Hero image ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-stone-200">
            <img
              src="/pics/workers.jpeg"
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
            <p className="eyebrow mb-5">The beginning</p>
            <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900">A vision born in Accra.</h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-stone-600 text-lg leading-relaxed">
            <p>
              In 2004, George Akologo — a craftsman from Ghana's Upper East Region — started Geolicrafts in Dodowa, Greater Accra with just five workers and a belief that Ghana's artisans had the talent to serve the world.
            </p>
            <p>
              Two decades on, Geolicrafts employs 65+ artisans and exports 90% of its products — African drums, Bolga baskets, Akuaba carvings and kente textiles — to Europe, the USA and beyond. In 2021 alone, our exports were valued at <span className="text-stone-900 font-medium">771,000 euros</span>.
            </p>
            <blockquote className="!mt-12 pl-6 border-l-2 border-clay-500">
              <p className="font-display text-3xl leading-snug text-stone-900">
                “I always believed that our hands — the craft in our hands — could build this nation.”
              </p>
              <footer className="mt-4 text-sm text-stone-500">George Akologo, Founder & CEO</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-page">
          <p className="eyebrow mb-5">Our values</p>
          <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 max-w-2xl mb-14">What we stand for.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 rounded-2xl overflow-hidden ring-1 ring-stone-200">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-8">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-clay-50 text-clay-600 mb-8">
                  <Icon size={18} />
                </span>
                <h3 className="font-sans text-base font-semibold tracking-normal text-stone-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-5">Est. 2004 — Dodowa</p>
              <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900">Our journey.</h2>
            </div>
          </div>
          <ol className="lg:col-span-8 border-t border-stone-200">
            {milestones.map(({ year, event }) => (
              <li key={year} className="grid grid-cols-12 gap-4 py-7 border-b border-stone-200">
                <span className="col-span-12 sm:col-span-3 font-display text-4xl text-clay-600 leading-none">{year}</span>
                <span className="col-span-12 sm:col-span-9 text-stone-600 leading-relaxed">{event}</span>
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
              src="/pics/trainingschoolbuilding.jpeg"
              alt="Dodowa Training Centre building"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-5">Dodowa Training Centre</p>
            <h2 className="text-4xl md:text-6xl leading-[1] mb-8">Investing in Ghana's future.</h2>
            <div className="space-y-5 text-stone-300 leading-relaxed">
              <p>
                With over $1 million in grant funding from Invest For Employment (German Development Cooperation), Geolicrafts opened a state-of-the-art vocational training centre in Dodowa, Greater Accra Region.
              </p>
              <p>
                The facility trains approximately 2,000 young people — with a focus on rural women — in handicraft creation, sewing, fashion design and artisan skills.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="font-display text-5xl text-clay-300">2,000+</p>
                <p className="text-sm text-stone-400 mt-2">People to be trained</p>
              </div>
              <div>
                <p className="font-display text-5xl text-clay-300">$1M+</p>
                <p className="text-sm text-stone-400 mt-2">Grant funding secured</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Facility ─── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow mb-5">Our compound</p>
          <h2 className="text-4xl md:text-6xl leading-[1] text-stone-900 mb-14">The Dodowa facility.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {facility.map(({ src, label }) => (
              <figure key={label}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200">
                  <img src={src} alt={label} loading="lazy" className="w-full h-full object-cover" />
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
              src="/pics/founder.jpeg"
              alt="George Akologo"
              loading="lazy"
              className="md:col-span-4 w-full aspect-square rounded-2xl object-cover object-top"
            />
            <div className="md:col-span-8">
              <p className="eyebrow mb-4">Leadership</p>
              <h3 className="text-4xl md:text-5xl text-stone-900">George Akologo</h3>
              <p className="text-sm text-clay-600 mt-2 mb-6">Founder & CEO</p>
              <p className="text-stone-600 leading-relaxed max-w-xl">
                Originally from Ghana's Upper East Region, George founded Geolicrafts in 2004 with a mission to make Ghanaian craftsmanship a global force — while keeping its soul firmly rooted in African tradition.
              </p>
              <Link to="/contact" className="btn-primary mt-8">
                Connect with us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
