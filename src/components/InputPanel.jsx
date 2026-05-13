import { useState } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cncPresetSections } from '../data/cncPreset'

function FieldInput({ field, onChange }) {
  const isRatio = field.unit === 'ratio'
  const displayValue = isRatio
    ? parseFloat((field.value * 100).toFixed(4))
    : field.value

  const handleChange = (e) => {
    const raw = parseFloat(e.target.value)
    if (Number.isNaN(raw)) return
    const safe = Math.max(0, isRatio ? Math.min(raw, 100) : raw)
    onChange(isRatio ? safe / 100 : safe)
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <label className="text-xs font-semibold text-slate-400 flex-1 pr-3 leading-tight">
        {field.label}
      </label>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          value={displayValue}
          step={isRatio ? 0.1 : 1}
          min={0}
          max={isRatio ? 100 : undefined}
          onChange={handleChange}
          className="w-20 bg-slate-800/80 border-2 border-slate-700 rounded-xl px-2 py-1 text-xs text-right font-bold text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors"
        />
        <span className="text-[10px] text-slate-500 font-bold w-14 truncate leading-tight text-right">
          {field.displayUnit ?? field.unit}
        </span>
      </div>
    </div>
  )
}

export default function InputPanel({ data, onFieldChange, onReset }) {
  const [openSections, setOpenSections] = useState(['fixedCosts', 'sales'])

  const toggle = (id) =>
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-800 bg-slate-800/40">
        <h3 className="text-sm font-black text-slate-200">Input Parameters</h3>
        {onReset && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors bg-slate-800 hover:bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-cyan-500/40"
          >
            <RotateCcw size={11} />
            Reset
          </motion.button>
        )}
      </div>

      {/* Sections */}
      {cncPresetSections.map(({ id, label, description }) => {
        const section = data?.[id]
        if (!section) return null
        const isOpen = openSections.includes(id)
        const fields = Object.entries(section).filter(
          ([, f]) => f && typeof f === 'object' && 'value' in f,
        )

        return (
          <div key={id} className="border-b border-slate-800/50 last:border-0">
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors text-left group"
            >
              <div>
                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{label}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{description}</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <ChevronDown size={15} className="text-slate-500" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pt-1">
                    {fields.map(([key, field]) => (
                      <FieldInput
                        key={key}
                        field={field}
                        onChange={(val) => onFieldChange(id, key, val)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
