import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Trophy, XCircle } from 'lucide-react'

const BADGES = [
  'RFQ clarified',
  'Evaluation handled',
  'Production communicated',
  'Delivery prepared',
]

export default function QuestResults({ scores, onUnlock }) {
  const correct = scores.filter(Boolean).length
  const total = scores.length
  const pct = Math.round((correct / total) * 100)

  const levelInfo =
    pct >= 75
      ? {
          label: 'Journey Ready',
          colorClass: 'text-cyan-400',
          bgClass: 'bg-cyan-500/10 border-cyan-500/20',
        }
      : pct >= 50
        ? {
            label: 'Needs Revision',
            colorClass: 'text-amber-400',
            bgClass: 'bg-amber-500/10 border-amber-500/20',
          }
        : {
            label: 'Review Required',
            colorClass: 'text-red-400',
            bgClass: 'bg-red-500/10 border-red-500/20',
          }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-[1280px] px-4 py-12 text-center sm:px-6 lg:px-10"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-12"
      >
        <Trophy size={64} className="mx-auto mb-6 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
        <h2 className="mb-2 text-4xl font-semibold text-white md:text-5xl">
          Customer Journey Readiness
        </h2>
        <div className="my-6 text-8xl font-black tabular-nums text-cyan-400 drop-shadow-lg md:text-9xl">
          {pct}%
        </div>
        <span className={`rounded-full border px-6 py-2 text-base font-semibold ${levelInfo.bgClass} ${levelInfo.colorClass}`}>
          {levelInfo.label}
        </span>
      </motion.div>

      <div className="mb-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2 xl:grid-cols-4">
        {BADGES.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className={`flex items-center gap-4 rounded-2xl border p-5 ${
              scores[i]
                ? 'border-emerald-500/30 bg-emerald-500/10 shadow-sm'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            {scores[i] ? (
              <CheckCircle2 size={24} className="flex-shrink-0 text-emerald-400" />
            ) : (
              <XCircle size={24} className="flex-shrink-0 text-slate-500" />
            )}
            <span className={`text-sm font-semibold ${scores[i] ? 'text-slate-200' : 'text-slate-500'}`}>
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-slate-400">
        Your decisions define how the first customer experiences your workshop.
        Continue to the simulator to see how trust, delivery confidence and retention
        shape conversion, profitability and repeat orders.
      </p>

      <motion.button
        whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(34,211,238,0.28)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onUnlock}
        className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-10 py-4 text-lg font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.16)] transition-all"
      >
        Unlock CNC Simulator
        <ArrowRight size={24} />
      </motion.button>
    </motion.div>
  )
}
