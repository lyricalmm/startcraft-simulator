import { motion } from 'framer-motion'
import {
  ChevronRight,
  Cog,
  Factory,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react'

const JOURNEY_STEPS = [
  {
    id: '01',
    badge: 'Awareness & RFQ',
    title: 'Momentul zero: cererea de oferta',
    description:
      'Clientul nu cauta doar un pret. Cauta siguranta ca poti livra corect, rapid si fara sa-i blochezi linia de asamblare.',
    caseStudy:
      'Exemplu: clientul trimite desenul pentru axul central 49x178. Daca verifici imediat materia prima si termenul de aprovizionare, transmiti profesionalism.',
    insight:
      'Viteza si claritatea raspunsului la primul RFQ sunt primul semnal real de incredere pentru un client nou.',
    icon: Search,
    color: 'cyan',
  },
  {
    id: '02',
    badge: 'Evaluation',
    title: 'Negocierea si analiza de risc',
    description:
      'In aceasta etapa, clientul compara nu doar pretul, ci si riscul tehnic, tolerantele critice si probabilitatea de livrare fara rebut.',
    caseStudy:
      'Risc identificat: materialul scump si tolerantele stranse pot transforma o singura eroare de proces intr-o zi intreaga fara profit.',
    insight:
      'Invata sa refuzi sau sa reproiectezi comenzile in care riscul tehnic depaseste utilajele si controlul tau de proces.',
    icon: ShieldCheck,
    color: 'violet',
  },
  {
    id: '03',
    badge: 'Use Experience',
    title: 'Productie transparenta',
    description:
      'In timpul executiei, clientul are nevoie de confirmari scurte si clare. Transparenta operationala reduce anxietatea si creste increderea.',
    caseStudy:
      'Update util: materialul a sosit, primele 100 de bucati sunt in lucru, iar termenul de livrare ramane valid.',
    insight:
      'Nu vinzi doar piese prelucrate. Vinzi predictibilitate, control si liniste pentru echipa clientului.',
    icon: Cog,
    color: 'amber',
  },
  {
    id: '04',
    badge: 'Delivery & Feedback',
    title: 'Ultimul metru: livrare si feedback',
    description:
      'Livrarea, ambalarea si feedback-ul post-livrare determina daca o comanda unica devine relatie recurenta.',
    caseStudy:
      'Livrare buna: piese debavurate, curatate, ambalate separat si insotite de un scurt raport de masuratori.',
    insight:
      'Punctualitatea si grija la livrare sunt marketing-ul cel mai simplu si cel mai greu de copiat pe termen lung.',
    icon: Truck,
    color: 'emerald',
  },
]

const COLOR_CLASSES = {
  cyan: {
    border: 'border-cyan-500/25',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: 'text-cyan-300',
    panel: 'bg-cyan-500/10',
  },
  violet: {
    border: 'border-violet-500/25',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    icon: 'text-violet-300',
    panel: 'bg-violet-500/10',
  },
  amber: {
    border: 'border-amber-500/25',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: 'text-amber-300',
    panel: 'bg-amber-500/10',
  },
  emerald: {
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: 'text-emerald-300',
    panel: 'bg-emerald-500/10',
  },
}

export default function GuidebookCards({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-14 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/15 px-5 py-2.5 text-sm font-semibold text-cyan-300">
          <Factory size={18} />
          StarCraft Guidebook
        </div>
        <h2 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Customer Journey: arta business-ului CNC
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
          Invata sa privesti dincolo de desenul tehnic. Fiecare comanda trece printr-o
          experienta completa: de la RFQ si evaluare, pana la livrare si cererea pentru
          urmatorul lot.
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/60 p-6 md:p-10 shadow-2xl shadow-black/20">
        <div className="mb-10 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 md:p-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            De ce conteaza
          </p>
          <h3 className="mb-5 text-2xl md:text-3xl font-bold text-white leading-snug">
            Customer journey inseamna experienta clientului, nu doar prelucrare
          </h3>
          <p className="text-lg leading-relaxed text-slate-300">
            Pentru un antreprenor CNC, procesul nu se opreste la aschiere. Conteaza
            cum raspunzi la oferta, cum explici riscul, cum comunici in productie si
            cum livrezi. O experienta buna iti aduce incredere, marja si comenzi
            recurente.
          </p>
        </div>

        <div className="space-y-6">
          {JOURNEY_STEPS.map((step, index) => {
            const color = COLOR_CLASSES[step.color]
            const Icon = step.icon

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-[2rem] border ${color.border} ${color.panel} p-8 md:p-10 backdrop-blur-sm`}
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-base font-bold text-white shadow-inner">
                      {step.id}
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-950/60 p-3 shadow-inner">
                      <Icon size={22} className={color.icon} />
                    </div>
                    <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${color.badge}`}>
                      {step.badge}
                    </span>
                  </div>
                </div>

                <h4 className="mb-4 text-2xl md:text-3xl font-bold text-white">{step.title}</h4>
                <p className="mb-8 text-lg leading-relaxed text-slate-200">{step.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-950/70 p-5 md:p-6 shadow-inner">
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Exemplu din comanda
                    </p>
                    <p className="text-base leading-relaxed text-slate-300">{step.caseStudy}</p>
                  </div>

                  <div className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-5 md:p-6 shadow-inner">
                    <p className="text-sm font-bold uppercase tracking-wider text-orange-300 mb-3">
                      Insight antreprenorial
                    </p>
                    <p className="text-base leading-relaxed text-slate-200">{step.insight}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 rounded-[2rem] border border-emerald-500/25 bg-emerald-500/10 p-8 md:p-12 text-center backdrop-blur-sm shadow-inner">
          <h3 className="mb-4 text-3xl font-bold text-white">
            Esti gata sa intri in quest?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            Acum ca vezi comanda prin ochii clientului, putem trece la deciziile
            concrete: ce intrebi, cum raspunzi la evaluare, cum comunici in executie si
            ce face livrarea memorabila.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34,211,238,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="inline-flex w-full md:w-auto items-center justify-center gap-3 rounded-2xl bg-cyan-500 px-10 py-5 text-lg font-bold text-slate-950 transition-all shadow-xl shadow-cyan-500/20 hover:bg-cyan-400"
          >
            Continue to Customer Journey Quest
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
