import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { CATEGORIES } from './products'

// Small cached loaders for admin-managed content. Each resolves to an empty
// list (or the built-in defaults) if its table doesn't exist yet, so the site
// keeps working before migration 004 is applied.
const caches = {}

function cached(key, load) {
  if (!caches[key]) caches[key] = load()
  return caches[key]
}

export const invalidateContent = key => { delete caches[key] }

const loaders = {
  categories: () => supabase.from('categories').select('name').order('sort_order').order('name')
    .then(({ data, error }) => (error || !data?.length ? CATEGORIES : data.map(c => c.name))),
  testimonials: () => supabase.from('testimonials').select('*').eq('published', true).order('sort_order')
    .then(({ data, error }) => (error ? [] : data || [])),
  partners: () => supabase.from('partners').select('*').eq('published', true).order('sort_order')
    .then(({ data, error }) => (error ? [] : data || [])),
}

function useContent(key) {
  const [value, setValue] = useState(null)
  useEffect(() => {
    let alive = true
    cached(key, loaders[key]).then(v => alive && setValue(v))
    return () => { alive = false }
  }, [key])
  return value
}

/** Category names in admin-defined order, plus any extra category found on products. */
export function useCategories(products = []) {
  const names = useContent('categories') || CATEGORIES
  const extra = [...new Set(products.map(p => p.category).filter(Boolean))].filter(c => !names.includes(c))
  return [...names, ...extra]
}

export const useTestimonials = () => useContent('testimonials') || []
export const usePartners = () => useContent('partners') || []
