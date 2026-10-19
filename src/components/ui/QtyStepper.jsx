import { Minus, Plus } from 'lucide-react'

export default function QtyStepper({ value, onChange, size = 'md', label = 'Quantity' }) {
  const h = size === 'sm' ? 'h-8' : 'h-11'
  const w = size === 'sm' ? 'w-8' : 'w-11'
  const set = v => onChange(Math.max(1, Math.min(100000, Number.isFinite(v) ? v : 1)))

  return (
    <div className={`inline-flex items-center rounded-full bg-white ring-1 ring-inset ring-stone-200 ${h}`}>
      <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} className={`grid place-items-center ${h} ${w} rounded-full text-stone-500 hover:text-stone-900 disabled:opacity-30`} aria-label="−">
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={value}
        onChange={e => set(parseInt(e.target.value, 10))}
        aria-label={label}
        className="w-10 text-center text-sm tabular-nums bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + 1)} className={`grid place-items-center ${h} ${w} rounded-full text-stone-500 hover:text-stone-900`} aria-label="+">
        <Plus size={14} />
      </button>
    </div>
  )
}
