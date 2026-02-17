import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ChartPanel from './ChartPanel'
import { CHART_PALETTE } from '@/utils/constants'

interface Props {
  pma:      number
  pmdn:     number
  currency: 'RP' | 'USD'
}

const MOCK = { pma: 44.1, pmdn: 58.9 }

export default function PieStatusChart({ pma = MOCK.pma, pmdn = MOCK.pmdn, currency }: Props) {
  const suffix = currency === 'RP' ? ' T' : ' M'
  const data = [
    { name: 'PMA',  value: pma,  color: CHART_PALETTE.PMA },
    { name: 'PMDN', value: pmdn, color: CHART_PALETTE.PMDN },
  ]
  const total = pma + pmdn

  return (
    <ChartPanel title="Komposisi PMA vs PMDN" subtitle="Proporsi nilai investasi">
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={62} outerRadius={90}
              dataKey="value" paddingAngle={3}
              strokeWidth={0}>
              {data.map((e, i) => (
                <Cell key={i} fill={e.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)}${suffix}`, '']} />
            <Legend
              iconType="circle" iconSize={9}
              wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-60%)',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total
          </p>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#0f2a5e', fontFamily: "'Sora',sans-serif", lineHeight: 1.1 }}>
            {total.toFixed(1)}{suffix}
          </p>
        </div>
      </div>
    </ChartPanel>
  )
}
