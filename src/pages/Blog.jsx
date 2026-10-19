import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import { useI18n } from '../i18n'

const PAGE_SIZE = 9

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

const onImgError = e => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_IMG }

function Meta({ post }) {
  const { t, formatDate } = useI18n()
  return (
    <p className="flex items-center gap-2 text-xs text-stone-500">
      <span className="text-clay-600 font-medium">{post.category}</span>
      <span className="h-1 w-1 rounded-full bg-stone-300" />
      {formatDate(post.published_at, { day: 'numeric', month: 'short', year: 'numeric' })}
      <span className="h-1 w-1 rounded-full bg-stone-300" />
      {t('blog.minRead', { count: post.read_time })}
    </p>
  )
}

export default function Blog() {
  const { t, lang } = useI18n()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)

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
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  const paginated = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const changePage = p => {
    setPage(p)
    document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <PageHeader
        eyebrow={t('blog.eyebrow')}
        title={<>{t('blog.title')} <em className="text-clay-600">{t('blog.titleEm')}</em></>}
        description={t('blog.intro')}
      >
        {lang !== 'en' && <p className="mt-4 text-sm text-stone-400">{t('blog.englishOnly')}</p>}
      </PageHeader>

      {/* Category tabs */}
      <div className="container-page">
        <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-stone-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1) }}
              className={`shrink-0 -mb-px pb-3 text-sm border-b-2 transition-colors ${
                activeCategory === cat
                  ? 'border-stone-900 text-stone-900 font-medium'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {cat === 'All' ? t('blog.all') : cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 md:py-16 min-h-[60vh]">
        <div className="container-page">
          {loading ? (
            <div className="animate-pulse grid md:grid-cols-2 gap-10">
              <div className="aspect-[4/3] rounded-2xl bg-stone-200/70" />
              <div className="space-y-4 py-6">
                <div className="h-3 w-1/3 rounded-full bg-stone-200/70" />
                <div className="h-8 w-full rounded-full bg-stone-200/70" />
                <div className="h-8 w-2/3 rounded-full bg-stone-200/70" />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-4xl text-stone-900 mb-3">{t('blog.emptyTitle')}</p>
              <p className="text-stone-500">{t('blog.emptyText')}</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && page === 1 && (
                <Link to={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 md:gap-14 items-center mb-20">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200">
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      onError={onImgError}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div>
                    <span className="chip mb-6">{t('blog.featured')}</span>
                    <h2 className="text-4xl md:text-5xl leading-[1.05] text-stone-900 mb-5">{featured.title}</h2>
                    <p className="text-stone-500 leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                    <Meta post={featured} />
                    <span className="link-arrow mt-8">
                      {t('blog.readStory')} <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <>
                  <h2 id="latest" className="scroll-mt-28 font-sans text-sm font-medium tracking-normal text-stone-900 pb-4 mb-10 border-b border-stone-200">
                    {t('blog.latest')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
                    {paginated.map(post => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                        <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-stone-200 mb-5">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            loading="lazy"
                            onError={onImgError}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                        </div>
                        <Meta post={post} />
                        <h3 className="mt-3 text-2xl leading-tight text-stone-900 line-clamp-2 group-hover:text-clay-700 transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-stone-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      </Link>
                    ))}
                  </div>

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={changePage}
                    totalItems={rest.length}
                    pageSize={PAGE_SIZE}
                    labels={{ showing: t('common.showing'), of: t('common.of'), previous: t('common.previous'), next: t('common.next') }}
                    className="mt-16 pt-8 border-t border-stone-200"
                  />
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
