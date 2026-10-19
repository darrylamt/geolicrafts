/* global process */
// Serves the app shell for /products/:slug and /blog/:slug with the right <title>,
// description and Open Graph tags filled in, so link previews (WhatsApp, Facebook,
// LinkedIn, X) and search engines see real page details without running JavaScript.
// Any failure falls back to the plain app shell, so pages never break because of this.

const SITE_NAME = 'Geolicrafts'

const escape = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const clean = s => String(s ?? '').replace(/[#*_>![\]()`]/g, '').replace(/\s+/g, ' ').trim()

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function lookup(kind, slug, { url, key, fetchImpl = fetch }) {
  if (!url || !key || !slug) return null
  const headers = { apikey: key, Authorization: `Bearer ${key}` }
  const get = async query => {
    const res = await fetchImpl(`${url}/rest/v1/${query}`, { headers })
    if (!res.ok) return null
    const rows = await res.json()
    return rows?.[0] || null
  }

  if (kind === 'post') {
    const post = await get(`blog_posts?select=title,excerpt,image_url&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`)
    return post && { title: post.title, description: post.excerpt, image: post.image_url, type: 'article' }
  }

  // Products: pretty slug, or the "name--<id>" form used before migration 002
  const sep = slug.lastIndexOf('--')
  const id = sep !== -1 ? slug.slice(sep + 2) : null
  const product = id && UUID.test(id)
    ? await get(`products?select=name,description,image_url,category&id=eq.${id}&limit=1`)
    : await get(`products?select=name,description,image_url,category&slug=eq.${encodeURIComponent(slug)}&limit=1`)
  return product && {
    title: product.name,
    description: product.description || `Handcrafted ${product.category || 'piece'} from Geolicrafts, Dodowa, Ghana.`,
    image: product.image_url,
    type: 'product',
  }
}

export function injectMeta(html, meta, pageUrl, origin) {
  const title = `${meta.title} — ${SITE_NAME}`
  const description = clean(meta.description).slice(0, 300)
  const image = meta.image ? new URL(meta.image, origin).href : `${origin}/images/og.jpg`

  const tags = [
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${escape(pageUrl)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${escape(meta.type)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${escape(image)}" />`,
    `<meta property="og:url" content="${escape(pageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ')

  return html
    // Drop the shell's generic tags so there's exactly one of each
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`)
    .replace(/\s*<meta\s+(name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<\/head>/i, `    ${tags}\n  </head>`)
}

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${proto}://${req.headers.host}`
  const { kind, slug } = req.query
  const path = kind === 'post' ? `/blog/${slug}` : `/products/${slug}`

  let html
  try {
    html = await (await fetch(`${origin}/index.html`)).text()
  } catch {
    res.statusCode = 302
    res.setHeader('Location', '/')
    return res.end()
  }

  try {
    const meta = await lookup(kind === 'post' ? 'post' : 'product', String(slug || ''), {
      url: process.env.VITE_SUPABASE_URL,
      key: process.env.VITE_SUPABASE_ANON_KEY,
    })
    if (meta) html = injectMeta(html, meta, origin + path, origin)
  } catch (err) {
    console.error('meta lookup failed', err)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  res.end(html)
}
