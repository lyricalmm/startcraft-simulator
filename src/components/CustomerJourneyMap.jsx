import { motion } from 'framer-motion'
import {
  Users,
  MessageSquare,
  ShoppingCart,
  Package,
  Wrench,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { summarizeCustomerJourney } from '../lib/customerJourneyMath'
import { formatCurrency, formatNumber, formatPercent } from '../lib/formatters'

const STAGE_ICONS = {
  awareness: Users,
  interest: MessageSquare,
  evaluation: ShoppingCart,
  decision: Package,
  use: Wrench,
  feedback: RefreshCw,
}

const BAR_COLORS = [
  'from-cyan-500 to-cyan-400',
  'from-blue-500 to-blue-400',
  'from-violet-500 to-violet-400',
  'from-purple-500 to-purple-400',
  'from-pink-500 to-pink-400',
  'from-rose-500 to-rose-400',
]

function formatStageValue(value, unit) {
  if (unit === 'parts') return `${formatNumber(value)} parts`
  if (unit === 'leads') return `${formatNumber(value)} leads`
  if (unit === 'quotes') return `${formatNumber(value)} quotes`
  if (unit === 'orders' || unit === 'new orders' || unit === 'repeat/referral orders') {
    return `${formatNumber(value, 1)} orders`
  }

  return formatNumber(value, 1)
}

export default function CustomerJourneyMap({ data, financials }) {
  if (!data) return null

  const { stages, summary } = summarizeCustomerJourney(data, financials)
  const maxVal = Math.max(...stages.map((stage) => stage.value), 1)

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-0.5">
        Customer Journey
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Numeric funnel - how customer behavior becomes orders, parts and revenue
      </p>

      <div className="divide-y divide-slate-800">
        {stages.map((stage, i) => {
          const Icon = STAGE_ICONS[stage.id] ?? Users
          const barPct = (stage.value / maxVal) * 100

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="py-4 first:pt-0 last:pb-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[12rem_1fr_10rem] gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Icon size={14} className="text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {stage.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {stage.indicatorLabel}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${BAR_COLORS[i]}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-w-0">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Customer action
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stage.customerAction}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Pain point
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stage.painPoint}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Business impact
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stage.businessImpact}
                    </p>
                  </div>
                </div>

                <div className="lg:text-right">
                  <p className="text-lg font-bold text-slate-100 tabular-nums">
                    {formatStageValue(stage.value, stage.unit)}
                  </p>
                  <div className="flex lg:justify-end items-center gap-1.5 text-xs text-slate-500 mt-1">
                    {stage.conversionToNext !== null ? (
                      <>
                        <ArrowRight size={12} />
                        <span>{formatPercent(stage.conversionToNext, 0)} to next</span>
                      </>
                    ) : (
                      <span>Final loop</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-tight">
                    {formatCurrency(stage.impactValue, 'RON')} {stage.impactLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 border-t border-slate-800 pt-5">
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Leads / month</p>
          <p className="text-xl font-bold text-cyan-400">
            {formatNumber(summary.leads)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Quote requests</p>
          <p className="text-xl font-bold text-blue-400">
            {formatNumber(summary.quoteRequests)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Orders / month</p>
          <p className="text-xl font-bold text-violet-400">
            {formatNumber(summary.totalOrders, 1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Units sold / month</p>
          <p className="text-xl font-bold text-emerald-400">
            {formatNumber(summary.unitsSold)}
          </p>
        </div>
        <div className="text-center col-span-2 lg:col-span-1">
          <p className="text-xs text-slate-500 mb-1">Journey revenue</p>
          <p className="text-xl font-bold text-amber-300">
            {formatCurrency(summary.estimatedMonthlyRevenue, 'RON')}
          </p>
        </div>
      </div>
    </div>
  )
}
