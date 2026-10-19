import { useEffect } from 'react'

const SITE_NAME = 'Geolicrafts'
const DEFAULT_TITLE = 'Geolicrafts — Authentic African Craftsmanship'
const DEFAULT_IMAGE = '/images/og.jpg'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) { el?.remove(); return }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Per-page <title>, description, canonical and social-preview tags.
 * (Product and blog pages also get these server-side via api/page.js,
 * since link-preview bots don't run JavaScript.)
 */
export default function Seo({ title, description, image, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
    const url = window.location.origin + window.location.pathname
    const img = new URL(image || DEFAULT_IMAGE, window.location.origin).href
    const desc = description?.replace(/\s+/g, ' ').trim().slice(0, 300)

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setCanonical(url)
  }, [title, description, image, type])

  return null
}
