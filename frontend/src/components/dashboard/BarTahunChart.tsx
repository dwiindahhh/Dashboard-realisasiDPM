import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ChartPanel from '../dashboard/ChartPanel'
import ChartTooltip from '../dashboard/ChartTooltip'
import { CHART_PALETTE } from '@/utils/constants'

interface BarTahunItem { tahun: number; PMA: number; PMDN: number }

interface Props {
  data:     BarTahunItem[]
  currency: 'RP' | 'USD'
}

// Mock data saat belum ada API
const MOCK: BarTahunItem[] = [
  { tahun: 2020, PMA: 22.4, PMDN: 35.1 },
  { tahun: 2021, PMA: 25.8, PMDN: 38.7 },
  { tahun: 2022, PMA: 31.2, PMDN: 44.3 },
  { tahun: 2023, PMA: 38.6, PMDN: 51.2 },
  { tahun: 2024, PMA: 44.1, PMDN: 58.9 },
]

export default function BarTahunChart({ data = MOCK, currency }: Props) {
  const suffix = currency === 'RP' ? ' T' : ' M'
  const subtitle = currency === 'RP' ? 'Nilai dalam Triliun Rupiah' : 'Nilai dalam Miliar US$'

  return (
    <ChartPanel title="Tren Realisasi PMA & PMDN per Tahun" subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="tahun"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}T`}
          />
          <Tooltip
            content={<ChartTooltip suffix={suffix} />}
            cursor={{ fill: 'rgba(226,232,240,0.5)', radius: 6 }}
          />
          <Legend
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', paddingTop: 8 }}
          />
          <Bar dataKey="PMA"  fill={CHART_PALETTE.PMA}  radius={[4,4,0,0]} maxBarSize={36} />
          <Bar dataKey="PMDN" fill={CHART_PALETTE.PMDN} radius={[4,4,0,0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
