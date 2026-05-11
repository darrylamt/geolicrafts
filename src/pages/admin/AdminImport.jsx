import { useState } from 'react'
import { Download, Upload, Globe, CheckCircle, AlertCircle, Loader, X, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = ['Musical Instruments', 'Baskets & Weaving', 'Wood Carvings', 'Textiles & Fashion', 'Gifts & Souvenirs']
const WP_URL = 'https://geolicrafts.com'

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

// ─── WordPress Importer ───────────────────────────────────────────────
function WordPressImporter() {
  const [step, setStep] = useState('idle') // idle | fetching | preview | importing | done
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [error, setError] = useState('')

  async function fetchWordPressMedia() {
    setStep('fetching')
    setError('')
    let all = []
    let page = 1

    try {
      while (true) {
        const res = await fetch(
          `${WP_URL}/wp-json/wp/v2/media?per_page=100&page=${page}&media_type=image&_fields=id,title,alt_text,caption,source_url,date`,
          { headers: { Accept: 'application/json' } }
        )
        if (!res.ok) break
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) break
        all = [...all, ...data]
        page++
      }

      if (all.length === 0) {
        setError('No images found. Make sure geolicrafts.com WordPress REST API is publicly accessible.')
        setStep('idle')
        return
      }

      const mapped = all.map(item => ({
        wp_id: item.id,
        name: stripHtml(item.title?.rendered) || item.source_url.split('/').pop().replace(/[-_]/g, ' ').replace(/\.[^.]+$/, ''),
        description: stripHtml(item.caption?.rendered) || item.alt_text || '',
        image_url: item.source_url,
        category: guessCategory(item.title?.rendered, item.alt_text, item.caption?.rendered),
        checked: true,
      }))

      setItems(mapped)
      setSelected(new Set(mapped.map(m => m.wp_id)))
      setStep('preview')
    } catch (err) {
      setError(`Failed to fetch: ${err.message}. Try the Node.js script instead (see below).`)
      setStep('idle')
    }
  }

  async function importSelected() {
    const toImport = items.filter(i => selected.has(i.wp_id))
    setProgress({ done: 0, total: toImport.length })
    setStep('importing')

    const BATCH = 50
    let done = 0
    for (let i = 0; i < toImport.length; i += BATCH) {
      const batch = toImport.slice(i, i + BATCH).map(({ name, description, image_url, category }) => ({
        name, description, image_url, category,
      }))
      const { error } = await supabase.from('products').insert(batch)
      if (error) {
        toast.error(`Batch error: ${error.message}`)
      }
      done += batch.length
      setProgress({ done, total: toImport.length })
    }

    setStep('done')
    toast.success(`Imported ${toImport.length} products!`)
  }

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map(i => i.wp_id)))
  }

  const toggleOne = id => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const updateCategory = (id, cat) => {
    setItems(prev => prev.map(i => i.wp_id === id ? { ...i, category: cat } : i))
  }

  const updateName = (id, name) => {
    setItems(prev => prev.map(i => i.wp_id === id ? { ...i, name } : i))
  }

  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <CheckCircle size={52} className="mx-auto text-green-500 mb-4" />
        <h3 className="font-display text-xl font-bold text-sand-900 mb-2">Import Complete!</h3>
        <p className="text-sand-500 mb-6">{progress.total} products imported from WordPress.</p>
        <button onClick={() => { setStep('idle'); setItems([]); setSelected(new Set()) }} className="btn-primary">
          <RefreshCw size={16} /> Import More
        </button>
      </div>
    )
  }

  if (step === 'importing') {
    const pct = Math.round((progress.done / progress.total) * 100)
    return (
      <div className="text-center py-12">
        <Loader size={40} className="mx-auto text-kente-500 mb-4 animate-spin" />
        <p className="text-sand-700 font-medium mb-4">Importing {progress.done} of {progress.total}...</p>
        <div className="w-full bg-sand-100 rounded-full h-3 max-w-sm mx-auto">
          <div className="bg-forest-600 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sand-400 text-sm mt-2">{pct}%</p>
      </div>
    )
  }

  if (step === 'fetching') {
    return (
      <div className="text-center py-12">
        <Loader size={40} className="mx-auto text-kente-500 mb-4 animate-spin" />
        <p className="text-sand-600">Fetching images from geolicrafts.com...</p>
        <p className="text-sand-400 text-sm mt-2">This may take a moment for large libraries.</p>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-sand-900">{items.length} images found</p>
            <p className="text-sand-500 text-sm">{selected.size} selected for import</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleAll} className="text-sm text-forest-700 hover:underline">
              {selected.size === items.length ? 'Deselect all' : 'Select all'}
            </button>
            <button
              onClick={importSelected}
              disabled={selected.size === 0}
              className="btn-primary text-sm py-2"
            >
              <Upload size={15} /> Import {selected.size} products
            </button>
          </div>
        </div>

        <p className="text-xs text-sand-400 mb-3">
          Categories have been auto-detected from image names. You can adjust them before importing.
        </p>

        <div className="border border-sand-200 rounded-xl overflow-hidden max-h-[55vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-sand-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 w-8" />
                <th className="px-3 py-2 text-left font-medium text-sand-600 w-16">Image</th>
                <th className="px-3 py-2 text-left font-medium text-sand-600">Name</th>
                <th className="px-3 py-2 text-left font-medium text-sand-600 w-44">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {items.map(item => (
                <tr key={item.wp_id} className={`hover:bg-sand-50 ${!selected.has(item.wp_id) ? 'opacity-40' : ''}`}>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(item.wp_id)}
                      onChange={() => toggleOne(item.wp_id)}
                      className="accent-forest-700"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg" loading="lazy"
                      onError={e => { e.target.style.display = 'none' }} />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateName(item.wp_id, e.target.value)}
                      className="w-full bg-transparent border-b border-transparent hover:border-sand-300 focus:border-kente-400 focus:outline-none py-0.5 text-sand-900 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={item.category}
                      onChange={e => updateCategory(item.wp_id, e.target.value)}
                      className="w-full text-xs bg-sand-100 border-0 rounded-lg px-2 py-1.5 text-sand-700 focus:outline-none focus:ring-1 focus:ring-kente-400"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // idle
  return (
    <div className="space-y-4">
      <p className="text-sand-600 text-sm leading-relaxed">
        This will fetch all images from the <strong>geolicrafts.com</strong> WordPress media library
        and import them as products. Categories are auto-detected from image names — you can adjust them before confirming.
      </p>
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <button onClick={fetchWordPressMedia} className="btn-primary">
        <Globe size={18} /> Fetch from geolicrafts.com
      </button>
    </div>
  )
}

// ─── CSV Importer ─────────────────────────────────────────────────────
function CsvImporter() {
  const [rows, setRows] = useState([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function parseCSV(text) {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
      const obj = {}
      headers.forEach((h, i) => {
        obj[h] = (values[i] || '').replace(/^"|"$/g, '').trim()
      })
      return obj
    }).filter(r => r.name || r.title)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = parseCSV(ev.target.result)
        const mapped = parsed.map((r, i) => ({
          id: i,
          name: r.name || r.title || '',
          description: r.description || r.caption || r.alt || '',
          image_url: r.image_url || r.image || r.url || r.source_url || '',
          category: CATEGORIES.includes(r.category) ? r.category : guessCategory(r.name || r.title),
        }))
        setRows(mapped)
        setError('')
      } catch {
        setError('Could not parse CSV. Check the format below.')
      }
    }
    reader.readAsText(file)
  }

  async function importRows() {
    setImporting(true)
    const batch = rows.map(({ name, description, image_url, category }) => ({ name, description, image_url, category }))
    const { error } = await supabase.from('products').insert(batch)
    if (error) toast.error(error.message)
    else { toast.success(`${rows.length} products imported!`); setDone(true) }
    setImporting(false)
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
        <p className="font-semibold text-sand-900">Import complete!</p>
        <button onClick={() => { setRows([]); setDone(false) }} className="btn-primary mt-4 text-sm">Import another file</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sand-600 text-sm mb-3">
          Upload a <strong>.csv</strong> file with columns: <code className="bg-sand-100 px-1.5 py-0.5 rounded text-xs">name, description, image_url, category</code>
        </p>
        <div className="border-2 border-dashed border-sand-200 rounded-xl p-6 text-center hover:border-kente-400 transition-colors">
          <Upload size={28} className="mx-auto text-sand-300 mb-2" />
          <label className="cursor-pointer">
            <span className="text-forest-700 font-medium text-sm">Choose CSV file</span>
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </label>
          <p className="text-sand-400 text-xs mt-1">or drag and drop</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sand-700 font-medium text-sm">{rows.length} rows ready</p>
            <button onClick={importRows} disabled={importing} className="btn-primary text-sm py-2">
              {importing ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
              {importing ? 'Importing...' : `Import ${rows.length} products`}
            </button>
          </div>
          <div className="border border-sand-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-sand-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-sand-500">Name</th>
                  <th className="px-3 py-2 text-left font-medium text-sand-500">Category</th>
                  <th className="px-3 py-2 text-left font-medium text-sand-500">Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-50">
                {rows.map(r => (
                  <tr key={r.id}>
                    <td className="px-3 py-2 text-sand-900">{r.name}</td>
                    <td className="px-3 py-2"><span className="badge text-[10px]">{r.category}</span></td>
                    <td className="px-3 py-2 text-sand-400 truncate max-w-[140px]">{r.image_url || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Template download */}
      <div className="bg-sand-50 rounded-xl p-4">
        <p className="text-sand-600 text-xs font-medium mb-2">CSV Template format:</p>
        <code className="text-xs text-sand-500 block">
          name,description,image_url,category<br />
          Djembe Drum,Hand-carved drum,https://...,Musical Instruments
        </code>
        <button
          onClick={() => {
            const csv = 'name,description,image_url,category\nDjembe Drum,Hand-carved djembe drum,https://geolicrafts.com/wp-content/uploads/2023/05/example.jpg,Musical Instruments\n'
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv])); a.download = 'products-template.csv'; a.click()
          }}
          className="mt-3 flex items-center gap-1.5 text-forest-700 text-xs font-medium hover:underline"
        >
          <Download size={13} /> Download template
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────
export default function AdminImport() {
  const [tab, setTab] = useState('wordpress')

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-sand-900">Bulk Import</h1>
        <p className="text-sand-500 text-sm mt-1">Import hundreds of products at once from WordPress or a spreadsheet.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'wordpress', label: '🌐 Import from WordPress' },
          { key: 'csv', label: '📄 Import from CSV' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-[#3B1F0A] text-[#F5A200]'
                : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-100 p-6">
        {tab === 'wordpress' ? <WordPressImporter /> : <CsvImporter />}
      </div>

      {/* Node.js script note */}
      <div className="mt-6 bg-[#1a1a1a] rounded-xl p-5">
        <p className="text-white/70 text-xs font-mono mb-2 flex items-center gap-2">
          <span className="text-kente-400">$</span> Alternative: run the Node.js migration script locally
        </p>
        <code className="text-kente-300 text-xs font-mono block">
          VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/import-from-wordpress.mjs
        </code>
        <p className="text-white/40 text-xs mt-2">
          Use this if the browser importer is blocked by CORS. The script is in your repo at <code className="text-white/60">scripts/import-from-wordpress.mjs</code>
        </p>
      </div>
    </div>
  )
}
