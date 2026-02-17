import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, RefreshCw, X } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'
import { useFilterOptions } from '@/hooks/useDashboard'
import { WILAYAH_MODES } from '@/utils/constants'

interface SidebarProps { isOpen: boolean }

// ── Sub-components ──────────────────────────────────────────────────
function SectionWrap({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </span>
        {open ? <ChevronDown size={13} color="#94a3b8" /> : <ChevronRight size={13} color="#94a3b8" />}
      </button>
      {open && <div className="px-1 pb-2">{children}</div>}
    </div>
  )
}

function RadioRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label onClick={onChange}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
      style={{ background: checked ? 'rgba(29,78,216,0.08)' : 'transparent' }}>
      <div className="flex items-center justify-center rounded-full shrink-0 transition-all"
        style={{ width: 16, height: 16, border: `2px solid ${checked ? '#1d4ed8' : '#e2e8f0'}` }}>
        {checked && <div className="rounded-full" style={{ width: 7, height: 7, background: '#1d4ed8' }} />}
      </div>
      <span className="text-xs font-medium" style={{ color: checked ? '#0f172a' : '#475569', fontWeight: checked ? 600 : 400 }}>
        {label}
      </span>
    </label>
  )
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label onClick={onChange}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
      style={{ background: checked ? 'rgba(29,78,216,0.07)' : 'transparent' }}>
      <div className="flex items-center justify-center rounded shrink-0 transition-all"
        style={{ width: 16, height: 16, border: `2px solid ${checked ? '#1d4ed8' : '#e2e8f0'}`, background: checked ? '#1d4ed8' : 'transparent' }}>
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span className="text-xs truncate" style={{ color: checked ? '#0f172a' : '#475569', fontWeight: checked ? 600 : 400 }}>
        {label}
      </span>
    </label>
  )
}

function SelectAllRow({ allSelected, onAll, onReset }: {
  allSelected: boolean; onAll: () => void; onReset: () => void
}) {
  return (
    <div className="flex justify-between items-center px-2 py-1">
      <button onClick={onAll} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        Pilih Semua
      </button>
      <button onClick={onReset} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        Reset
      </button>
    </div>
  )
}

