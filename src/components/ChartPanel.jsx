import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BreakEvenChart from './charts/BreakEvenChart'
import ProfitScenariosChart from './charts/ProfitScenariosChart'
import CashFlowChart from './charts/CashFlowChart'
import CostDistributionChart from './charts/CostDistributionChart'
import CapacityGauge from './charts/CapacityGauge'
import InventoryChart from './charts/InventoryChart'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

function ChartCard({ children }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      className="min-w-0 w-full bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

export default function ChartPanel({ financials, inventory, comparison }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <ChartCard>{ready && <BreakEvenChart financials={financials} />}</ChartCard>
      <ChartCard>{ready && <ProfitScenariosChart comparison={comparison} />}</ChartCard>
      <ChartCard>{ready && <CashFlowChart financials={financials} />}</ChartCard>
      <ChartCard>{ready && <CostDistributionChart financials={financials} />}</ChartCard>
      <ChartCard>{ready && <CapacityGauge financials={financials} />}</ChartCard>
      <ChartCard>{ready && <InventoryChart inventory={inventory} />}</ChartCard>
    </motion.div>
  )
}
