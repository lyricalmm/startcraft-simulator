import { Link, useLocation } from 'react-router-dom'
import { BarChart3, FileText, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from './Logo'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/simulator', label: 'Simulator', icon: BarChart3 },
  { path: '/report', label: 'Report', icon: FileText },
]

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 print:hidden">
        <div className="w-full px-3 pt-3 pb-1 sm:px-4 lg:px-6">
          <div className="w-full bg-slate-900/90 backdrop-blur-md border-2 border-slate-800 rounded-2xl px-4 sm:px-5 h-14 flex items-center justify-between shadow-xl shadow-black/20">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <motion.div whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Logo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </motion.div>
              <span className="font-black text-xl tracking-tight leading-none">
                <span className="text-white">start</span>
                <span className="text-cyan-400">CR</span>
                <span className="text-orange-500">AFT</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-slate-900'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={14} className="relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="w-full px-3 py-6 sm:px-4 lg:px-6">
        {children}
      </main>
    </div>
  )
}
