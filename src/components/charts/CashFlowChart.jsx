import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { formatNumber } from '../../lib/formatters'
import { useChartSize } from './useChartSize'

export default function CashFlowChart({ financials }) {
  const [chartRef, chartSize] = useChartSize()
  const data = useMemo(() => {
    if (!financials) return []

    const { initialInvestment, monthlyProfit, paybackMonths } = financials
    const maxMonths = paybackMonths !== null
      ? Math.min(60, Math.max(24, Math.ceil(paybackMonths * 1.5)))
      : 36

    const points = []
    let currentCash = -initialInvestment

    for (let m = 0; m <= maxMonths; m++) {
      points.push({
        month: m,
        Cash: currentCash,
      })
      currentCash += monthlyProfit
    }

    return points
  }, [financials])

  if (!financials) return null

  // Function to create gradient conditionally based on value
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map(i => i.Cash));
    const dataMin = Math.min(...data.map(i => i.Cash));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Cash Flow / Payback</h3>
      <p className="text-xs text-slate-500 mb-6">Cumulative cash flow over time</p>
      
      <div ref={chartRef} className="flex-1 min-h-0 w-full">
          <AreaChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `Mo ${val}`}
              tickMargin={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              itemStyle={{ fontSize: '0.875rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}
              formatter={(value) => [`${formatNumber(value)} lei`, 'Cash Balance']}
              labelFormatter={(label) => `Month ${label}`}
            />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#10b981" stopOpacity={0.8} />
                <stop offset={off} stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="Cash"
              stroke="#000"
              strokeWidth={0}
              fill="url(#splitColor)"
              activeDot={{ r: 5, fill: '#fff', stroke: '#334155', strokeWidth: 2 }}
            />
          </AreaChart>
      </div>
    </div>
  )
}
