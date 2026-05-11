/**
 * Geolicrafts — WordPress → Supabase bulk import script
 *
 * Usage:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co \
 *   VITE_SUPABASE_ANON_KEY=eyJ... \
 *   node scripts/import-from-wordpress.mjs
 *
 * Optional env vars:
 *   WP_URL=https://geolicrafts.com   (default)
 *   DRY_RUN=true                     skip database writes, just log what would be imported
 */

import { createClient } from '@supabase/supabase-js'

const WP_URL = process.env.WP_URL || 'https://geolicrafts.com'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const DRY_RUN = process.env.DRY_RUN === 'true'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function guessCategory(title = '', alt = '', caption = '') {
  const text = `${title} ${alt} ${caption}`.toLowerCase()
  if (/drum|djembe|dundum|talking|percussion|xylophone|balafon/.test(text)) return 'Musical Instruments'
  if (/basket|bolga|weav|straw|hat|woven/.test(text)) return 'Baskets & Weaving'
  if (/carv|mask|wood|sculpt|akuaba|figurin/.test(text)) return 'Wood Carvings'
  if (/kente|fabric|fashion|cloth|textile|fan|bead|jewel/.test(text)) return 'Textiles & Fashion'
  return 'Gifts & Souvenirs'
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

async function fetchAllMedia() {
  let all = []
  let page = 1
  console.log(`Fetching images from ${WP_URL}/wp-json/wp/v2/media ...`)

  while (true) {
    const url = `${WP_URL}/wp-json/wp/v2/media?per_page=100&page=${page}&media_type=image&_fields=id,title,alt_text,caption,source_url`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!res.ok) {
      if (res.status === 400) break // WordPress returns 400 when page exceeds total
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break

    all = [...all, ...data]
    process.stdout.write(`\r  Page ${page} — ${all.length} images found so far`)
    page++
  }

  console.log(`\nTotal: ${all.length} images fetched.`)
  return all
}

async function run() {
  const raw = await fetchAllMedia()

  const products = raw.map(item => ({
    name: stripHtml(item.title?.rendered) ||
      item.source_url.split('/').pop().replace(/[-_]/g, ' ').replace(/\.[^.]+$/, ''),
    description: stripHtml(item.caption?.rendered) || item.alt_text || '',
    image_url: item.source_url,
    category: guessCategory(item.title?.rendered, item.alt_text, item.caption?.rendered),
  }))

  console.log(`\nCategory breakdown:`)
  const counts = {}
  for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1
  for (const [cat, n] of Object.entries(counts)) console.log(`  ${cat}: ${n}`)

  if (DRY_RUN) {
    console.log('\nDRY_RUN=true — skipping database insert.')
    console.log('First 3 items preview:')
    console.log(JSON.stringify(products.slice(0, 3), null, 2))
    return
  }

  console.log('\nInserting into Supabase products table...')
  const BATCH = 50
  let inserted = 0

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH)
    const { error } = await supabase.from('products').insert(batch)
    if (error) {
      console.error(`Batch ${i / BATCH + 1} error:`, error.message)
    } else {
      inserted += batch.length
      process.stdout.write(`\r  Inserted ${inserted}/${products.length}`)
    }
  }

  console.log(`\nDone! ${inserted} products imported.`)
}

run().catch(err => {
  console.error('\nFatal error:', err.message)
  process.exit(1)
})
