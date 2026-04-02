import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const FALLBACK_POSTS = [
  {
    id: 1,
    slug: 'geolicrafts-ceo-vision',
    title: 'Geolicrafts CEO Foresees Handicraft Sector as Catalyst for Ghana\'s Economic Transformation',
    excerpt: 'Founder George Akologo shares his vision for how the craft industry can drive sustainable economic development in Ghana and across Africa.',
    category: 'News',
    image_url: 'https://images.unsplash.com/photo-1580464135093-36b6bfda896e?w=800&q=80',
    published_at: '2023-12-08',
    read_time: 5,
  },
  {
    id: 2,
    slug: 'training-centre-dodowa',
    title: 'New Training Centre in Dodowa to Empower 2,000 Artisans',
    excerpt: 'With over $1 million in grant funding from Invest For Employment, our Dodowa training facility is set to transform lives through craft skills.',
    category: 'Community',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    published_at: '2023-06-15',
    read_time: 4,
  },
  {
    id: 3,
    slug: 'bolga-baskets-global',
    title: 'Bolga Baskets: How a Ghanaian Tradition Conquered Global Markets',
    excerpt: 'The story of how traditional hand-woven baskets from Bolgatanga became one of Ghana\'s most beloved craft exports, shipped to Europe and the Americas.',
    category: 'Crafts',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    published_at: '2023-03-20',
    read_time: 6,
  },
  {
    id: 4,
    slug: 'drums-cultural-heritage',
    title: 'The Heartbeat of Ghana: Preserving the Art of Drum-Making',
    excerpt: 'African drums are more than instruments — they carry the voices of ancestors. Here\'s how Geolicrafts keeps this sacred tradition alive.',
    category: 'Crafts',
    image_url: 'https://images.unsplash.com/photo-1516663235285-845fac339ca7?w=800&q=80',
    published_at: '2022-11-10',
    read_time: 7,
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setPosts(FALLBACK_POSTS)
      } else {
        setPosts(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const categories = ['All', ...new Set(posts.map(p => p.category))]
  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)
  const [featured, ...rest] = filtered

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-earth-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=60')` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-4">Blog & Stories</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Stories
          </h1>
          <p className="text-earth-300 text-lg max-w-2xl mx-auto">
            News, insights, and stories from the heart of Ghana's craft industry.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-earth-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-16 bg-earth-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              <div className="card animate-pulse h-96" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="card animate-pulse h-64" />)}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-earth-500 text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="card group flex flex-col md:flex-row mb-10 overflow-hidden">
                  <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <span className="badge mb-3">{featured.category}</span>
                    <h2 className="font-display text-2xl font-bold text-earth-900 mb-3 group-hover:text-brand-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-earth-500 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-earth-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(featured.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {featured.read_time} min read
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(post => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="card group">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <span className="badge mb-3">{post.category}</span>
                        <h3 className="font-display font-bold text-lg text-earth-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-earth-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-earth-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1 text-brand-600 font-medium">
                            Read more <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
