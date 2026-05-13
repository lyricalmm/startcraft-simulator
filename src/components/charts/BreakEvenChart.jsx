import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from 'recharts'
import { formatNumber } from '../../lib/formatters'
import { useChartSize } from './useChartSize'

export default function BreakEvenChart({ financials }) {
  const [chartRef, chartSize] = useChartSize()
  const data = useMemo(() => {
    if (!financials) return []

    const {
      fixedCosts,
      contributionMargin: { sellingPrice, variableCostPerUnit },
      breakEvenUnits,
      unitsSold,
    } = financials

    const rawMax = breakEvenUnits !== null
      ? Math.max(breakEvenUnits * 2, unitsSold * 1.5)
      : unitsSold * 2
    const maxUnits = Math.max(rawMax, 20)

    const step = Math.max(1, Math.floor(maxUnits / 5))
    const points = []

    for (let u = 0; u <= maxUnits + step; u += step) {
      points.push({
        units: u,
        Revenue: u * sellingPrice,
        Cost: fixedCosts + u * variableCostPerUnit,
      })
    }
    return points
  }, [financials])

  if (!financials) return null

  const { breakEvenUnits, contributionMargin } = financials
  const breakEvenRevenue = breakEvenUnits !== null
    ? breakEvenUnits * contributionMargin.sellingPrice
    : null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Break-Even Analysis</h3>
      <p className="text-xs text-slate-500 mb-6">Revenue vs Total Costs</p>
      
      <div ref={chartRef} className="flex-1 min-h-0 w-full">
          <LineChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="units"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${val} u`}
              tickMargin={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${val / 1000}k`}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ fontSize: '0.875rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}
              formatter={(value) => [`${formatNumber(value)} lei`, undefined]}
              labelFormatter={(label) => `${label} units`}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Cost"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            {breakEvenUnits !== null && (
              <ReferenceDot
                x={breakEvenUnits}
                y={breakEvenRevenue}
                r={5}
                fill="#eab308"
                stroke="none"
              />
            )}
          </LineChart>
      </div>
    </div>
  )
}
