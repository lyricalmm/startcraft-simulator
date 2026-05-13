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
    dot: 'bg-cyan-400 text-slate-950',
    border: 'border-cyan-500/25',
    badge: 'bg-cyan-500/12 text-cyan-300 border-cyan-500/25',
    icon: 'text-cyan-300',
    line: 'from-cyan-500/50',
  },
  violet: {
    dot: 'bg-violet-400 text-slate-950',
    border: 'border-violet-500/25',
    badge: 'bg-violet-500/12 text-violet-300 border-violet-500/25',
    icon: 'text-violet-300',
    line: 'from-violet-500/50',
  },
  amber: {
    dot: 'bg-amber-400 text-slate-950',
    border: 'border-amber-500/25',
    badge: 'bg-amber-500/12 text-amber-300 border-amber-500/25',
    icon: 'text-amber-300',
    line: 'from-amber-500/50',
  },
  emerald: {
    dot: 'bg-emerald-400 text-slate-950',
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25',
    icon: 'text-emerald-300',
    line: 'from-emerald-500/50',
  },
}

export default function GuidebookCards({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-[1520px] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mb-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
          <Factory size={16} />
          StarCraft Guidebook
        </div>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Customer Journey: arta business-ului CNC
        </h2>
        <p className="mx-auto max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          Invata sa privesti dincolo de desenul tehnic. Fiecare comanda trece printr-o
          experienta completa: de la RFQ si evaluare, pana la livrare si cererea pentru
          urmatorul lot.
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/55 p-6 shadow-xl shadow-black/10 md:p-8">
        <div className="mb-8 grid gap-6 xl:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-6 md:p-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
              De ce conteaza
            </p>
            <h3 className="mb-4 text-2xl font-semibold text-white">
              Customer journey inseamna experienta clientului, nu doar prelucrare
            </h3>
            <p className="text-[15px] leading-7 text-slate-300">
              Pentru un antreprenor CNC, procesul nu se opreste la aschiere. Conteaza
              cum raspunzi la oferta, cum explici riscul, cum comunici in productie si
              cum livrezi. O experienta buna iti aduce incredere, marja si comenzi
              recurente.
            </p>
          </div>

          <div className="space-y-5">
            {JOURNEY_STEPS.map((step, index) => {
              const color = COLOR_CLASSES[step.color]
              const Icon = step.icon

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative pl-16"
                >
                  {index < JOURNEY_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[1.35rem] top-12 h-[calc(100%+1.1rem)] w-px bg-gradient-to-b ${color.line} to-slate-800`}
                    />
                  )}

                  <div className={`absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full ${color.dot}`}>
                    <span className="text-xs font-semibold">{step.id}</span>
                  </div>

                  <div className={`rounded-[1.4rem] border ${color.border} bg-slate-950/55 p-6 md:p-7`}>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <div className="rounded-full border border-white/8 bg-white/4 p-2.5">
                        <Icon size={18} className={color.icon} />
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${color.badge}`}>
                        {step.badge}
                      </span>
                    </div>

                    <h4 className="mb-3 text-2xl font-semibold text-white">{step.title}</h4>
                    <p className="mb-4 text-[15px] leading-7 text-slate-300">{step.description}</p>

                    <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Exemplu din comanda
                      </p>
                      <p className="mt-2 text-[15px] leading-7 text-slate-300">{step.caseStudy}</p>
                    </div>

                    <div className="rounded-2xl border border-orange-500/18 bg-orange-500/6 p-4">
                      <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-orange-200">
                        Insight antreprenorial
                      </p>
                      <p className="mt-2 text-[15px] leading-7 text-slate-200">{step.insight}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-500/18 bg-emerald-500/7 p-6 text-center md:p-7">
          <h3 className="mb-3 text-2xl font-semibold text-white">
            Esti gata sa intri in quest?
          </h3>
          <p className="mx-auto mb-6 max-w-3xl text-[15px] leading-7 text-slate-300">
            Acum ca vezi comanda prin ochii clientului, putem trece la deciziile
            concrete: ce intrebi, cum raspunzi la evaluare, cum comunici in executie si
            ce face livrarea memorabila.
          </p>

          <motion.button
            whileHover={{ scale: 1.01, boxShadow: '0 0 24px rgba(34,211,238,0.16)' }}
            whileTap={{ scale: 0.99 }}
            onClick={onComplete}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all shadow-lg shadow-cyan-500/10 hover:bg-cyan-400"
          >
            Continue to Customer Journey Quest
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
