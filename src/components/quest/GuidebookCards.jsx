import { motion } from 'framer-motion'
import {
  ChevronRight,
  ClipboardCheck,
  Factory,
  PenTool,
  Truck,
} from 'lucide-react'

const CARDS = [
  {
    title: 'Technical Feasibility',
    badge: 'Critical',
    question: 'Can the required tolerances be achieved with the available CNC machines?',
    explanation: 'Before accepting a job, the workshop must verify if the part tolerances, dimensions and surface requirements can be manufactured with the available equipment.',
    icon: ClipboardCheck,
    color: 'cyan',
  },
  {
    title: 'Raw Material Fit',
    badge: 'Capacity',
    question: 'Does the raw material fit the machine and the part requirements?',
    explanation: 'The semi-finished material must fit the machine workspace, chuck capacity and machining strategy.',
    icon: Factory,
    color: 'violet',
  },
  {
    title: 'Material Procurement',
    badge: '5 Days',
    question: 'Can the material be delivered before production starts?',
    explanation: 'The material supplier has a 5-day delivery time, so the production plan must include procurement lead time.',
    icon: Truck,
    color: 'amber',
  },
  {
    title: 'Tool Selection',
    badge: 'Quality',
    question: 'Are the cutting tools suitable for the selected material?',
    explanation: 'Tool choice influences machining time, cost, tool wear, quality and scrap risk.',
    icon: PenTool,
    color: 'emerald',
  },
]

const COLORS = {
  cyan: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
  },
  violet: {
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  },
}

export default function GuidebookCards({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto py-12 px-6"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
          <Factory size={16} />
          CNC Order Guidebook
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Before You Accept the Job</h2>
        <p className="text-slate-400 text-base">
          Client order:{' '}
          <span className="text-slate-300 font-bold">500 pieces</span>
          {' · '}Ø49 × 178 mm{' · '}
          <span className="text-slate-300 font-bold">5-day material delivery</span>
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4 mb-10">
        {CARDS.map((card, i) => {
          const c = COLORS[card.color]
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0 mt-1`}>
                  <Icon size={24} className={c.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm font-bold uppercase tracking-wider ${c.text}`}>{card.title}</span>
                    {card.badge && (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>{card.badge}</span>
                    )}
                  </div>
                  <p className="text-slate-200 text-base md:text-lg font-semibold mb-2">{card.question}</p>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{card.explanation}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34,211,238,0.2)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-lg rounded-xl transition-all shadow-lg"
      >
        I'm Ready — Start the Quest
        <ChevronRight size={22} />
      </motion.button>
    </motion.div>
  )
}
