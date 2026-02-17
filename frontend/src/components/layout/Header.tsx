import { Menu, Upload, BarChart2, MapPin, Layers } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useFilterStore } from '@/store/filterStore'

interface HeaderProps {
  onToggleSidebar: () => void
}

const NAV_ITEMS = [
  { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { to: '/peta',      icon: MapPin,    label: 'Peta Investasi' },
  { to: '/data',      icon: Layers,    label: 'Data Lengkap' },
]

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { filter, setCurrency } = useFilterStore()

  return (
    <header className="relative flex items-center gap-4 px-5 shrink-0"
      style={{ background: '#0f2a5e', height: 60, boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>

      {/* Gradient accent line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg,#f59e0b 0%,#06b6d4 50%,#3b82f6 100%)' }} />

      {/* Toggle sidebar */}
      <button onClick={onToggleSidebar}
        className="flex items-center justify-center rounded-lg shrink-0 transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 34, height: 34, cursor: 'pointer' }}>
        <Menu size={16} />
      </button>

      {/* Logo + title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center rounded-lg font-black text-sm"
          style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#f59e0b,#fcd34d)', color: '#0f2a5e', fontFamily: "'Sora',sans-serif" }}>
          DM
        </div>
        <div>
          <div className="font-bold text-white text-[13px] leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
            DPMPTSP Jawa Timur
          </div>
          <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Dashboard Realisasi Penanaman Modal
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-1 ml-6">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border-b-2 ${
                isActive ? 'border-yellow-400' : 'border-transparent'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
            })}>
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">
        {/* Currency toggle */}
        <div className="flex rounded-lg p-0.5 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          {(['RP', 'USD'] as const).map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className="px-3 py-1 rounded-md text-[11px] font-bold transition-all"
              style={{
                background: filter.currency === c ? 'white' : 'transparent',
                color: filter.currency === c ? '#0f2a5e' : 'rgba(255,255,255,0.65)',
                border: 'none', cursor: 'pointer',
              }}>
              {c === 'RP' ? 'IDR' : 'USD'}
            </button>
          ))}
        </div>

        {/* Upload */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold"
          style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#fcd34d', cursor: 'pointer' }}>
          <Upload size={12} />
          Upload Data
        </button>

        {/* Avatar */}
        <div className="flex items-center justify-center rounded-full text-white text-xs font-bold cursor-pointer shrink-0"
          style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
          JT
        </div>
      </div>
    </header>
  )
}
