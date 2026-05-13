import { motion } from 'framer-motion'
import { ChevronRight, Factory, SkipForward, Sparkles, Target } from 'lucide-react'
import { cncQuestData } from '../../data/cncQuestData'

const MISSION_LABELS = [
  { emoji: '01', label: 'RFQ' },
  { emoji: '02', label: 'Evaluation' },
  { emoji: '03', label: 'Production' },
  { emoji: '04', label: 'Delivery' },
  { emoji: '05', label: 'Retention' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
}

export default function QuestIntro({ onStart, onSkip }) {
  const { intro } = cncQuestData

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-[1520px] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-300">
          <Factory size={16} />
          CNC Micro-Factory · Customer Journey Quest
        </div>
      </div>

      <h1 className="mb-4 text-center text-4xl font-semibold tracking-tight text-white md:text-6xl">
        {cncQuestData.title}
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-center text-base font-normal leading-8 text-slate-400 md:text-lg">
        {cncQuestData.subtitle}
      </p>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 22 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/15">
              <Factory size={24} className="text-cyan-400" />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Your Scenario
              </p>
              <p className="text-base font-normal leading-8 text-slate-200 md:text-lg">
                {intro.story}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 22 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/20">
              <Target size={20} className="text-violet-400" />
            </div>
            <p className="text-lg font-semibold text-slate-200">What you will learn</p>
          </div>
          <ul className="space-y-4">
            {intro.learningGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-3 text-base font-normal leading-7 text-slate-300">
                <span className="mt-0.5 flex-shrink-0 font-semibold text-violet-400">{i + 1}.</span>
                {goal}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {MISSION_LABELS.map(({ emoji, label }, i) => (
          <motion.div
            key={i}
            variants={itemVariant}
            whileHover={{ scale: 1.03, y: -3 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5 text-center shadow-sm"
          >
            <div className="mb-3 text-lg font-semibold text-cyan-300">{emoji}</div>
            <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-medium text-slate-400">
              {i + 1}
            </div>
            <p className="text-xs font-medium leading-tight text-slate-400">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(34,211,238,0.22)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-10 py-4 text-base font-semibold text-slate-900 shadow-[0_0_18px_rgba(34,211,238,0.16)] transition-shadow"
        >
          <Sparkles size={20} />
          Open Guidebook
          <ChevronRight size={22} />
        </motion.button>
        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <SkipForward size={18} />
          Skip to Simulator
        </button>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        5 missions · ~4 minutes · Built around the CNC customer journey
      </p>
    </motion.div>
  )
}
