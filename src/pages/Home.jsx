import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Sparkles, Lock, Play } from 'lucide-react'
import Logo from '../components/Logo'

const features = [
  {
    emoji: '📊',
    title: 'Mathematical Models',
    description: 'Transparent formulas for profit, break-even, ROI, capacity and inventory.',
    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
  },
  {
    emoji: '⚡',
    title: 'Interactive Scenarios',
    description: 'Compare pessimistic, realistic and optimistic business scenarios in real time.',
    color: 'from-violet-500/20 to-violet-500/5 border-violet-500/30',
  },
  {
    emoji: '🎓',
    title: 'Educational Feedback',
    description: 'Rule-based smart feedback explains every recommendation clearly.',
    color: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
  },
]

const niches = [
  { name: 'CNC Micro-Factory', status: 'Demo Available', emoji: '⚙️', available: true },
  { name: 'Additive Manufacturing Lab', status: 'Coming Soon', emoji: '🖨️', available: false },
  { name: 'Robotics Integration', status: 'Coming Soon', emoji: '🤖', available: false },
  { name: 'IoT Infrastructure', status: 'Coming Soon', emoji: '📡', available: false },
  { name: 'Renewable Energy Systems', status: 'Coming Soon', emoji: '☀️', available: false },
  { name: 'Automotive Prototyping', status: 'Coming Soon', emoji: '🏎️', available: false },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="relative flex w-full flex-col overflow-hidden">

      {/* Ambient glows */}
      <div className="fixed top-[15%] left-[10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed top-[40%] right-[5%] w-[40vw] h-[40vw] bg-violet-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] left-[30%] w-[30vw] h-[30vw] bg-orange-500/8 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* ── Hero ── */}
      <div className="relative z-10 flex min-h-[calc(100vh-5.5rem)] w-full flex-col items-center justify-center px-4 pt-6 pb-12 text-center sm:px-6 lg:px-10">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative inline-block">
            <Logo className="w-28 h-28 md:w-36 md:h-36 xl:w-40 xl:h-40 drop-shadow-[0_0_40px_rgba(0,229,255,0.4)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-12px] rounded-full border-2 border-dashed border-cyan-500/20"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="text-[4.5rem] md:text-[7rem] xl:text-[10rem] font-black mb-8 tracking-tighter"
        >
          <span className="text-white drop-shadow-md">start</span>
          <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">CR</span>
          <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">AFT</span>
        </motion.h1>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-violet-500/15 border-2 border-violet-500/30 text-violet-300 text-base font-bold mb-8 shadow-sm"
        >
          <Sparkles size={18} />
          Engineering Entrepreneurship Simulator
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl font-bold text-slate-300 max-w-3xl mx-auto mb-14 leading-relaxed"
        >
          Test the feasibility of a technical business idea using transparent
          math models and interactive dashboards.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,211,238,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/simulator')}
            className="flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xl rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-shadow"
          >
            <Play size={22} className="fill-slate-900" />
            Start Simulation
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://github.com/startcraft/simulator"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-10 py-5 border-2 border-slate-700 hover:border-slate-500 bg-slate-800/50 text-slate-300 hover:text-white rounded-full transition-all font-bold text-lg"
          >
            View Source
            <ChevronRight size={20} />
          </motion.a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 mb-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center pt-2 mx-auto"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-slate-500" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Below fold ── */}
      <div className="relative z-10 w-full px-4 pb-32 sm:px-6 lg:px-10">

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-32"
        >
          {features.map(({ emoji, title, description, color }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`bg-gradient-to-br ${color} border-2 rounded-3xl p-8 cursor-default shadow-sm`}
            >
              <div className="text-4xl mb-6">{emoji}</div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{title}</h3>
              <p className="text-base font-semibold text-slate-400 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Niches */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-32"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center tracking-tight">
            Engineering Niches
          </h2>
          <p className="text-slate-400 font-bold text-center mb-12 text-lg">
            One niche fully modeled · More coming soon
          </p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {niches.map(({ name, emoji, available }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                whileHover={available ? { scale: 1.05, y: -6 } : {}}
                onClick={available ? () => navigate('/simulator') : undefined}
                className={`flex flex-col p-6 rounded-3xl border-2 transition-all duration-200 ${
                  available
                    ? 'border-cyan-500/50 bg-cyan-500/8 cursor-pointer shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}
              >
                <span className="text-4xl mb-4">{emoji}</span>
                <p className={`font-black text-lg mb-2 ${available ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {name}
                </p>
                <div className="flex items-center gap-1 mt-auto pt-4">
                  {available ? (
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Demo Ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                      <Lock size={12} /> Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 mb-20 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Ready to start crafting? 🔥
            </h3>
            <p className="text-slate-400 font-bold text-lg md:text-xl max-w-xl">
              Jump into the CNC Micro-Factory simulator and test your numbers live.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,229,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/simulator')}
            className="relative flex items-center justify-center gap-3 px-12 py-6 bg-white text-slate-950 font-black rounded-full shadow-xl hover:shadow-cyan-500/20 transition-all text-xl w-full md:w-auto"
          >
            Launch Simulator
            <ArrowRight size={22} />
          </motion.button>
        </motion.div>

        <p className="text-xs font-bold text-slate-600 text-center">
          StartCraft © 2026 · Educational Open Source Project
        </p>
      </div>
    </div>
  )
}
