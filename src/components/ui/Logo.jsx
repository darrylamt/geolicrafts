import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Geolicrafts home">
      <span className="grid place-items-center h-8 w-8 rounded-full bg-white ring-1 ring-stone-200 overflow-hidden">
        <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
      </span>
      <span className={`font-display text-2xl leading-none ${light ? 'text-white' : 'text-stone-900'}`}>
        Geolicrafts
      </span>
    </Link>
  )
}
