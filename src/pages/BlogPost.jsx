import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const FALLBACK_POSTS = [
  {
    id: 1,
    slug: 'geolicrafts-ceo-vision',
    title: "Geolicrafts CEO Foresees Handicraft Sector as Catalyst for Ghana's Economic Transformation",
    excerpt: "Founder George Akologo shares his vision for how the craft industry can drive sustainable economic development.",
    content: `
George Akologo, the founder and CEO of Geolicrafts Company Limited, has articulated a bold vision for Ghana's handicraft sector — one where traditional crafts become a primary engine of national economic transformation.

## A Journey That Started With Five

In 2004, Akologo started Geolicrafts with just five workers. Two decades later, the company employs over 65 skilled artisans, exports products worth hundreds of thousands of euros annually, and runs a full-scale vocational training centre in Dodowa, Greater Accra.

"I always believed that our hands — the craft in our hands — could build this nation," Akologo told The Business & Financial Times. "We are not just making drums and baskets. We are building a legacy."

![George Akologo with hand-crafted djembe drums at the Dodowa workshop](/pics/founder.jpeg "George Akologo in his element — surrounded by drums crafted by his team")

## Exporting Culture to the World

Today, 90% of Geolicrafts' products are exported internationally, primarily to Europe and the United States. In 2021 alone, the company exported handicraft products worth 771,000 euros — representing approximately 3% of Ghana's total handicraft exports.

Products include:
- **African musical instruments** (djembe drums, talking drums, xylophones)
- **Traditional Bolga baskets** from the Upper East Region
- **Hand-carved wooden sculptures and masks**
- **Fashion and textile items**

![The export warehouse — hundreds of drums packed and ready to ship](/pics/warehouse2.jpeg "Geolicrafts' warehouse holds hundreds of finished products ready for international shipment")

## The Craft Process

Every drum begins as a raw log. Artisans shape the body by hand, stretch and lace the goat-skin head, and finish each piece with traditional carvings or rope detailing. No two drums are identical — each carries the maker's individual touch.

![Artisan hand-carving a djembe drum body at the Dodowa workshop](/pics/process.jpeg "A Geolicrafts artisan at work — each djembe takes hours of careful carving")

## The Training Centre Vision

With over $1 million in grant funding from Invest For Employment (part of the German Development Cooperation), Geolicrafts opened a state-of-the-art training centre in Dodowa, designed to train approximately 2,000 people — particularly rural women and youth — in handicraft and fashion creation.

"Every time we train someone, we are investing in a family. We are investing in a community," said Akologo.

## The Road Ahead

Geolicrafts has ambitious plans: international craft exhibitions, collaboration with Ghana's Tourism Ministry, and establishing global warehouses to streamline international sourcing.

The CEO believes the handicraft sector, if properly supported, could rival Ghana's cocoa and gold exports. "We have the talent, the heritage, and the creativity. What we need is the platform — and we are building it."
    `,
    category: 'News',
    image_url: 'https://geolicrafts.com/wp-content/uploads/2023/02/Geolicrafts-Website-Banner-01.jpg',
    published_at: '2023-12-08',
    read_time: 5,
  },
  {
    id: 2,
    slug: 'training-centre-dodowa',
    title: "Inside the Dodowa Training Centre: How Geolicrafts is Building Ghana's Next Generation of Artisans",
    excerpt: "With over $1 million in funding from Germany's Invest for Employment facility, Geolicrafts opened a state-of-the-art vocational training centre in Dodowa — transforming rural youth and women into skilled artisans.",
    content: `
In 2023, Geolicrafts Company Limited achieved a landmark milestone: the opening of a purpose-built vocational training centre in Dodowa, Greater Accra Region — funded by over **1.03 million Euros (approximately $1.1 million USD)** from the Invest for Employment (IFE) Facility.

![The Geolicrafts team and the IFE delegation at the official visit in Dodowa](/pics/ife/group-pic.jpeg "Geolicrafts staff and the IFE delegation — KfW Bank and German Embassy representatives — at the Dodowa compound")

## What is the Invest for Employment (IFE) Facility?

The Invest for Employment Facility is a German Development Cooperation initiative funded by Germany's Federal Ministry for Economic Cooperation and Development (BMZ) and implemented through KfW Bank. Its mission is to support private sector companies in sub-Saharan Africa that create sustainable employment — particularly for disadvantaged groups including women and rural youth.

Geolicrafts was selected as a beneficiary because of its proven track record exporting authentic Ghanaian handicrafts to Europe and the USA, and its commitment to community empowerment.

![George Akologo presents a hand-carved gift to the IFE delegation](/pics/ife/ife2.jpeg "A ceremonial exchange — George Akologo presents the IFE delegation with a hand-crafted piece")

## The Grant: What It Funds

The IFE grant of over 1.03 million Euros enabled Geolicrafts to:
- **Construct a new training facility** in Dodowa, equipped for hands-on craft production
- **Establish dedicated training workshops** for straw weaving, wood carving, leather work, and fashion design
- **Procure tools and equipment** for approximately 2,000 trainees
- **Develop a structured curriculum** in partnership with Ghana's Technical and Vocational Education and Training (TVET) system

## The Groundbreaking Ceremony

The IFE delegation — including representatives from KfW Bank and the German Embassy — visited Geolicrafts' Dodowa compound for the official groundbreaking ceremony. They toured the existing production floor, saw artisans at work carving djembe drums and weaving baskets, and witnessed firsthand the scale of the company's operation before breaking ground on the new facility.

![Officials and Geolicrafts team break ground at the new training centre site in Dodowa](/pics/ife/ife3.jpeg "The groundbreaking moment — officials and the Geolicrafts team mark the start of construction")

[gallery]/pics/ife/ife4.jpeg,/pics/ife/ife5.jpeg,/pics/ife/ife6.jpeg

## Who Gets Trained?

The training programme specifically targets:
- **Rural women** — who form the backbone of Ghana's craft economy but are often excluded from formal vocational pathways
- **Young people** from the Greater Accra and surrounding regions who lack formal employment opportunities
- **Existing artisans** looking to professionalise their skills and access export markets

Trainees receive instruction in straw basket weaving, Bolga-style craft techniques, traditional wood carving, sewing, and fashion design — each of which feeds directly into Geolicrafts' export supply chain.

![Women training in fashion design and sewing at the Dodowa centre](/pics/training.jpeg "Trainees at sewing machines — fashion design is one of four disciplines offered at the centre")

## A Vision for the Future

"Every time we train someone, we are investing in a family. We are investing in a community," said George Akologo, Founder and CEO of Geolicrafts.

The training centre is not just a facility — it is a pipeline. As trainees graduate, they either join Geolicrafts' workforce directly or set up their own micro-enterprises supplying Geolicrafts with finished goods for export. This model turns a single grant into a multiplier of economic impact across the Dodowa community and beyond.

![The new Dodowa Training Centre building — partially complete at time of visit](/pics/trainingschoolbuilding.jpeg "The training centre building taking shape in Dodowa, funded by the IFE grant")

## By the Numbers

- **1.03M+ Euros** in IFE grant funding secured
- **2,000+** young people to be trained
- **Focus on women** and rural youth from Greater Accra
- **4 craft disciplines**: straw weaving, wood carving, leather work, fashion design
- **Dodowa, Greater Accra** — home to Geolicrafts' main office and production facility
    `,
    category: 'Community',
    image_url: '/pics/ife/group-pic.jpeg',
    published_at: '2023-06-15',
    read_time: 6,
  },
  {
    id: 3,
    slug: 'bolga-baskets-global',
    title: "Bolga Baskets: How a Ghanaian Tradition Conquered Global Markets",
    excerpt: "Hand-woven by skilled women in the Upper East Region, Bolga baskets have become one of Ghana's most beloved craft exports — reaching homes in Europe, the USA, and beyond.",
    content: `
Few objects capture the spirit of Ghanaian craft quite like the Bolga basket. Hand-woven from elephant grass by skilled women artisans in Bolgatanga, the capital of Ghana's Upper East Region, these baskets have travelled from dusty market stalls to the shelves of boutique stores across Europe and the United States.

At Geolicrafts, Bolga baskets are one of our most exported product lines — and they represent something much more than a beautiful object.

![Artisans weaving Bolga baskets at the Dodowa workshop](/pics/workers1.jpeg "Two artisans at the Geolicrafts workshop — the basket weaving process is entirely done by hand")

## What Makes a Bolga Basket?

The Bolga basket takes its name from Bolgatanga, the city in Ghana's Upper East Region where this weaving tradition originated. Made from locally grown elephant grass (veta vera), each basket is:

- **Woven entirely by hand** — no machinery is involved at any stage
- **Dyed with natural pigments** — producing the bright reds, greens, and yellows that characterise Bolga work
- **Built to last** — properly maintained Bolga baskets can last a decade or more
- **Individually unique** — no two baskets have the exact same pattern

The process starts with harvesting the grass, drying it, splitting the strands, and then weaving them in tight spirals from the base upward. A skilled weaver can produce one medium basket in roughly two days.

![Colourful Bolga round baskets ready for export](/pics/process2.jpeg "Finished basket products lined up at the Geolicrafts production floor")

## A Women-Led Craft Economy

In Bolgatanga and across the Upper East Region, basket weaving is primarily a women's trade — passed from mothers to daughters over generations. At Geolicrafts, we work with a network of weavers who produce baskets to our export standards: consistent sizing, tight weaves, and durable handles.

These women earn directly from their craft, supporting families and communities in one of Ghana's more rural and under-resourced regions.

## From Dodowa to the World

Geolicrafts sources, quality-checks, and exports Bolga baskets from our Dodowa compound. Our export warehouse holds ready-to-ship stock at all times — baskets nested and packed for sea freight to Germany, Italy, the Netherlands, the UK, and the United States.

![The Geolicrafts export warehouse — baskets and drums ready for international shipment](/pics/warehouse1.jpeg "The Dodowa warehouse: Bolga baskets stacked alongside drums and other handicrafts ready for export")

In 2021 alone, Geolicrafts exported products worth 771,000 euros — a significant portion of which came from basket and woven goods.

## Varieties We Produce

- **Round baskets** — the classic Bolga shape, available in small, medium, and large
- **Oval baskets** — ideal for storage and décor
- **Laundry baskets** — large-format baskets for household use
- **Bicycle baskets** — a popular export item for European cycling culture
- **Pot baskets** — small decorative pieces in tight weave patterns
- **Youth shopper bags** — lightweight carry bags for everyday use

## Ordering & Wholesale

We supply to individual buyers, boutique retailers, and wholesale importers. Contact us at info@geolicraftsgh.com for current pricing, minimum order quantities, and lead times.
    `,
    category: 'Crafts',
    image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/G-158-no-handle-round-primary.jpg',
    published_at: '2023-03-20',
    read_time: 6,
  },
  {
    id: 4,
    slug: 'drums-cultural-heritage',
    title: "The Heartbeat of Ghana: Preserving the Sacred Art of Drum-Making",
    excerpt: "From Djembe to Dundum, every drum Geolicrafts produces is carved by hand using Tweneboa wood and goat skin. Here's how this ancient craft stays alive — and finds a global audience.",
    content: `
In Ghana, the drum is not merely a musical instrument. It is a language. Traditionally, talking drums carried messages between villages, announced royal ceremonies, and guided warriors into battle. Today, the drum-making tradition continues — and at Geolicrafts, it is very much alive.

Every drum that leaves our Dodowa workshop is hand-carved by a skilled artisan. No two are identical. Each carries the mark of the hands that made it.

![A Geolicrafts artisan hand-carving a djembe drum body from raw wood](/pics/process.jpeg "The carving process: raw Tweneboa logs are shaped entirely by hand into drum bodies")

## The Wood

The best West African drums are made from **Tweneboa** (also called Lenke or Dimba) — a dense, resonant hardwood that produces the deep, rich tones associated with professional-grade African drums. At Geolicrafts, we source Tweneboa logs locally and season them carefully before carving begins.

The entire drum body — from the wide top opening down through the hourglass waist to the bottom — is carved from a single piece of wood. This one-piece construction is what gives a properly made djembe its unique acoustic properties.

## The Process

Drum-making at Geolicrafts follows a step-by-step process that has changed little over generations:

- **1. Logging** — Tweneboa is sourced and cut to size
- **2. Rough carving** — artisans use adzes and chisels to shape the outer form
- **3. Interior carving** — the inside is hollowed to achieve the right wall thickness for sound
- **4. Sanding and finishing** — the exterior is smoothed and sometimes carved with decorative motifs
- **5. Skin preparation** — goat skin is cleaned, soaked, and stretched over the drum head
- **6. Lacing** — the skin is pulled tight and secured with rope in traditional patterns

![Artisan finishing work on a drum body — multiple drums visible in background](/pics/process1.jpeg "An artisan tightening the rope lacing on a completed drum body at the Dodowa workshop")

## Inside the Workshop

Our main production floor in Dodowa is where the carving happens. At any given time, dozens of drums are at various stages of completion — some just rough-shaped logs, others fully carved and awaiting their skins.

![The Geolicrafts drum workshop — artisans carving in the open-air production area](/pics/workers.jpeg "The main production floor: artisans work on multiple drums simultaneously")

[gallery]/pics/process.jpeg,/pics/workers1.jpeg,/pics/warehouse2.jpeg

## Our Drum Range

Geolicrafts produces a full range of West African percussion instruments:

- **Djembe Standard** — the most popular export item; available in 30–40cm heights
- **Djembe Carved** — standard djembe with traditional Akan motifs carved into the body
- **Djembe Professional** — larger format with premium skin and lacing for performance use
- **Dundum** — the bass drum of the djembe ensemble; played with a stick
- **Ashiko** — a conical drum with a different tonal profile from the djembe
- **Bougarabou** — a cluster of conical drums, used in Senegambian ceremonies

## Export Ready

The majority of our drums are exported to Europe and the United States — destined for music schools, percussion teachers, world music retailers, and collectors. We ship by sea freight in specially prepared containers to protect the instruments.

![The export warehouse — hundreds of drums stacked and ready for shipment](/pics/warehouse2.jpeg "Ready for the world: Geolicrafts' warehouse holds hundreds of finished drums awaiting export")

Interested in wholesale drum orders? Contact us at info@geolicraftsgh.com — we supply individual units and full container loads.
    `,
    category: 'Crafts',
    image_url: 'https://geolicrafts.com/wp-content/uploads/2023/05/465c92b360326a2a3dc707771cc4e622-drums-instruments.jpg',
    published_at: '2022-11-10',
    read_time: 7,
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
}

function renderContent(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    // ## Heading
    if (line.startsWith('## ')) {
      return <h2 key={i} className="font-display text-2xl font-bold text-earth-900 mt-10 mb-4">{line.slice(3)}</h2>
    }
    // Bullet list item
    if (line.startsWith('- ')) {
      return <li key={i} className="text-earth-700 leading-relaxed ml-4 mb-1">{parseBold(line.slice(2))}</li>
    }
    // Numbered list item  e.g. "- **1. Logging**"
    // Inline image: ![alt](url) or ![alt](url "caption")
    if (line.startsWith('![')) {
      const match = line.match(/!\[([^\]]*)\]\(([^)"]+)(?:\s+"([^"]+)")?\)/)
      if (match) {
        const [, alt, url, caption] = match
        return (
          <figure key={i} className="my-8">
            <img
              src={url}
              alt={alt}
              className="w-full rounded-xl object-cover max-h-[480px]"
            />
            {caption && (
              <figcaption className="text-center text-earth-400 text-xs mt-2 italic">{caption}</figcaption>
            )}
          </figure>
        )
      }
    }
    // Photo gallery: [gallery]/url1,/url2,/url3
    if (line.startsWith('[gallery]')) {
      const urls = line.replace('[gallery]', '').split(',').map(u => u.trim()).filter(Boolean)
      return (
        <div key={i} className="grid grid-cols-3 gap-2 my-8">
          {urls.map((url, j) => (
            <img
              key={j}
              src={url}
              alt=""
              className="w-full h-40 md:h-52 object-cover rounded-lg"
            />
          ))}
        </div>
      )
    }
    // Empty line
    if (line.trim() === '') return <br key={i} />
    // Normal paragraph
    return <p key={i} className="text-earth-700 leading-relaxed mb-4">{parseBold(line)}</p>
  })
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
        const fallback = FALLBACK_POSTS.find(p => p.slug === slug)
        if (fallback) {
          setPost(fallback)
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
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/pics/process.jpeg' }}
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
