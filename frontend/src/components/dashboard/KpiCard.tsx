import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label:       string
  value:       string        // sudah diformat, e.g. "Rp 103,0 T"
  growth:      number        // persen, bisa negatif
  growthLabel?: string       // e.g. "vs tahun lalu"
  icon:        LucideIcon
  accentColor: string
  delay?:      number        // animasi stagger (ms)
}

export default function KpiCard({
  label, value, growth, growthLabel = 'vs tahun lalu',
  icon: Icon, accentColor, delay = 0,
}: KpiCardProps) {
  const isUp = growth >= 0

  return (
    <div
      className="animate-fade-up relative flex-1 min-w-0 rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15,42,94,0.06), 0 4px 16px rgba(15,42,94,0.04)',
        padding: '20px 20px 16px',
        animationDelay: `${delay}ms`,
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 4px 24px rgba(15,42,94,0.14)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 1px 3px rgba(15,42,94,0.06), 0 4px 16px rgba(15,42,94,0.04)'
        el.style.transform = 'translateY(0)'
      }}>

      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 rounded-t-2xl"
        style={{ height: 3, background: accentColor }} />

      {/* Icon bubble */}
      <div className="absolute top-4 right-4 flex items-center justify-center rounded-xl"
        style={{ width: 38, height: 38, background: `${accentColor}18` }}>
        <Icon size={18} color={accentColor} />
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
        style={{ color: '#94a3b8', fontFamily: "'DM Sans',sans-serif" }}>
        {label}
      </p>

      {/* Value */}
      <p className="font-extrabold leading-none mb-3 truncate pr-12"
        style={{ fontSize: 'clamp(16px,1.6vw,22px)', color: '#0f2a5e', fontFamily: "'Sora',sans-serif", letterSpacing: '-0.02em' }}>
        {value}
      </p>

      {/* Growth badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={{ background: isUp ? '#dcfce7' : '#fee2e2', color: isUp ? '#059669' : '#dc2626' }}>
          {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {isUp ? '+' : ''}{growth.toFixed(1)}%
        </span>
        <span className="text-[11px]" style={{ color: '#94a3b8' }}>{growthLabel}</span>
      </div>
    </div>
  )
}
