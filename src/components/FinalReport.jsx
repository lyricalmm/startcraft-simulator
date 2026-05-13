import { FileText, Printer } from 'lucide-react'

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`text-sm tabular-nums ${highlight ? 'text-cyan-300 font-bold' : 'text-slate-200'}`}
      >
        {value}
      </span>
    </div>
  )
}

const isFiniteNumber = (v) => Number.isFinite(Number(v))

const lei = (v) =>
  v !== null && v !== undefined && isFiniteNumber(v)
    ? `${Math.round(v).toLocaleString('ro-RO')} lei`
    : '—'
const pct = (v) =>
  v !== null && v !== undefined && isFiniteNumber(v) ? `${(v * 100).toFixed(1)} %` : '—'
const mo = (v) =>
  v !== null && v !== undefined && isFiniteNumber(v) ? `${Math.round(v)} months` : '—'
const num = (v, suffix = '') =>
  v !== null && v !== undefined && isFiniteNumber(v) ? `${Math.round(v).toLocaleString('ro-RO')}${suffix}` : '—'

export default function FinalReport({ financials, inventory, scenario, data, feedback }) {
  if (!financials) return null

  const f = financials
  const inv = inventory
  const journey = f.customerJourney ?? {}
  const scenarioLabel =
    scenario.charAt(0).toUpperCase() + scenario.slice(1)

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <FileText size={15} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-200">
              Final Report Preview
            </h3>
            <p className="text-xs font-bold text-slate-500 print:text-slate-600">
              {data?.name ?? 'CNC Micro-Factory'} — {scenarioLabel} scenario
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-slate-600 hover:text-white transition-colors print:hidden"
        >
          <Printer size={13} />
          Print
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs font-semibold text-slate-500 print:text-slate-600 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Financial Summary
          </p>
          <Row label="Initial Investment" value={lei(f.initialInvestment)} />
          <Row label="Monthly Revenue" value={lei(f.monthlyRevenue)} />
          <Row label="Monthly Fixed Costs" value={lei(f.fixedCosts)} />
          <Row label="Monthly Variable Costs" value={lei(f.monthlyVariableCosts)} />
          <Row
            label="Monthly Profit"
            value={lei(f.monthlyProfit)}
            highlight
          />
          <Row label="Annual Profit" value={lei(f.annualProfit)} />
          <Row label="Gross Margin" value={pct(f.grossMargin)} />
          <Row label="Net Margin" value={pct(f.netMargin)} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 print:text-slate-600 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Feasibility Indicators
          </p>
          <Row
            label="Break-even (units/month)"
            value={
              f.breakEvenUnits !== null
                ? `${Math.round(f.breakEvenUnits)} units`
                : '—'
            }
          />
          <Row
            label="Payback Period"
            value={mo(f.paybackMonths)}
            highlight
          />
          <Row label="ROI (annual)" value={pct(f.roi)} />
          <Row
            label="Capacity Utilisation"
            value={pct(f.capacityUtilization)}
          />
          <Row
            label="Units Sold / month"
            value={`${Math.round(f.unitsSold)} parts`}
          />
          <Row
            label="Contribution Margin"
            value={pct(f.contributionMargin.contributionMarginRatio)}
          />
          {inv && (
            <>
              <Row
                label="Safety Stock"
                value={`${Math.round(inv.safetyStock)} kg`}
              />
              <Row label="EOQ" value={`${Math.round(inv.eoq)} kg`} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:break-inside-avoid">
        <div>
          <p className="text-xs font-semibold text-slate-500 print:text-slate-600 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Key Assumptions
          </p>
          <Row label="Average Sale Price" value={lei(data?.sales?.sellingPricePerPart?.value)} />
          <Row label="Material Cost / part" value={lei(data?.sales?.materialCostPerPart?.value)} />
          <Row label="Fixed Costs / month" value={lei(f.fixedCosts)} />
          <Row label="Machining Time / part" value={`${data?.production?.machiningTimePerPart?.value ?? '—'} h`} />
          <Row label="Scrap Rate" value={pct(data?.production?.scrapRate?.value)} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 print:text-slate-600 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Customer Journey Summary
          </p>
          {f.customerJourney ? (
            <>
              <Row label="Leads Required" value={num(journey.leads)} />
              <Row label="Quote Requests" value={num(journey.quotes)} />
              <Row label="Orders Generated" value={num(journey.totalOrders)} />
              <Row label="Lead-to-Order Rate" value={pct(journey.conversionRate)} />
              <Row label="Repeat / Referral Orders" value={num((journey.repeatOrders ?? 0) + (journey.referralOrders ?? 0))} />
            </>
          ) : (
            <p className="text-sm text-slate-400 italic">No journey data available</p>
          )}
        </div>
      </div>

      {feedback && feedback.length > 0 && (
        <div className="mb-8 print:break-inside-avoid">
          <p className="text-xs font-semibold text-slate-500 print:text-slate-600 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Educational Feedback Insights
          </p>
          <div className="flex flex-col gap-3">
            {feedback.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start border-l-2 pl-3 border-slate-700">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`mt-6 p-3 rounded-lg border text-center text-sm font-semibold ${
          f.isProfitable
            ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
            : 'border-red-500/40 bg-red-500/5 text-red-300'
        }`}
      >
        {f.isProfitable
          ? `✓ Feasible — investment recovered in ${mo(f.paybackMonths)}`
          : '✗ Not yet profitable — review inputs and scenario assumptions'}
      </div>
    </div>
  )
}
