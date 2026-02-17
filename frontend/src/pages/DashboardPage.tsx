import { TrendingUp, Globe, Building2, Users } from 'lucide-react'
import { Download } from 'lucide-react'
import KpiCard              from '@/components/dashboard/KpiCard'
import BarTahunChart        from '@/components/dashboard/BarTahunChart'
import PieStatusChart       from '@/components/dashboard/PieStatusChart'
import SektorChart          from '@/components/dashboard/SektorChart'
import MapJatim             from '@/components/dashboard/MapJatim'
import { RankingKabKota, RankingNegara } from '../components/dashboard/RangkingBar'
import { useFilterStore }   from '@/store/filterStore'

// ── Mock KPI (nanti dari useKpi hook) ───────────────────────────────
const MOCK_KPI = {
  total: 'Rp 103,0 T', totalGrowth: 12.4,
  pma:   'Rp 44,1 T',  pmaGrowth:   14.2,
  pmdn:  'Rp 58,9 T',  pmdnGrowth:  10.7,
  tki:   '287.432',    tkiGrowth:   -2.1,
}

export default function DashboardPage() {
  const { filter } = useFilterStore()

  return (
    <>
      {/* ── Page title bar ── */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h1 className="font-extrabold text-slate-800 leading-tight"
            style={{ fontSize: 17, fontFamily: "'Sora',sans-serif" }}>
            Realisasi Penanaman Modal
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
            Provinsi Jawa Timur · 2020–2024 · Triwulan III
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Download buttons */}
          {(['CSV', 'Excel'] as const).map(fmt => (
            <button key={fmt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
              style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>
              <Download size={12} />
              {fmt}
            </button>
          ))}

          {/* Last update badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]"
            style={{ background: '#f8faff', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
            <div className="rounded-full" style={{ width: 6, height: 6, background: '#059669' }} />
            Update: 30 Sep 2024
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="flex gap-3 flex-wrap">
        <KpiCard label="Total Investasi"  value={MOCK_KPI.total} growth={MOCK_KPI.totalGrowth}
          icon={TrendingUp}  accentColor="#1d4ed8" delay={0} />
        <KpiCard label="PMA (Asing)"      value={MOCK_KPI.pma}   growth={MOCK_KPI.pmaGrowth}
          icon={Globe}       accentColor="#06b6d4" delay={80} />
        <KpiCard label="PMDN (Domestik)"  value={MOCK_KPI.pmdn}  growth={MOCK_KPI.pmdnGrowth}
          icon={Building2}   accentColor="#f59e0b" delay={160} />
        <KpiCard label="Total TKI"        value={MOCK_KPI.tki}   growth={MOCK_KPI.tkiGrowth}
          growthLabel="tenaga kerja terserap"
          icon={Users}       accentColor="#0d9488" delay={240} />
      </div>

      {/* ── Row 2: Bar trend + Pie ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <BarTahunChart currency={filter.currency} data={[]} />
        <PieStatusChart pma={44.1} pmdn={58.9} currency={filter.currency} />
      </div>

      {/* ── Row 3: Sektor + Map ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <SektorChart currency={filter.currency} />
        <MapJatim />
      </div>

      {/* ── Row 4: Ranking Kab/Kota + Negara ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <RankingKabKota />
        {/* Ranking negara hanya tampil kalau filter PMA */}
        {filter.status?.includes('PMA') ? (
          <RankingNegara />
        ) : (
          <div className="rounded-2xl flex items-center justify-center text-center p-8"
            style={{ background: 'white', border: '1px solid #e2e8f0' }}>
            <div>
              <Globe size={32} color="#e2e8f0" strokeWidth={1} className="mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">Ranking Negara Asal PMA</p>
              <p className="text-xs text-slate-300 mt-1">
                Aktifkan filter "PMA" untuk melihat data
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="text-center py-3 text-[10px]"
        style={{ color: '#94a3b8', borderTop: '1px solid #e2e8f0' }}>
        DPMPTSP Provinsi Jawa Timur · Dashboard Realisasi Penanaman Modal 2020–2024 ·
        Data bersumber dari sistem BKPM
      </div>
    </>
  )
}
