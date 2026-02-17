interface TooltipProps {
  active?:  boolean
  payload?: { name: string; value: number; color: string }[]
  label?:   string
  suffix?:  string
}

export default function ChartTooltip({ active, payload, label, suffix = ' T' }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3.5 py-2.5"
      style={{ background: '#0f2a5e', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', minWidth: 140 }}>
      <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="rounded-sm shrink-0" style={{ width: 8, height: 8, background: p.color }} />
          <span className="text-[12px] font-semibold text-white">
            {p.name}:{' '}
            <span style={{ color: '#67e8f9' }}>
              {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{suffix}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}
