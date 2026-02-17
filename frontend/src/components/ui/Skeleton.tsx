interface SkeletonProps {
  className?: string
  style?:     React.CSSProperties
}

// Atom: satu blok skeleton
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg ${className}`}
      style={{ background: '#e2e8f0', ...style }} />
  )
}

// KPI card skeleton
export function KpiCardSkeleton() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl p-5"
      style={{ background: 'white', border: '1px solid #e2e8f0' }}>
      <Skeleton style={{ height: 10, width: '40%', marginBottom: 10 }} />
      <Skeleton style={{ height: 22, width: '70%', marginBottom: 12 }} />
      <Skeleton style={{ height: 20, width: '50%', borderRadius: 9999 }} />
    </div>
  )
}

// Chart panel skeleton
export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
      <Skeleton style={{ height: 14, width: '45%', marginBottom: 6 }} />
      <Skeleton style={{ height: 10, width: '30%', marginBottom: 16 }} />
      <Skeleton style={{ height, borderRadius: 10 }} />
    </div>
  )
}
