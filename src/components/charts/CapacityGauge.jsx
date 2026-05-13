import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { useChartSize } from './useChartSize'

export default function CapacityGauge({ financials }) {
  const [chartRef, chartSize] = useChartSize()
  if (!financials) return null

  const utilization = financials.capacityUtilization * 100
  const clampedUtilization = Math.min(utilization, 100) // limit visual bar to 100%

  let color = '#10b981' // green
  if (utilization > 95) color = '#ef4444' // red
  else if (utilization > 80) color = '#f59e0b' // yellow

  const data = [
    { name: 'Capacity', value: clampedUtilization, fill: color }
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col items-center relative">
      <div className="w-full text-left">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">Capacity Utilization</h3>
        <p className="text-xs text-slate-500 mb-2">Machine hours used vs available</p>
      </div>

      <div ref={chartRef} className="flex-1 w-full min-h-0 relative">
          <RadialBarChart
            width={chartSize.width}
            height={chartSize.height}
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={15} 
            data={data}
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background={{ fill: '#334155' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-slate-200"
          >
            {Math.round(utilization)}%
          </motion.span>
          <span className="text-xs text-slate-500 mt-1">
            {utilization > 100 ? 'Over Capacity' : 'Utilized'}
          </span>
        </div>
      </div>
      
      <div className="w-full mt-2 text-xs text-slate-400 flex justify-between">
        <span>Required: {Math.round(financials.requiredMachineHours)} h</span>
        <span>Available: {Math.round(financials.availableMachineHours)} h</span>
      </div>
    </div>
  )
}
