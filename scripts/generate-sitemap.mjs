// Writes public/sitemap.xml and public/robots.txt before each build.
// Product and blog URLs come from Supabase; if that fails the static pages are
// still listed, so this never breaks a build.
import fs from 'node:fs'

for (const file of ['.env', '.env.local']) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

// SITE_URL overrides; otherwise Vercel's production domain
const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'geolicrafts.vercel.app'
const SITE = (host.startsWith('http') ? host : `https://${host}`).replace(/\/$/, '')
const SB_URL = process.env.VITE_SUPABASE_URL
const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item'
const day = d => (d ? new Date(d).toISOString().slice(0, 10) : undefined)

async function rows(query) {
  if (!SB_URL || !SB_KEY) return []
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${query}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      signal: AbortSignal.timeout(15000),
    })
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/products', priority: '0.9' },
  { loc: '/about', priority: '0.7' },
  { loc: '/blog', priority: '0.7' },
  { loc: '/contact', priority: '0.6' },
  { loc: '/catalogue', priority: '0.5' },
]

const products = await rows('products?select=id,name,slug,created_at&limit=5000')
for (const p of products) {
  urls.push({ loc: `/products/${p.slug || `${slugify(p.name)}--${p.id}`}`, lastmod: day(p.created_at), priority: '0.8' })
}

const posts = await rows('blog_posts?select=slug,published_at&published=eq.true')
for (const p of posts) urls.push({ loc: `/blog/${p.slug}`, lastmod: day(p.published_at), priority: '0.6' })

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${encodeURI(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`

fs.writeFileSync('public/sitemap.xml', xml)
fs.writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /quote\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap: ${urls.length} URLs (${products.length} products, ${posts.length} posts) for ${SITE}`)
