import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'geolicrafts-quote'
const QuoteContext = createContext(null)

function load() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function QuoteProvider({ children }) {
  const [items, setItems] = useState(load)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* storage unavailable */ }
  }, [items])

  // Upsert: adding a product already in the list sets its quantity
  const add = useCallback((product, qty = 1) => {
    setItems(prev => {
      const entry = {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        path: product.path,
        qty: Math.max(1, qty),
        notes: '',
      }
      const existing = prev.find(i => i.id === product.id)
      return existing
        ? prev.map(i => (i.id === product.id ? { ...i, qty: entry.qty } : i))
        : [...prev, entry]
    })
  }, [])

  const update = useCallback((id, patch) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)))
  }, [])

  const remove = useCallback(id => setItems(prev => prev.filter(i => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])
  const has = useCallback(id => items.some(i => i.id === id), [items])

  const count = items.length

  return (
    <QuoteContext.Provider value={{ items, count, add, update, remove, clear, has, drawerOpen, setDrawerOpen }}>
      {children}
    </QuoteContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useQuote = () => useContext(QuoteContext)
