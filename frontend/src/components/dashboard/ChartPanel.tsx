import type { ReactNode } from 'react'

interface ChartPanelProps {
  title:     string
  subtitle?: string
  children:  ReactNode
  action?:   ReactNode
  className?: string
  style?:    React.CSSProperties
}

export default function ChartPanel({
  title, subtitle, children, action, className = '', style,
}: ChartPanelProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15,42,94,0.05)',
        ...style,
      }}>
      {/* Panel header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-0">
        <div>
          <p className="text-[13px] font-bold text-slate-800 leading-tight"
            style={{ fontFamily: "'Sora',sans-serif" }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="ml-3 shrink-0">{action}</div>}
      </div>

      {/* Chart content */}
      <div className="px-4 pb-4 pt-3">
        {children}
      </div>
    </div>
  )
}
