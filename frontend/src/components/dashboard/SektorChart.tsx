import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ChartPanel from './ChartPanel'
import ChartTooltip from './ChartTooltip'
import { CHART_PALETTE } from '@/utils/constants'

interface SektorItem { sektor: string; PMA: number; PMDN: number }

interface Props { data?: SektorItem[]; currency: 'RP' | 'USD' }

const MOCK: SektorItem[] = [
  { sektor: 'Industri Pengolahan',         PMA: 38.2, PMDN: 51.4 },
  { sektor: 'Transportasi & Pergudangan',  PMA: 28.5, PMDN: 38.1 },
  { sektor: 'Perumahan',                   PMA: 22.1, PMDN: 30.6 },
  { sektor: 'Listrik, Gas & Air',          PMA: 18.4, PMDN: 24.2 },
  { sektor: 'Pertanian',                   PMA: 14.0, PMDN: 19.8 },
  { sektor: 'Perdagangan & Reparasi',      PMA: 10.3, PMDN: 15.5 },
  { sektor: 'Hotel & Restoran',            PMA:  7.8, PMDN: 11.2 },
]

const truncate = (s: string, n = 26) => s.length > n ? s.slice(0, n - 1) + '…' : s

export default function SektorChart({ data = MOCK, currency }: Props) {
  const suffix   = currency === 'RP' ? ' T' : ' M'
  const subtitle = currency === 'RP' ? 'Nilai dalam Triliun Rupiah' : 'Nilai dalam Miliar US$'

  const chartData = data.map(d => ({ ...d, sektor: truncate(d.sektor) }))

  return (
    <ChartPanel
      title="Realisasi per Bidang Usaha / Sektor"
      subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical" data={chartData}
          margin={{ top: 0, right: 40, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}T`}
          />
          <YAxis
            dataKey="sektor" type="category" width={150}
            tick={{ fontSize: 10, fill: '#475569' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            content={<ChartTooltip suffix={suffix} />}
            cursor={{ fill: 'rgba(226,232,240,0.5)' }}
          />
          <Legend
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', paddingTop: 8 }}
          />
          <Bar dataKey="PMA"  fill={CHART_PALETTE.PMA}  radius={[0,3,3,0]} maxBarSize={14} />
          <Bar dataKey="PMDN" fill={CHART_PALETTE.PMDN} radius={[0,3,3,0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