// ── Main Sidebar ─────────────────────────────────────────────────────
export default function Sidebar({ isOpen }: SidebarProps) {
  const {
    filter,
    setStatus, setTahun, setSektor,
    setWilayah, setPerpres, setBarakorwil,
    resetAll,
  } = useFilterStore()

  const { data: opts } = useFilterOptions()

  const years    = opts?.tahun    ?? [2020, 2021, 2022, 2023, 2024]
  const sektors  = opts?.sektor   ?? []
  const perpreses = opts?.perpres ?? []
  const bakorwils = opts?.bakorwil ?? []

  const [searchSektor, setSearchSektor] = useState('')
  const filteredSektors = sektors.filter(s =>
    s.toLowerCase().includes(searchSektor.toLowerCase())
  )

  const toggle = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  // badge: berapa filter non-default aktif
  const activeCount =
    (filter.status?.length !== 2 ? 1 : 0) +
    (filter.tahun && filter.tahun.length > 0 && filter.tahun.length < years.length ? 1 : 0) +
    (filter.sektor && filter.sektor.length > 0 && filter.sektor.length < sektors.length ? 1 : 0)

  return (
    <aside style={{
      width: isOpen ? 256 : 0,
      flexShrink: 0,
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ width: 256, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Header sidebar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid #e2e8f0' }}>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Filter Data
          </span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ width: 18, height: 18, background: '#1d4ed8' }}>
              {activeCount}
            </span>
          )}
        </div>

        {/* Scrollable filter area */}
        <div className="flex-1 overflow-y-auto py-2 px-2">

          {/* Status */}
          <SectionWrap title="Status Investasi">
            <RadioRow label="Semua (PMA + PMDN)"
              checked={(filter.status?.length ?? 0) === 2}
              onChange={() => setStatus(['PMA', 'PMDN'])} />
            <RadioRow label="PMA saja"
              checked={filter.status?.length === 1 && filter.status[0] === 'PMA'}
              onChange={() => setStatus(['PMA'])} />
            <RadioRow label="PMDN saja"
              checked={filter.status?.length === 1 && filter.status[0] === 'PMDN'}
              onChange={() => setStatus(['PMDN'])} />
          </SectionWrap>

          <div style={{ height: 1, background: '#f1f5f9', margin: '4px 8px' }} />

          {/* Wilayah mode */}
          <SectionWrap title="Mode Wilayah">
            {WILAYAH_MODES.map(w => (
              <RadioRow key={w.value} label={w.label}
                checked={filter.wilayah === w.value}
                onChange={() => setWilayah(w.value)} />
            ))}
          </SectionWrap>

          {/* Perpres 80 — hanya tampil kalau mode Perpres80 */}
          {filter.wilayah === 'Perpres80' && perpreses.length > 0 && (
            <>
              <div style={{ height: 1, background: '#f1f5f9', margin: '4px 8px' }} />
              <SectionWrap title="Wilayah Perpres 80" defaultOpen={false}>
                <SelectAllRow
                  allSelected={(filter.perpres?.length ?? 0) === perpreses.length}
                  onAll={() => setPerpres(perpreses)}
                  onReset={() => setPerpres([])} />
                {perpreses.map(p => (
                  <CheckRow key={p} label={p}
                    checked={filter.perpres?.includes(p) ?? true}
                    onChange={() => setPerpres(toggle(filter.perpres ?? perpreses, p))} />
                ))}
              </SectionWrap>
            </>
          )}

          {/* Bakorwil */}
          {filter.wilayah === 'Bakorwil' && bakorwils.length > 0 && (
            <>
              <div style={{ height: 1, background: '#f1f5f9', margin: '4px 8px' }} />
              <SectionWrap title="Bakorwil" defaultOpen={false}>
                <SelectAllRow
                  allSelected={(filter.bakorwil?.length ?? 0) === bakorwils.length}
                  onAll={() => setBarakorwil(bakorwils)}
                  onReset={() => setBarakorwil([])} />
                {bakorwils.map(b => (
                  <CheckRow key={b} label={b}
                    checked={filter.bakorwil?.includes(b) ?? true}
                    onChange={() => setBarakorwil(toggle(filter.bakorwil ?? bakorwils, b))} />
                ))}
              </SectionWrap>
            </>
          )}

          <div style={{ height: 1, background: '#f1f5f9', margin: '4px 8px' }} />

          {/* Tahun */}
          <SectionWrap title="Tahun">
            <SelectAllRow
              allSelected={(filter.tahun?.length ?? 0) === years.length || (filter.tahun?.length ?? 0) === 0}
              onAll={() => setTahun(years)}
              onReset={() => setTahun(years)} />
            <div className="flex flex-wrap gap-1.5 px-2 pb-1">
              {years.map(y => {
                const sel = filter.tahun?.length === 0 || (filter.tahun?.includes(y) ?? true)
                return (
                  <button key={y} onClick={() => setTahun(toggle(filter.tahun ?? years, y))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                    style={{
                      background: sel ? '#1d4ed8' : '#f1f5f9',
                      color: sel ? 'white' : '#64748b',
                      border: 'none', cursor: 'pointer',
                    }}>
                    {y}
                  </button>
                )
              })}
            </div>
          </SectionWrap>

          <div style={{ height: 1, background: '#f1f5f9', margin: '4px 8px' }} />

          {/* Sektor */}
          <SectionWrap title={`Sektor (${filter.sektor?.length === 0 ? sektors.length : filter.sektor?.length ?? sektors.length}/${sektors.length})`}>
            {/* Search */}
            <div className="relative mx-1 mb-2">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchSektor} onChange={e => setSearchSektor(e.target.value)}
                placeholder="Cari sektor…"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none"
                style={{ border: '1px solid #e2e8f0', background: '#f8faff', fontFamily: 'inherit' }} />
              {searchSektor && (
                <button onClick={() => setSearchSektor('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <X size={11} color="#94a3b8" />
                </button>
              )}
            </div>
            <SelectAllRow
              allSelected={(filter.sektor?.length ?? 0) === 0 || filter.sektor?.length === sektors.length}
              onAll={() => setSektor([])}
              onReset={() => setSektor([])} />
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {filteredSektors.map(s => (
                <CheckRow key={s} label={s}
                  checked={filter.sektor?.length === 0 || (filter.sektor?.includes(s) ?? true)}
                  onChange={() => {
                    const base = filter.sektor?.length === 0 ? sektors : (filter.sektor ?? sektors)
                    setSektor(toggle(base, s))
                  }} />
              ))}
            </div>
          </SectionWrap>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-3 py-3 flex gap-2"
          style={{ borderTop: '1px solid #e2e8f0' }}>
          <button onClick={() => resetAll({ tahun: years, sektor: [] })}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white transition-colors"
            style={{ background: '#0f2a5e', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={11} /> Terapkan
          </button>
          <button onClick={() => resetAll({ tahun: years, sektor: [] })}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ background: '#f8faff', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b' }}>
            Reset
          </button>
        </div>
      </div>
    </aside>
  )
}
