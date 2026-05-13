import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Percent,
  Activity,
  BarChart3,
  Package,
  Wrench,
} from 'lucide-react'

import { cncPreset } from '../data/cncPreset'
import {
  calculateScenarioResults,
  calculateScenarioComparison,
} from '../lib/calculations'
import { generateFeedback } from '../lib/feedbackRules'
import { formatNumber } from '../lib/formatters'

import CNCFirstOrderQuest from '../components/quest/CNCFirstOrderQuest'
import NicheSelector from '../components/NicheSelector'
import InputPanel from '../components/InputPanel'
import ScenarioSelector from '../components/ScenarioSelector'
import MetricCard from '../components/MetricCard'
import CustomerJourneyMap from '../components/CustomerJourneyMap'
import FeedbackPanel from '../components/FeedbackPanel'
import FinalReport from '../components/FinalReport'
import ChartPanel from '../components/ChartPanel'

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

const profitStatus = (v) => (v > 0 ? 'good' : v === 0 ? 'warning' : 'critical')

const capacityStatus = (v) => {
  if (v > 1) return 'critical'
  if (v > 0.85) return 'warning'
  return 'good'
}

const paybackStatus = (v) => {
  if (v === null) return 'critical'
  if (v > 24) return 'warning'
  return 'good'
}

const roiStatus = (v) => {
  if (v > 0.3) return 'good'
  if (v > 0) return 'warning'
  return 'critical'
}

const marginStatus = (v) => {
  if (v < 0) return 'critical'
  if (v < 0.2) return 'warning'
  return 'good'
}

