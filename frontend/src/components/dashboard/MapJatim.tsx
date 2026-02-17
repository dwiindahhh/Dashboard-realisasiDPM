import { MapPin } from 'lucide-react'
import ChartPanel from './ChartPanel'

export default function MapJatim() {
  return (
    <ChartPanel
      title="Peta Realisasi Penanaman Modal"
      subtitle="Sebaran per Kab/Kota · Jawa Timur"
      action={
        <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
          style={{ background: '#f8faff', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>
          Perbesar ⤢
        </button>
      }>
      {/* Map placeholder — nanti ganti dengan Mapbox GL */}
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl"
        style={{
          height: 300,
          background: 'linear-gradient(135deg,#dbeafe,#cffafe)',
          border: '1px dashed #93c5fd',
        }}>
        <div className="flex items-center justify-center rounded-2xl"
          style={{ width: 56, height: 56, background: 'rgba(29,78,216,0.1)' }}>
          <MapPin size={28} color="#1d4ed8" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-bold text-slate-700">Peta Choropleth Jawa Timur</p>
          <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>
            38 Kabupaten/Kota · warna gradasi per nilai investasi
          </p>
        </div>
        {/* Color scale */}
        <div className="flex items-center gap-2.5 mt-1">
          <span className="text-[10px] text-slate-400">Rendah</span>
          <div className="rounded-full" style={{ width: 96, height: 8,
            background: 'linear-gradient(90deg,#e5e7eb,#1d4ed8)' }} />
          <span className="text-[10px] text-slate-400">Tinggi</span>
        </div>
        <p className="text-[10px] italic" style={{ color: '#94a3b8' }}>
          Mapbox GL JS — akan diintegrasikan di fase berikutnya
        </p>
      </div>
    </ChartPanel>
  )
}
