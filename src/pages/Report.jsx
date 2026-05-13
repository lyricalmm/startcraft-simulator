import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import FinalReport from '../components/FinalReport'

export default function Report() {
  const [reportData] = useState(() => {
    const saved = localStorage.getItem('startcraft_report')
    if (!saved) return null

    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse report data', e)
      return null
    }
  })

  if (!reportData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
          <FileText size={28} className="text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">No Report Found</h1>
        <p className="text-slate-400 max-w-md mb-6">
          You need to run a simulation first to generate a final report.
        </p>
        <Link 
          to="/simulator"
          className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition-colors"
        >
          Go to Simulator
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-16"
    >
      <div className="mb-6 print:hidden">
        <Link to="/simulator" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          <ArrowLeft size={16} />
          Back to Simulator
        </Link>
      </div>
      
      <FinalReport 
        financials={reportData.financials}
        inventory={reportData.inventory}
        scenario={reportData.scenario}
        data={reportData.data}
        feedback={reportData.feedback}
      />
    </motion.div>
  )
}
