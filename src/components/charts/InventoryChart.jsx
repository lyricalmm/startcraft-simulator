import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { useChartSize } from './useChartSize'

export default function InventoryChart({ inventory }) {
  const [chartRef, chartSize] = useChartSize()
  const data = useMemo(() => {
    if (!inventory || !inventory.sawtoothData) return []
    return inventory.sawtoothData
  }, [inventory])

  if (!inventory || !data.length) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Inventory Levels</h3>
      <p className="text-xs text-slate-500 mb-6">Stock depletion and reorder cycles</p>
      
      <div ref={chartRef} className="flex-1 min-h-0 w-full">
          <LineChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `D${val}`}
              tickMargin={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${val} kg`}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ fontSize: '0.875rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}
              formatter={(value, name) => [`${Math.round(value)} kg`, name === 'stock' ? 'Stock Level' : name]}
              labelFormatter={(label) => `Day ${label}`}
            />
            
            {/* Reorder Point Line */}
            {data[0] && (
              <ReferenceLine 
                y={data[0].reorderPoint} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                label={{ position: 'top', value: 'Reorder Point', fill: '#f59e0b', fontSize: 10 }}
              />
            )}
            
            {/* Safety Stock Line */}
            {data[0] && (
              <ReferenceLine 
                y={data[0].safetyStock} 
                stroke="#ef4444" 
                strokeDasharray="3 3"
                label={{ position: 'insideBottomLeft', value: 'Safety Stock', fill: '#ef4444', fontSize: 10 }}
              />
            )}

            <Line
              type="linear"
              dataKey="stock"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={(props) => {
                const { payload, cx, cy } = props
                if (payload.event === 'reorder') {
                  return <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="none" key={`dot-${cx}`} />
                }
                if (payload.event === 'delivery') {
                  return <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="none" key={`dot-${cx}`} />
                }
                return null
              }}
              isAnimationActive={false} // Disable animation to prevent sawtooth drawing glitches
            />
          </LineChart>
      </div>
    </div>
  )
}
