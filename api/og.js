/* global process, Buffer */
// Branded 1200×630 share image for products and blog posts.
//   /api/og?type=product&slug=djembe-drum
//   /api/og?type=post&slug=bolga-baskets-global
// Referenced from the og:image tags that api/page.js injects.
import fs from 'node:fs'
import { ImageResponse } from '@vercel/og'
import sharp from 'sharp'
import { card } from './_og-card.js'
import { lookup } from './page.js'

const font = name => fs.readFileSync(new URL(`./_fonts/${name}`, import.meta.url))
const FONTS = [
  { name: 'Inter', data: font('Inter-400.ttf'), weight: 400, style: 'normal' },
  { name: 'Inter', data: font('Inter-500.ttf'), weight: 500, style: 'normal' },
  { name: 'Inter', data: font('Inter-600.ttf'), weight: 600, style: 'normal' },
  { name: 'Serif', data: font('InstrumentSerif-Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Serif', data: font('InstrumentSerif-Italic.ttf'), weight: 400, style: 'italic' },
]

// The renderer can't read WebP, so fetch the photo and hand it over as a JPEG data URI
async function asJpeg(url, size) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const input = Buffer.from(await res.arrayBuffer())
    const out = await sharp(input).rotate().flatten({ background: '#ffffff' }).resize(size, size, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toBuffer()
    return `data:image/jpeg;base64,${out.toString('base64')}`
  } catch {
    return null
  }
}

const COVERS = {
  'geolicrafts-ceo-vision': '/pics/founder.webp',
  'training-centre-dodowa': '/pics/ife/group-pic.webp',
  'bolga-baskets-global': '/pics/workers1.webp',
  'drums-cultural-heritage': '/pics/process.webp',
}

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${proto}://${req.headers.host}`
  const kind = req.query.type === 'post' ? 'post' : 'product'
  const slug = String(req.query.slug || '')

  let meta = null
  try {
    meta = await lookup(kind, slug, { url: process.env.VITE_SUPABASE_URL, key: process.env.VITE_SUPABASE_ANON_KEY })
  } catch { /* fall through to the generic card */ }

  const imageUrl = meta?.image && !/geolicrafts\.com\/wp-content/.test(meta.image)
    ? new URL(meta.image, origin).href
    : kind === 'post' && COVERS[slug] ? origin + COVERS[slug] : null

  const [image, logo] = await Promise.all([
    imageUrl ? asJpeg(imageUrl, 1100) : null,
    asJpeg(`${origin}/logo.png`, 68),
  ])

  const data = meta
    ? kind === 'post'
      ? { title: meta.title, eyebrow: 'Journal', tagline: 'Stories from the Geolicrafts workshop', cta: 'Read the story  →' }
      : { title: meta.title, eyebrow: meta.category, tagline: 'Handcrafted in Dodowa, Ghana · Shipped worldwide' }
    : { title: 'Crafting Ghana’s soul into the world.', eyebrow: 'Since 2004', tagline: 'Drums, Bolga baskets and carvings, handmade in Dodowa.', cta: 'Explore  →' }

  try {
    const response = new ImageResponse(
      card({ ...data, image, logo, domain: req.headers.host?.replace(/^www\./, '') }),
      { width: 1200, height: 630, fonts: FONTS },
    )
    const png = Buffer.from(await response.arrayBuffer())
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400')
    res.end(png)
  } catch (err) {
    console.error('og render failed', err)
    res.statusCode = 302
    res.setHeader('Location', '/images/og.jpg')
    res.end()
  }
}
