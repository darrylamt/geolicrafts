import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import KenteDivider from '../components/ui/KenteDivider'

// Local images guaranteed to exist — used for both fallback posts and to patch Supabase posts
const LOCAL_IMAGES = {
  'geolicrafts-ceo-vision':   '/pics/founder.jpeg',
  'training-centre-dodowa':   '/pics/ife/group-pic.jpeg',
  'bolga-baskets-global':     '/pics/workers1.jpeg',
  'drums-cultural-heritage':  '/pics/process.jpeg',
}
const CATEGORY_IMAGES = {
  'News':      '/pics/founder.jpeg',
  'Community': '/pics/training.jpeg',
  'Crafts':    '/pics/process.jpeg',
}
const DEFAULT_IMG = '/pics/process.jpeg'

// Guarantee every post has a working image_url
function withImage(post) {
  return {
    ...post,
    image_url: LOCAL_IMAGES[post.slug] || CATEGORY_IMAGES[post.category] || DEFAULT_IMG,
  }
}

const FALLBACK_POSTS = [
  {
    id: 1,
    slug: 'geolicrafts-ceo-vision',
    title: 'Geolicrafts CEO Foresees Handicraft Sector as Catalyst for Ghana\'s Economic Transformation',
    excerpt: 'George Akologo shares his bold vision: Ghana\'s craft industry could rival cocoa and gold exports. With 90% of products reaching Europe and the USA, Geolicrafts is already proving it.',
    category: 'News',
    published_at: '2023-12-08',
    read_time: 5,
  },
  {
    id: 2,
    slug: 'training-centre-dodowa',
    title: 'Inside the Dodowa Training Centre: How Geolicrafts is Building Ghana\'s Next Generation of Artisans',
    excerpt: 'With $1M+ in funding from Invest For Employment, the Dodowa centre trains 2,000+ rural women and youth in straw work, wood carving, and fashion design — turning craft skills into lasting livelihoods.',
    category: 'Community',
    published_at: '2023-06-15',
    read_time: 4,
  },
  {
    id: 3,
    slug: 'bolga-baskets-global',
    title: 'Bolga Baskets: How a Ghanaian Tradition Conquered Global Markets',
    excerpt: 'Hand-woven by skilled women in the Upper East Region, Bolga baskets have become one of Ghana\'s most beloved craft exports — reaching homes in Europe, the USA, and beyond.',
    category: 'Crafts',
    published_at: '2023-03-20',
    read_time: 6,
  },
  {
    id: 4,
    slug: 'drums-cultural-heritage',
    title: 'The Heartbeat of Ghana: Preserving the Sacred Art of Drum-Making',
    excerpt: 'From Djembe to Dundum, every drum Geolicrafts produces is carved by hand using Tweneboa wood and goat skin. Here\'s how this ancient craft stays alive — and finds a global audience.',
    category: 'Crafts',
    published_at: '2022-11-10',
    read_time: 7,
  },
].map(withImage)

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
        setPosts(data.map(withImage))
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
      <section className="pt-24 pb-0 mudcloth-bg relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-4 h-1 rounded-full bg-accra-500 inline-block" />
            <span className="w-4 h-1 rounded-full bg-kente-400 inline-block" />
            <span className="w-4 h-1 rounded-full bg-forest-500 inline-block" />
          </div>
          <span className="inline-block bg-kente-400/20 text-kente-300 border border-kente-400/30 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Blog & Stories
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Stories
          </h1>
          <p className="text-forest-200 text-lg max-w-2xl mx-auto">
            News, insights, and stories from the heart of Ghana's craft industry.
          </p>
        </div>
        <KenteDivider height={10} />
      </section>

      {/* Category Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-forest-700 text-white'
                  : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-16 kente-weave-bg min-h-[60vh]">
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
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_IMG }}
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
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_IMG }}
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
