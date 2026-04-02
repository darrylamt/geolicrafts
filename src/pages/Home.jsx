import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, Globe, Heart } from 'lucide-react'

const stats = [
  { value: '20+', label: 'Years of Craft', icon: Award },
  { value: '45+', label: 'Skilled Artisans', icon: Users },
  { value: '2,000+', label: 'People Trained', icon: Heart },
  { value: '90%', label: 'Export Reach', icon: Globe },
]

const categories = [
  {
    title: 'African Drums',
    description: 'Authentic hand-crafted drums rooted in West African tradition.',
    image: 'https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=600&q=80',
  },
  {
    title: 'Bolga Baskets',
    description: 'Traditional woven baskets from the Upper East Region of Ghana.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'Wood Carvings',
    description: 'Intricately carved wooden art pieces celebrating Ghanaian heritage.',
    image: 'https://images.unsplash.com/photo-1605812830455-2fadc57dc68d?w=600&q=80',
  },
  {
    title: 'Fashion & Textiles',
    description: 'Handcrafted fashion items blending tradition with contemporary style.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1580464135093-36b6bfda896e?w=1920&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-earth-950/85 via-earth-900/70 to-brand-900/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="badge bg-brand-500/20 text-brand-200 border border-brand-400/30 text-sm mb-6 inline-block">
            Est. 2004 &middot; Accra, Ghana
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
            Crafting Ghana's<br />
            <span className="text-brand-300">Cultural Heritage</span>
          </h1>
          <p className="text-xl md:text-2xl text-earth-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Authentic African arts, musical instruments, and handcrafted gifts —
            made by skilled Ghanaian artisans, reaching the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary text-base px-8 py-4">
              Explore Products <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn-secondary border-white/60 text-white hover:bg-white/10 hover:text-white text-base px-8 py-4">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center text-white">
                <Icon size={28} className="mx-auto mb-2 text-brand-200" />
                <div className="text-3xl font-bold font-display">{value}</div>
                <div className="text-brand-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Crafts</h2>
            <p className="section-subtitle">
              Every product is handmade with pride, preserving centuries of Ghanaian artistry.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ title, description, image }) => (
              <Link key={title} to="/products" className="card group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-earth-900 mb-1">{title}</h3>
                  <p className="text-earth-500 text-sm leading-relaxed">{description}</p>
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

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge mb-4">Our Mission</span>
              <h2 className="section-title text-left">
                Empowering Artisans,<br />Preserving Culture
              </h2>
              <p className="text-earth-600 leading-relaxed mb-6">
                Geolicrafts was founded in 2004 with a vision to transform Ghana's handicraft sector into a global economic force.
                Starting with just 5 workers, we've grown to a team of 45+ skilled artisans, exporting authentic African crafts to Europe, the USA, and beyond.
              </p>
              <p className="text-earth-600 leading-relaxed mb-8">
                Through our training centre in Dodowa — funded by over $1 million from Invest For Employment —
                we're equipping thousands of rural youth and women with skills to build sustainable livelihoods.
              </p>
              <Link to="/about" className="btn-primary">
                Learn Our Story <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80"
                alt="Artisan at work"
                className="rounded-2xl w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=500&q=80"
                alt="Crafts display"
                className="rounded-2xl w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-24 bg-earth-50">
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

      {/* CTA */}
      <section className="py-24 bg-brand-700 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=1200&q=60')` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-brand-200 text-lg mb-8">
            Interested in our products, partnerships, or training programmes? We'd love to hear from you.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-lg hover:bg-brand-50 transition-colors shadow-lg">
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
