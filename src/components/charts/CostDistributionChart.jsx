import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { formatNumber } from '../../lib/formatters'
import { useChartSize } from './useChartSize'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

export default function CostDistributionChart({ financials }) {
  const [chartRef, chartSize] = useChartSize()
  const data = useMemo(() => {
    if (!financials) return []

    const {
      fixedCosts,
      monthlyVariableCosts,
      scrapCost,
      monthlyPackagingCosts,
    } = financials

    // Base variable costs without scrap
    const baseVariable = monthlyVariableCosts - scrapCost

    return [
      { name: 'Fixed Costs', value: fixedCosts },
      { name: 'Variable (Base)', value: baseVariable },
      { name: 'Packaging', value: monthlyPackagingCosts },
      { name: 'Scrap Waste', value: scrapCost },
    ].filter(item => item.value > 0)
  }, [financials])

  if (!financials) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Cost Distribution</h3>
      <p className="text-xs text-slate-500 mb-6">Breakdown of total monthly costs</p>
      
      <div ref={chartRef} className="flex-1 min-h-0 relative w-full">
          <PieChart width={chartSize.width} height={chartSize.height}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ fontSize: '0.875rem', color: '#fff' }}
              formatter={(value) => [`${formatNumber(value)} lei`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
      </div>
    </div>
  )
}
