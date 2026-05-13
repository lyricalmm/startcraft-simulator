import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts'
import { formatNumber } from '../../lib/formatters'
import { useChartSize } from './useChartSize'

const COLORS = {
  pessimistic: '#ef4444', // red
  realistic: '#3b82f6',   // blue
  optimistic: '#10b981',  // green
}

export default function ProfitScenariosChart({ comparison }) {
  const [chartRef, chartSize] = useChartSize()
  const data = useMemo(() => {
    if (!comparison) return []
    return comparison.map((c) => ({
      name: c.scenario.name,
      id: c.scenario.id,
      Profit: c.metrics.monthlyProfit,
    }))
  }, [comparison])

  if (!comparison) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Profit Scenarios</h3>
      <p className="text-xs text-slate-500 mb-6">Monthly profit across different conditions</p>
      
      <div ref={chartRef} className="flex-1 min-h-0 w-full">
          <BarChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${val / 1000}k`}
              tickMargin={10}
            />
            <Tooltip
              cursor={{ fill: '#1e293b' }}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ fontSize: '0.875rem' }}
              formatter={(value) => [`${formatNumber(value)} lei`, 'Profit']}
            />
            <ReferenceLine y={0} stroke="#475569" strokeWidth={2} />
            <Bar dataKey="Profit" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.id] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
      </div>
    </div>
  )
}
