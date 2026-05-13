import { motion } from 'framer-motion'
import { XCircle, AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'

const LEVEL = {
  critical: {
    Icon: XCircle,
    border: 'border-red-500/50',
    bg: 'bg-red-500/8',
    accent: 'bg-red-500',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    title: 'text-red-300',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
    label: 'Critical',
  },
  warning: {
    Icon: AlertTriangle,
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/8',
    accent: 'bg-amber-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    title: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    label: 'Warning',
  },
  insight: {
    Icon: Lightbulb,
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/8',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    label: 'Insight',
  },
  good: {
    Icon: CheckCircle2,
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/8',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    label: 'Good',
  },
}

const ORDER = ['critical', 'warning', 'insight', 'good']

export default function FeedbackPanel({ feedback }) {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 text-center">
        <Sparkles size={24} className="text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">
          Adjust inputs or select a scenario to see educational feedback.
        </p>
      </div>
    )
  }

  const sorted = [...feedback].sort(
    (a, b) => ORDER.indexOf(a.level) - ORDER.indexOf(b.level),
  )

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Sparkles size={14} className="text-violet-400" />
        </div>
        <h3 className="text-sm font-black text-slate-200">Smart Feedback</h3>
      </div>
      <p className="text-[11px] font-bold text-slate-500 mb-5 ml-9">
        Rule-based educational analysis — no AI API required
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((item, i) => {
          const cfg = LEVEL[item.level] ?? LEVEL.insight
          const { Icon } = cfg

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
              className={`rounded-2xl border-2 p-4 ${cfg.border} ${cfg.bg} relative overflow-hidden`}
            >
              {/* Accent strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.accent} rounded-l-2xl`} />

              <div className="flex items-start gap-3 pl-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.iconBg}`}>
                  <Icon size={14} className={cfg.iconColor} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className={`text-sm font-black ${cfg.title}`}>{item.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.metric && (
                    <p className="text-xs font-black text-slate-300 mb-2 tabular-nums">
                      {item.metric}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    <span className="font-black text-slate-400">Rec: </span>
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
