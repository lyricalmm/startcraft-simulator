import { motion } from 'framer-motion'
import { CheckCircle2, Lock } from 'lucide-react'
import { niches } from '../data/niches'

export default function NicheSelector({ selectedId = 'cnc-micro-factory', onSelect }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
        Engineering Niche
      </p>
      <div className="flex flex-wrap gap-2">
        {niches.map((niche) => {
          const isAvailable = niche.status === 'available'
          const isSelected = niche.id === selectedId

          return (
            <motion.button
              key={niche.id}
              whileHover={isAvailable ? { scale: 1.04 } : {}}
              whileTap={isAvailable ? { scale: 0.96 } : {}}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect?.(niche.id)}
              className={[
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 text-sm font-bold transition-all duration-200',
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : isAvailable
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                    : 'border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed',
              ].join(' ')}
            >
              {isSelected ? (
                <CheckCircle2 size={13} className="text-cyan-400" />
              ) : !isAvailable ? (
                <Lock size={12} className="text-slate-600" />
              ) : null}
              {niche.name}
              {!isAvailable && (
                <span className="text-[10px] text-slate-600 font-black">soon</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
