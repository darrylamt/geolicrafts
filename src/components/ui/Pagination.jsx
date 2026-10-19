import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPages(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, 'gap-r', total]
  if (page >= total - 3) return [1, 'gap-l', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'gap-l', page - 1, page, page + 1, 'gap-r', total]
}

const EN = { showing: 'Showing', of: 'of', previous: 'Previous page', next: 'Next page' }

export default function Pagination({ page, totalPages, onChange, totalItems, pageSize, className = '', labels = EN }) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-between gap-4 ${className}`}>
      {totalItems != null ? (
        <p className="text-sm text-stone-500 tabular-nums">
          <span className="hidden sm:inline">{labels.showing} </span>
          <span className="font-medium text-stone-900">{from}–{to}</span> {labels.of} {totalItems}
        </p>
      ) : <span />}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="icon-btn ring-1 ring-inset ring-stone-200 bg-white"
          aria-label={labels.previous}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="sm:hidden px-3 text-sm text-stone-600 tabular-nums">
          {page} / {totalPages}
        </span>

        <div className="hidden sm:flex items-center gap-1">
          {getPages(page, totalPages).map(p =>
            typeof p === 'string' ? (
              <span key={p} className="w-9 text-center text-stone-400 select-none">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`h-9 min-w-[2.25rem] px-3 rounded-full text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-500 ${
                  p === page
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="icon-btn ring-1 ring-inset ring-stone-200 bg-white"
          aria-label={labels.next}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}
