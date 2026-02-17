import { RANK_PALETTE } from '@/utils/constants'
import ChartPanel from './ChartPanel'

interface RankItem {
  label:  string
  value:  number
  persen?: number
}

interface Props {
  title:    string
  subtitle?: string
  data:     RankItem[]
  suffix?:  string
  maxItems?: number
}

const MOCK_KAB: RankItem[] = [
  { label: 'Surabaya',  value: 95.2, persen: 22.1 },
  { label: 'Gresik',    value: 85.4, persen: 19.8 },
  { label: 'Sidoarjo',  value: 74.1, persen: 17.2 },
  { label: 'Mojokerto', value: 58.6, persen: 13.6 },
  { label: 'Pasuruan',  value: 47.3, persen: 11.0 },
  { label: 'Malang',    value: 38.9, persen:  9.0 },
  { label: 'Banyuwangi',value: 29.2, persen:  6.8 },
  { label: 'Jember',    value: 18.7, persen:  4.3 },
]

export function RankingKabKota({ data = MOCK_KAB, suffix = 'T' }: Partial<Props>) {
  return (
    <RankingBar title="Peringkat Kab/Kota (Top 8)"
      subtitle="Total PMA + PMDN"
      data={data} suffix={suffix} />
  )
}

const MOCK_NEGARA: RankItem[] = [
  { label: 'Singapura',       value: 18.5, persen: 28.4 },
  { label: 'Jepang',          value: 14.2, persen: 21.8 },
  { label: 'Amerika Serikat', value: 10.1, persen: 15.5 },
  { label: 'Korea Selatan',   value:  7.8, persen: 12.0 },
  { label: 'Belanda',         value:  5.6, persen:  8.6 },
  { label: 'Hongkong',        value:  4.1, persen:  6.3 },
]

export function RankingNegara({ data = MOCK_NEGARA, suffix = 'T' }: Partial<Props>) {
  return (
    <RankingBar title="Top Negara Asal PMA"
      subtitle="Nilai realisasi PMA"
      data={data} suffix={suffix} />
  )
}

// ── Core ranking bar ─────────────────────────────────────────────────
function RankingBar({ title, subtitle, data, suffix = 'T', maxItems = 8 }: Props) {
  const items  = data.slice(0, maxItems)
  const maxVal = items[0]?.value ?? 1

  return (
    <ChartPanel title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-2.5 pt-1">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            {/* Rank number */}
            <div className="shrink-0 text-center font-bold text-xs w-5"
              style={{ color: i < 3 ? '#f59e0b' : '#94a3b8' }}>
              {i + 1}
            </div>

            {/* Label */}
            <div className="shrink-0 text-xs font-semibold text-slate-700 truncate"
              style={{ width: 100 }}>
              {item.label}
            </div>

            {/* Progress bar */}
            <div className="flex-1 rounded-full overflow-hidden"
              style={{ height: 8, background: '#f1f5f9' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(item.value / maxVal) * 100}%`,
                  background: i === 0
                    ? '#f59e0b'
                    : i === 1
                    ? RANK_PALETTE[1]
                    : RANK_PALETTE[2] ,
                }} />
            </div>

            {/* Value */}
            <div className="shrink-0 text-xs font-bold text-slate-800 text-right"
              style={{ width: 48 }}>
              {item.value.toFixed(1)}{suffix}
            </div>

            {/* Percent */}
            {item.persen !== undefined && (
              <div className="shrink-0 text-[10px] font-semibold text-right"
                style={{ width: 36, color: '#94a3b8' }}>
                {item.persen.toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </ChartPanel>
  )
}
