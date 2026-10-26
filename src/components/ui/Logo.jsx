import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Geolicrafts home">
      <span className="grid place-items-center h-11 w-11 md:h-12 md:w-12 shrink-0 rounded-full bg-white ring-1 ring-stone-200 shadow-sm overflow-hidden">
        <img src="/logo.png" alt="" className="h-9 w-9 md:h-10 md:w-10 object-contain" />
      </span>
      <span className={`font-display text-[1.75rem] md:text-[2.1rem] leading-none ${light ? 'text-white' : 'text-stone-900'}`}>
        Geolicrafts
      </span>
    </Link>
  )
}
