# StartCraft Simulator

**An open educational tool that helps engineering students validate business ideas using real mathematical models — no backend, no AI API, no black boxes.**

---

## What is this?

StartCraft Simulator is an interactive web application designed for engineering students and educators. It bridges the gap between technical education and entrepreneurship by letting students simulate a complete business model for an engineering niche — starting from machine costs and production rates, all the way to monthly profit, break-even point, inventory management, and customer journey conversion.

The simulator is fully transparent: every result is derived from explicit formulas that students can inspect, modify, and learn from.

---

## The Educational Problem

Engineering students typically learn production costs, operations management, and entrepreneurship in separate, disconnected courses. When they attempt to evaluate a real business idea, they lack a hands-on tool that shows how these concepts interact:

- How does scrap rate affect profit margin?
- How many machine-hours are needed to meet monthly demand?
- When does the investment pay back, and under what scenario?
- How does the customer conversion funnel connect to revenue?

StartCraft Simulator makes these connections visible and interactive.

---

## The Solution

A client-side React application that:

1. **Loads a pre-configured niche preset** (CNC Micro-Factory for MVP) with all constants documented.
2. **Lets students edit any parameter** (selling price, demand, scrap rate, fixed costs, etc.) and see results update instantly.
3. **Runs three scenarios** — Pessimistic / Realistic / Optimistic — applying declarative multipliers to demand, costs, scrap, and conversion rates.
4. **Calculates a full economic model**: revenue, variable cost, fixed cost, profit, contribution margin, break-even, ROI, payback period, capacity utilization.
5. **Models inventory**: Safety Stock, Reorder Point, Economic Order Quantity (EOQ), holding cost, stockout risk.
6. **Maps the Customer Journey** from awareness leads to repeat orders, with conversion rates and revenue impact at each stage.
7. **Generates rule-based educational feedback**: identifies problems (negative profit, over-capacity, thin margins) and explains the underlying cause.
8. **Produces a printable Final Report** summarizing inputs, KPIs, feasibility score, and recommendations.

---

## How to Run

### Requirements

- Node.js 18+ and npm

### Install and start

