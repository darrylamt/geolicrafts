import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const FALLBACK_POST = {
  id: 1,
  slug: 'geolicrafts-ceo-vision',
  title: "Geolicrafts CEO Foresees Handicraft Sector as Catalyst for Ghana's Economic Transformation",
  excerpt: "Founder George Akologo shares his vision for how the craft industry can drive sustainable economic development.",
  content: `
George Akologo, the founder and CEO of Geolicrafts Company Limited, has articulated a bold vision for Ghana's handicraft sector — one where traditional crafts become a primary engine of national economic transformation.

## A Journey That Started With Five

In 2004, Akologo started Geolicrafts with just five workers in Accra's Burman Camp area. Two decades later, the company employs over 45 skilled artisans, exports products worth hundreds of thousands of euros annually, and runs a full-scale vocational training centre in Dodowa.

"I always believed that our hands — the craft in our hands — could build this nation," Akologo told The Business & Financial Times. "We are not just making drums and baskets. We are building a legacy."

## Exporting Culture to the World

Today, 90% of Geolicrafts' products are exported internationally, primarily to Europe and the United States. In 2021 alone, the company exported handicraft products worth 771,000 euros — representing approximately 3% of Ghana's total handicraft exports.

Products include:
- **African musical instruments** (djembe drums, talking drums, xylophones)
- **Traditional Bolga baskets** from the Upper East Region
- **Hand-carved wooden sculptures and masks**
- **Fashion and textile items**

## The Training Centre Vision

With over $1 million in grant funding from Invest For Employment (part of the German Development Cooperation), Geolicrafts opened a state-of-the-art training centre in Dodowa, designed to train approximately 2,000 people — particularly rural women and youth — in handicraft and fashion creation.

"Every time we train someone, we are investing in a family. We are investing in a community," said Akologo.

## The Road Ahead

Geolicrafts has ambitious plans: international craft exhibitions, collaboration with Ghana's Tourism Ministry, and establishing global warehouses to streamline international sourcing.

The CEO believes the handicraft sector, if properly supported, could rival Ghana's cocoa and gold exports. "We have the talent, the heritage, and the creativity. What we need is the platform — and we are building it."
  `,
  category: 'News',
  image_url: 'https://images.unsplash.com/photo-1580464135093-36b6bfda896e?w=1200&q=80',
  published_at: '2023-12-08',
  read_time: 5,
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// Simple markdown-like renderer for bold (**) and headers (##)
function renderContent(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="font-display text-2xl font-bold text-earth-900 mt-10 mb-4">{line.slice(3)}</h2>
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="text-earth-700 leading-relaxed ml-4">{parseBold(line.slice(2))}</li>
    }
    if (line.trim() === '') return <br key={i} />
    return <p key={i} className="text-earth-700 leading-relaxed mb-4">{parseBold(line)}</p>
  })
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error || !data) {
        // Try fallback
        if (slug === FALLBACK_POST.slug) {
          setPost(FALLBACK_POST)
        } else {
          setNotFound(true)
        }
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-32 max-w-3xl mx-auto px-4 animate-pulse space-y-4">
        <div className="h-8 bg-earth-200 rounded w-3/4" />
        <div className="h-4 bg-earth-100 rounded w-1/2" />
        <div className="aspect-video bg-earth-200 rounded-2xl" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="pt-32 pb-16 text-center">
        <h1 className="section-title">Post Not Found</h1>
        <Link to="/blog" className="btn-primary mt-6">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero image */}
      <div className="pt-16 md:pt-20">
        <div className="aspect-[16/6] overflow-hidden relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 to-transparent" />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/blog" className="btn-ghost pl-0 mb-6 inline-flex">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <span className="badge mb-4">{post.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-earth-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-earth-500 text-sm mb-8 pb-8 border-b border-earth-100">
          <span className="flex items-center gap-2">
            <Calendar size={16} /> {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} /> {post.read_time} min read
          </span>
        </div>

        <div className="prose-custom">
          {post.content ? renderContent(post.content) : (
            <p className="text-earth-600">{post.excerpt}</p>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-earth-100">
          <Link to="/blog" className="btn-secondary">
            <ArrowLeft size={18} /> More Stories
          </Link>
        </div>
      </article>
    </>
  )
}
