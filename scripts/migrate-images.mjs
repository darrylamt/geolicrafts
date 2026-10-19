#!/usr/bin/env node
/**
 * Copies product images that are hosted elsewhere (e.g. the old geolicrafts.com
 * WordPress site) into Supabase Storage as compressed WebP, then points each
 * product at its new copy. Safe to re-run: images already in Storage are skipped.
 *
 * Usage (from the project root):
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-images.mjs --dry-run
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-images.mjs
 *
 * The project URL is read from SUPABASE_URL or VITE_SUPABASE_URL (also from .env / .env.local).
 * The service role key is in Supabase → Project Settings → API. Never commit it.
 *
 * Options:
 *   --dry-run          list what would change without uploading or updating anything
 *   --limit N          only process the first N products (handy for a first test)
 *   --bucket NAME      storage bucket (default: images)
 *   --concurrency N    parallel downloads (default: 4)
 *   --max-size PX      longest side in pixels (default: 1600)
 *   --quality Q        WebP quality 1–100 (default: 80)
 */
import fs from 'node:fs'
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// ── Config ────────────────────────────────────────────────────────────
for (const file of ['.env', '.env.local']) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const DRY_RUN = flag('dry-run')
const LIMIT = Number(opt('limit', Infinity))
const BUCKET = opt('bucket', 'images')
const CONCURRENCY = Number(opt('concurrency', 4))
const MAX_SIZE = Number(opt('max-size', 1600))
const QUALITY = Number(opt('quality', 80))

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Example: SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-images.mjs --dry-run')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
const storageHost = new URL(SUPABASE_URL).host

// Anything that isn't already in this project's Storage gets migrated
const isExternal = url => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return false
  try { return new URL(url).host !== storageHost } catch { return false }
}

// ── Helpers ───────────────────────────────────────────────────────────
const kb = bytes => `${(bytes / 1024).toFixed(0)}KB`

async function fetchWithRetry(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'geolicrafts-image-migration' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      if (attempt >= tries) throw err
      await new Promise(r => setTimeout(r, 1000 * attempt))
    }
  }
}

const migrated = new Map() // original URL → promise of new public URL (dedupes shared images)
const stats = { downloaded: 0, before: 0, after: 0, failed: [] }

function migrateUrl(url) {
  if (!migrated.has(url)) {
    migrated.set(url, (async () => {
      // Deterministic name per source URL, so re-runs reuse earlier uploads
      const path = `products/migrated/${crypto.createHash('sha1').update(url).digest('hex').slice(0, 20)}.webp`
      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
      if (DRY_RUN) return publicUrl

      const head = await fetch(publicUrl, { method: 'HEAD' }).catch(() => null)
      if (head?.ok) return publicUrl

      const input = await fetchWithRetry(url)
      const output = await sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer()

      const { error } = await supabase.storage.from(BUCKET).upload(path, output, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      })
      if (error) throw new Error(`upload failed: ${error.message}`)

      stats.downloaded++
      stats.before += input.length
      stats.after += output.length
      return publicUrl
    })())
  }
  return migrated.get(url)
}

// ── Main ──────────────────────────────────────────────────────────────
async function loadProducts() {
  const all = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('products').select('*').order('created_at').range(from, from + 999)
    if (error) throw error
    all.push(...data)
    if (data.length < 1000) return all
  }
}

async function processProduct(p) {
  const hasGallery = Array.isArray(p.images)
  const sources = [p.image_url, ...(hasGallery ? p.images : [])].filter(isExternal)
  if (sources.length === 0) return 'skipped'

  const swap = async url => {
    if (!isExternal(url)) return url
    try {
      return await migrateUrl(url)
    } catch (err) {
      stats.failed.push({ product: p.name, url, error: err.message })
      return url // keep the old link rather than breaking the product
    }
  }

  const patch = { image_url: await swap(p.image_url) }
  if (hasGallery) patch.images = await Promise.all(p.images.map(swap))

  const changed = patch.image_url !== p.image_url || (hasGallery && patch.images.some((u, i) => u !== p.images[i]))
  if (!changed) return 'failed'

  if (DRY_RUN) {
    console.log(`would update  ${p.name}  (${sources.length} image${sources.length > 1 ? 's' : ''})`)
    return 'updated'
  }
  const { error } = await supabase.from('products').update(patch).eq('id', p.id)
  if (error) {
    stats.failed.push({ product: p.name, url: '(row update)', error: error.message })
    return 'failed'
  }
  console.log(`updated  ${p.name}`)
  return 'updated'
}

async function main() {
  console.log(`${DRY_RUN ? '[dry run] ' : ''}Loading products from ${storageHost}…`)
  const products = (await loadProducts()).slice(0, LIMIT)
  const external = products.filter(p => [p.image_url, ...(Array.isArray(p.images) ? p.images : [])].some(isExternal))
  console.log(`${products.length} products, ${external.length} with externally hosted images.\n`)

  const counts = { updated: 0, skipped: 0, failed: 0 }
  let next = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < products.length) {
      const result = await processProduct(products[next++])
      counts[result]++
    }
  }))

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${counts.updated} products · ${counts.skipped} already fine · ${counts.failed} with errors`)
  if (!DRY_RUN && stats.downloaded) {
    console.log(`Uploaded ${stats.downloaded} images: ${kb(stats.before)} → ${kb(stats.after)} (${Math.round((1 - stats.after / stats.before) * 100)}% smaller)`)
  }
  if (stats.failed.length) {
    fs.writeFileSync('migrate-images-errors.json', JSON.stringify(stats.failed, null, 2))
    console.log(`\n${stats.failed.length} images failed — details in migrate-images-errors.json. Those products keep their old links; re-run to retry.`)
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