```bash
cd startcraft-simulator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

The production build is fully static — you can host it on any static file server or open `dist/index.html` directly.

---

## Formulas Used

All formulas are in `src/lib/calculations.js` and `src/lib/inventoryModels.js`.

### Economic model (monthly)

```
revenue               = sellingPrice × unitsSold
variableCostPerUnit   = materialCost + machiningTime × (machineRate + operatorRate) + toolingCostPerUnit
scrapAdjustedUnits    = demandUnits × (1 + scrapRate)
monthlyVariableCosts  = variableCostPerUnit × scrapAdjustedUnits
monthlyTotalCosts     = fixedCosts + monthlyVariableCosts + maintenanceCost
monthlyProfit         = revenue − monthlyTotalCosts
contributionMargin    = sellingPrice − variableCostPerUnit
breakEvenUnits        = fixedCosts / contributionMargin
paybackMonths         = initialInvestment / monthlyProfit
roi (annual)          = annualProfit / initialInvestment
capacityUtilization   = requiredMachineHours / availableMachineHours
```

### Inventory model

```
safetyStock   = averageDailyDemand × safetyDays
reorderPoint  = averageDailyDemand × supplierLeadTimeDays + safetyStock
EOQ           = √(2 × annualDemand × orderCost / holdingCostPerUnit)
holdingCost   = averageInventory × unitCost × holdingRate
```

### Customer Journey funnel

```
leads           = awarenessReach × monthlyDemand (from preset)
quoteRequests   = leads × interestRate × evaluationRate
newOrders       = quoteRequests × decisionRate
repeatOrders    = newOrders × retentionRate
referralOrders  = newOrders × referralRate
totalOrders     = newOrders + repeatOrders + referralOrders
estimatedRevenue = totalOrders × avgPartsPerOrder × sellingPrice
```

---

## Open Pedagogy

StartCraft Simulator is designed as an **open educational resource (OER)**:

- All source code is MIT-licensed and freely available.
- All formulas are explicit, inline, and commented — there are no hidden algorithms.
- Students can fork the repo, add new niches, or modify the feedback rules to fit their course.
- The simulator is self-contained: it works offline, in a classroom, or on a USB stick.
- No data is sent to external services. No account required.

---

## HOPEe Alignment

This project was created for the **HOPEe Hackathon** (Hardware Open Pedagogy for Engineers).

It addresses the HOPEe theme by:

- **Hardware focus**: The MVP niche is a CNC Micro-Factory — a real engineering production context with machine hours, material costs, scrap rates, and tool wear.
- **Open pedagogy**: All models are transparent, documented, and modifiable. Students learn by interacting with formulas, not by trusting a black-box answer.
- **Entrepreneurship education**: The simulator connects production parameters directly to business feasibility indicators, teaching engineering students to think like entrepreneurs.
- **Accessibility**: The app runs locally with no cloud dependency, making it usable in any educational setting.

---

## Why No External AI API

The feedback engine is **entirely rule-based**, implemented in `src/lib/feedbackRules.js`.

This was a deliberate decision:

- **Transparency**: Every feedback message has an explicit mathematical trigger (e.g., `monthlyProfit < 0` → critical alert). Students and educators can read and verify the rules.
- **Reliability**: No API keys, no rate limits, no internet dependency. The app works in a room with no Wi-Fi.
- **Educational value**: Rule-based feedback teaches students the logic behind financial analysis, rather than hiding it in a language model.
- **Portability**: The entire app ships as a static bundle.

---

## Project Structure

```
src/
├── data/
│   ├── cncPreset.js          # CNC Micro-Factory constants (all editable)
│   ├── niches.js             # Available niches (1 full + 5 placeholders)
│   └── scenarioPresets.js    # Pessimistic / Realistic / Optimistic modifiers
│
├── lib/
│   ├── calculations.js       # Core economic model + scenario engine
│   ├── inventoryModels.js    # Safety Stock, EOQ, Reorder Point, Holding Cost
│   ├── customerJourneyMath.js# Funnel calculation (leads → orders → revenue)
│   ├── feedbackRules.js      # Rule-based feedback engine (10+ rules)
│   └── formatters.js         # Number, currency, percent formatters
│
├── components/
│   ├── Layout.jsx            # Header + navigation wrapper
│   ├── NicheSelector.jsx     # Niche pill row
│   ├── InputPanel.jsx        # Collapsible parameter editor
│   ├── ScenarioSelector.jsx  # Scenario cards with comparison metrics
│   ├── MetricCard.jsx        # KPI card with status color
│   ├── ChartPanel.jsx        # Chart grid orchestrator
│   ├── charts/               # 6 Recharts visualizations
│   ├── CustomerJourneyMap.jsx# Animated funnel with numeric stages
│   ├── FeedbackPanel.jsx     # Sorted feedback cards by severity
│   └── FinalReport.jsx       # Printable summary report
│
└── pages/
    ├── Home.jsx              # Landing page with niche preview
    ├── Simulator.jsx         # Main simulator page (full flow)
    └── Report.jsx            # Standalone report page
```

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool + dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Recharts | 3 | Interactive charts |
| Framer Motion | 12 | Animations and transitions |
| Lucide React | 1 | Icon set |
| React Router DOM | 7 | Client-side routing |

---

## Available Niches

| Niche | Status |
|-------|--------|
| CNC Micro-Factory | Full model (MVP) |
| 3D Printing Service | Coming Soon |
| Bike Sharing Campus | Coming Soon |
| Student SaaS App | Coming Soon |
| Technical Maintenance | Coming Soon |
| Smart Lab / Metrology | Coming Soon |

---

## License

- **Source code**: [MIT License](LICENSE)
- **Educational content** (formulas, documentation, demo scripts): [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)

You are free to use, fork, and adapt this project for your own courses, workshops, or hackathons. Attribution appreciated.

---

## Team

Built during the HOPEe Hackathon 2026.

*StartCraft — transparent models for engineering entrepreneurs.*