export default function Simulator() {
  const [selectedNiche, setSelectedNiche] = useState(
    () => localStorage.getItem('startcraft_selected_niche') || '',
  )
  const [questCompleted, setQuestCompleted] = useState(
    () => !!localStorage.getItem('cncQuestResult'),
  )
  const [data, setData] = useState(() => deepClone(cncPreset))
  const [scenario, setScenario] = useState('realistic')

  const results = useMemo(
    () => calculateScenarioResults(data, scenario),
    [data, scenario],
  )

  const comparison = useMemo(() => calculateScenarioComparison(data), [data])

  const feedback = useMemo(
    () => generateFeedback(results.financials, results.inventory, results.data),
    [results],
  )

  const handleFieldChange = useCallback((section, key, newValue) => {
    setData((prev) => {
      const next = deepClone(prev)
      if (next[section] && key in next[section]) {
        next[section][key] = { ...next[section][key], value: newValue }
      }
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setData(deepClone(cncPreset))
  }, [])

  const handleQuestComplete = useCallback((result) => {
    localStorage.setItem('cncQuestResult', JSON.stringify(result))
    setQuestCompleted(true)
  }, [])

  const handleQuestSkip = useCallback(() => {
    setQuestCompleted(true)
  }, [])

  const handleRestartQuest = useCallback(() => {
    localStorage.removeItem('cncQuestResult')
    setQuestCompleted(false)
  }, [])

  const handleNicheSelect = useCallback((nicheId) => {
    localStorage.setItem('startcraft_selected_niche', nicheId)
    setSelectedNiche(nicheId)
  }, [])

  const handleChangeNiche = useCallback(() => {
    localStorage.removeItem('startcraft_selected_niche')
    localStorage.removeItem('cncQuestResult')
    setSelectedNiche('')
    setQuestCompleted(false)
  }, [])

  const { financials: f, inventory: inv } = results

  useEffect(() => {
    localStorage.setItem(
      'startcraft_report',
      JSON.stringify({
        financials: f,
        inventory: inv,
        scenario,
        data: results.data,
        feedback,
      }),
    )
  }, [f, inv, scenario, results.data, feedback])

  if (!selectedNiche) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center py-10"
      >
        <div className="w-full rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-black/10 md:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Start your path
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Selecteaza nisa inginereasca pentru demo
          </h1>
          <p className="mb-10 max-w-3xl text-base leading-8 text-slate-300">
            Pentru nisa CNC Micro-Factory, experienta incepe cu un guidebook despre
            customer journey, apoi continui cu quest-ul si simulatorul financiar.
          </p>

          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/50 p-6">
            <NicheSelector selectedId={selectedNiche} onSelect={handleNicheSelect} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (selectedNiche === 'cnc-micro-factory' && !questCompleted) {
    return <CNCFirstOrderQuest onComplete={handleQuestComplete} onSkip={handleQuestSkip} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-16"
    >
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <NicheSelector selectedId={selectedNiche} onSelect={handleNicheSelect} />
        <div className="flex items-center gap-3">
          <button
            onClick={handleChangeNiche}
            className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800"
          >
            Change Niche
          </button>
          <button
            onClick={handleRestartQuest}
            className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-300 shadow-sm transition-all hover:border-slate-500 hover:bg-slate-700"
          >
            Restart Quest
          </button>
        </div>
      </div>

      <ScenarioSelector
        scenario={scenario}
        onSelect={setScenario}
        comparison={comparison}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <InputPanel
            data={data}
            onFieldChange={handleFieldChange}
            onReset={handleReset}
          />
        </div>

        <div className="xl:col-span-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              title="Monthly Revenue"
              value={formatNumber(f.monthlyRevenue)}
              unit="lei"
              status="neutral"
              icon={DollarSign}
            />
            <MetricCard
              title="Monthly Profit"
              value={formatNumber(f.monthlyProfit)}
              unit="lei"
              status={profitStatus(f.monthlyProfit)}
              icon={TrendingUp}
            />
            <MetricCard
              title="Payback Period"
              value={f.paybackMonths !== null ? Math.round(f.paybackMonths) : '—'}
              unit={f.paybackMonths !== null ? 'months' : ''}
              status={paybackStatus(f.paybackMonths)}
              icon={Clock}
            />
            <MetricCard
              title="ROI (annual)"
              value={f.roi !== null ? (f.roi * 100).toFixed(1) : '—'}
              unit="%"
              status={roiStatus(f.roi)}
              icon={Percent}
            />
            <MetricCard
              title="Capacity Util."
              value={(f.capacityUtilization * 100).toFixed(0)}
              unit="%"
              status={capacityStatus(f.capacityUtilization)}
              icon={Activity}
              description={
                f.capacityStatus === 'over-capacity'
                  ? 'Demand exceeds machine hours!'
                  : 'Within machine limits'
              }
            />
            <MetricCard
              title="Contribution Margin"
              value={(f.contributionMargin.contributionMarginRatio * 100).toFixed(1)}
              unit="%"
              status={marginStatus(f.contributionMargin.contributionMarginRatio)}
              icon={BarChart3}
            />
            <MetricCard
              title="Safety Stock"
              value={inv ? Math.round(inv.safetyStock) : '—'}
              unit="kg"
              status={
                inv?.isStockoutRiskHigh
                  ? 'critical'
                  : inv?.isStockoutRiskMedium
                    ? 'warning'
                    : 'good'
              }
              icon={Package}
              description={inv ? `EOQ: ${Math.round(inv.eoq)} kg` : ''}
            />
            <MetricCard
              title="Break-even"
              value={f.breakEvenUnits !== null ? Math.round(f.breakEvenUnits) : '—'}
              unit={f.breakEvenUnits !== null ? 'units/mo' : ''}
              status={f.canReachBreakEven ? 'good' : 'critical'}
              icon={Wrench}
              description={
                f.breakEvenMonths !== null
                  ? `Invest. back in ~${Math.round(f.breakEvenMonths)} mo`
                  : 'Not reachable'
              }
            />
          </div>
        </div>
      </div>

      <ChartPanel financials={f} inventory={inv} comparison={comparison} />
      <CustomerJourneyMap data={results.data} financials={f} />
      <FeedbackPanel feedback={feedback} />
      <FinalReport
        financials={f}
        inventory={inv}
        scenario={scenario}
        data={results.data}
        feedback={feedback}
      />
    </motion.div>
  )
}
