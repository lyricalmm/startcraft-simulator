import { motion } from 'framer-motion'
import { TrendingDown, Minus, TrendingUp } from 'lucide-react'

const SCENARIOS = [
  {
    id: 'pessimistic',
    label: 'Pessimistic',
    emoji: '📉',
    Icon: TrendingDown,
    active: 'border-red-500 bg-red-500/10 shadow-red-500/20',
    activeText: 'text-red-400',
    activeBadge: 'bg-red-500/20 text-red-300 border border-red-500/30',
    activeValue: 'text-red-300',
    inactive: 'border-slate-700 bg-slate-900 hover:border-red-500/40 hover:bg-red-500/5',
    description: 'Lower demand, higher costs.',
  },
  {
    id: 'realistic',
    label: 'Realistic',
    emoji: '🎯',
    Icon: Minus,
    active: 'border-cyan-500 bg-cyan-500/10 shadow-cyan-500/20',
    activeText: 'text-cyan-400',
    activeBadge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    activeValue: 'text-cyan-300',
    inactive: 'border-slate-700 bg-slate-900 hover:border-cyan-500/40 hover:bg-cyan-500/5',
    description: 'Base educational assumptions.',
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    emoji: '🚀',
    Icon: TrendingUp,
    active: 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20',
    activeText: 'text-emerald-400',
    activeBadge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    activeValue: 'text-emerald-300',
    inactive: 'border-slate-700 bg-slate-900 hover:border-emerald-500/40 hover:bg-emerald-500/5',
    description: 'Stronger demand, better efficiency.',
  },
]

function fmt(value, type) {
  if (value === null || value === undefined) return '—'
  if (type === 'lei') return `${Math.round(value).toLocaleString('ro-RO')} lei`
  if (type === 'pct') return `${(value * 100).toFixed(0)}%`
  return String(Math.round(value))
}

function profitColor(v) {
  if (v == null) return 'text-slate-500'
  return v > 0 ? 'text-emerald-400' : 'text-red-400'
}

function capColor(v) {
  if (v == null) return 'text-slate-500'
  if (v > 1) return 'text-red-400'
  if (v > 0.85) return 'text-amber-400'
  return 'text-emerald-400'
}

export default function ScenarioSelector({ scenario, onSelect, comparison }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
        Business Scenario
      </p>
      <div className="grid grid-cols-3 gap-3">
        {SCENARIOS.map((s) => {
          const isActive = scenario === s.id
          const comp = comparison?.find((c) => c.scenario.id === s.id)
          const m = comp?.metrics

          return (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(s.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 shadow-lg ${
                isActive ? `${s.active} shadow-lg` : s.inactive
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.emoji}</span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${s.activeBadge}`}
                  >
                    ACTIVE
                  </motion.span>
                )}
              </div>

              <p className={`font-black text-sm ${isActive ? s.activeText : 'text-slate-300'}`}>
                {s.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-3 leading-tight font-semibold">
                {s.description}
              </p>

              {m && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Revenue</span>
                    <span className={`font-bold ${isActive ? s.activeValue : 'text-slate-400'}`}>
                      {fmt(m.monthlyRevenue, 'lei')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Profit</span>
                    <span className={`font-bold ${profitColor(m.monthlyProfit)}`}>
                      {fmt(m.monthlyProfit, 'lei')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">Capacity</span>
                    <span className={`font-bold ${capColor(m.capacityUtilization)}`}>
                      {fmt(m.capacityUtilization, 'pct')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">ROI</span>
                    <span className={`font-bold ${isActive ? s.activeValue : 'text-slate-400'}`}>
                      {fmt(m.roi, 'pct')}
                    </span>
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
