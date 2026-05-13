import { motion } from 'framer-motion'

const STATUS = {
  good: {
    card: 'border-emerald-500/60 bg-emerald-500/8',
    glow: 'from-emerald-500/15 to-transparent',
    iconBg: 'bg-emerald-500/20 border border-emerald-500/30',
    iconColor: 'text-emerald-400',
    value: 'text-emerald-400',
    desc: 'text-emerald-600',
    dot: 'bg-emerald-400',
  },
  warning: {
    card: 'border-amber-500/60 bg-amber-500/8',
    glow: 'from-amber-500/15 to-transparent',
    iconBg: 'bg-amber-500/20 border border-amber-500/30',
    iconColor: 'text-amber-400',
    value: 'text-amber-400',
    desc: 'text-amber-600',
    dot: 'bg-amber-400',
  },
  critical: {
    card: 'border-red-500/60 bg-red-500/8',
    glow: 'from-red-500/15 to-transparent',
    iconBg: 'bg-red-500/20 border border-red-500/30',
    iconColor: 'text-red-400',
    value: 'text-red-400',
    desc: 'text-red-600',
    dot: 'bg-red-400',
  },
  neutral: {
    card: 'border-slate-700 bg-slate-800/50',
    glow: 'from-cyan-500/8 to-transparent',
    iconBg: 'bg-slate-700/60 border border-slate-600',
    iconColor: 'text-cyan-400',
    value: 'text-cyan-400',
    desc: 'text-slate-500',
    dot: 'bg-cyan-400',
  },
}

export default function MetricCard({ title, value, unit, status = 'neutral', description, icon: Icon }) {
  const cfg = STATUS[status] ?? STATUS.neutral

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      whileHover={{ y: -4, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      className={`rounded-2xl border-2 p-4 relative overflow-hidden cursor-default select-none ${cfg.card}`}
    >
      {/* Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.glow} pointer-events-none`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</p>
          </div>
          {Icon && (
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
              <Icon size={14} className={cfg.iconColor} />
            </div>
          )}
        </div>

        {/* Value */}
        <p className={`text-3xl font-black tabular-nums leading-none ${cfg.value}`}>
          {value}
          {unit && <span className="text-xs font-bold text-slate-500 ml-1">{unit}</span>}
        </p>

        {/* Description */}
        {description && (
          <p className={`text-[11px] font-bold mt-2 leading-tight ${cfg.desc}`}>{description}</p>
        )}
      </div>
    </motion.div>
  )
}
