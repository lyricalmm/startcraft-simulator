/**
 * Rule-based Smart Feedback Engine.
 * Receives pre-computed financial, inventory and scenario data and returns
 * educational feedback. No AI API, no network calls, no side effects.
 *
 * Each item: { id, level, title, description, recommendation, metric }
 * Levels: 'critical' | 'warning' | 'insight' | 'good'
 */

const finiteOr = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const safeDivide = (numerator, denominator, fallback = 0) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback
  }

  return numerator / denominator
}

const readValue = (field, fallback = 0) => {
  if (field && typeof field === 'object' && 'value' in field) {
    return finiteOr(Number(field.value), fallback)
  }

  return finiteOr(Number(field), fallback)
}

const pct = (value, decimals = 1) => `${(finiteOr(value) * 100).toFixed(decimals)}%`

const lei = (value) =>
  `${Math.round(finiteOr(value)).toLocaleString('ro-RO')} lei`

const months = (value) =>
  value === null || value === undefined ? 'not reachable' : `${Math.round(value)} months`

const addItem = (items, item) => {
  items.push({
    priority: 50,
    metric: null,
    ...item,
  })
}

function quoteToOrderRate(financials) {
  const journey = financials?.customerJourney ?? {}
  return safeDivide(journey.newOrders, journey.quotes, 0)
}

function currentStockKg(data) {
  return readValue(data?.inventory?.currentStockKg, null)
}

function scrapRate(data, financials) {
  const explicitRate = readValue(data?.production?.scrapRate, null)
  if (explicitRate !== null) return clamp(explicitRate, 0, 1)

  const variableCost = financials?.variableCostPerUnit ?? {}
  return safeDivide(variableCost.scrapAdjustment, variableCost.baseVariableCost, 0)
}

export function calculateFeasibilityScore(financials, inventory = {}, data = null) {
  if (!financials) return 0

  const netMargin = financials.netMargin ?? 0
  const paybackMonths = financials.paybackMonths
  const capacityUtilization = financials.capacityUtilization ?? 0
  const qto = quoteToOrderRate(financials)
  const stockoutRisk = inventory.stockoutRisk ?? 'low'
  const scrap = scrapRate(data, financials)

  const profitabilityScore = financials.monthlyProfit > 0
    ? clamp(netMargin / 0.2, 0, 1) * 30
    : 0

  const paybackScore = paybackMonths === null
    ? 0
    : paybackMonths <= 12
      ? 20
      : paybackMonths <= 24
        ? 20 - ((paybackMonths - 12) / 12) * 8
        : Math.max(0, 8 - ((paybackMonths - 24) / 24) * 8)

  const capacityScore = capacityUtilization <= 0
    ? 0
    : capacityUtilization < 0.5
      ? 10
      : capacityUtilization <= 0.8
        ? 20
        : capacityUtilization <= 0.95
          ? 16
          : capacityUtilization <= 1
            ? 10
            : Math.max(0, 10 - (capacityUtilization - 1) * 20)

  const conversionScore = qto >= 0.35
    ? 15
    : qto >= 0.25
      ? 10
      : qto >= 0.15
        ? 5
        : 0

  const inventoryScore = stockoutRisk === 'high' ? 0 : stockoutRisk === 'medium' ? 5 : 10
  const qualityScore = scrap <= 0.05 ? 5 : scrap <= 0.08 ? 3 : 0

  return Math.round(
    profitabilityScore +
      paybackScore +
      capacityScore +
      conversionScore +
      inventoryScore +
      qualityScore,
  )
}

export function classifyFeasibilityScore(score) {
  if (score >= 80) return 'feasible'
  if (score >= 60) return 'promising'
  if (score >= 40) return 'risky'
  return 'not-feasible'
}

export function generateFeedback(financials, inventory = {}, data = null) {
  const items = []
  if (!financials) return items

  const f = financials
  const inv = inventory ?? {}
  const contribution = f.contributionMargin ?? {}
  const contributionRatio = contribution.contributionMarginRatio ?? 0
  const contributionPerUnit = contribution.contributionMarginPerUnit ?? 0
  const qto = quoteToOrderRate(f)
  const scrap = scrapRate(data, f)
  const currentStock = currentStockKg(data)
  const feasibilityScore = calculateFeasibilityScore(f, inv, data)
  const feasibilityClass = classifyFeasibilityScore(feasibilityScore)

  if (!f.isProfitable) {
    addItem(items, {
      id: 'negative-profit',
      level: 'critical',
      priority: 1,
      title: 'Business not profitable',
      metric: `Monthly profit: ${lei(f.monthlyProfit)}`,
      description: `The model loses ${lei(Math.abs(f.monthlyProfit))} per month because total monthly costs exceed revenue.`,
      recommendation:
        'Increase selling price, reduce fixed costs, reduce variable cost per unit, or improve the sales funnel before scaling.',
    })
  }

  if (contributionPerUnit <= 0) {
    addItem(items, {
      id: 'no-unit-breakeven',
      level: 'critical',
      priority: 2,
      title: 'Break-even cannot be reached per unit',
      metric: `Contribution margin: ${lei(contributionPerUnit)} / part`,
      description:
        'The selling price does not cover the variable cost per part, so every unit sold worsens the result.',
      recommendation:
        'Raise the unit price or reduce material, energy, labor, tooling and scrap costs before accepting more orders.',
    })
  }

  if (f.paybackMonths === null && f.isProfitable === false) {
    addItem(items, {
      id: 'no-investment-payback',
      level: 'critical',
      priority: 3,
      title: 'Investment payback is not reachable',
      metric: 'Payback: not reachable',
      description:
        'Because monthly profit is negative, the initial investment cannot be recovered under the current assumptions.',
      recommendation:
        'First make monthly profit positive, then evaluate whether the payback period is acceptable.',
    })
  }

  if (f.capacityUtilization > 1) {
    addItem(items, {
      id: 'over-capacity',
      level: 'critical',
      priority: 4,
      title: 'Demand exceeds production capacity',
      metric: `Capacity utilization: ${pct(f.capacityUtilization)}`,
      description:
        'Required machining and setup hours are higher than the available machine hours. Some orders cannot be delivered.',
      recommendation:
        'Add a second shift, reduce machining time, outsource overflow work, or invest in another machine.',
    })
  }

  if (f.isProfitable && f.paybackMonths !== null && f.paybackMonths > 24) {
    addItem(items, {
      id: 'long-payback',
      level: 'warning',
      priority: 10,
      title: 'Investment recovers slowly',
      metric: `Payback: ${months(f.paybackMonths)}`,
      description:
        'For a technical startup, a payback period above 24 months increases financial exposure and execution risk.',
      recommendation:
        'Improve monthly profit through pricing, higher conversion, lower fixed costs, or better machine utilization.',
    })
  }

  if (contributionPerUnit > 0 && contributionRatio < 0.2) {
    addItem(items, {
      id: 'low-contribution-margin',
      level: 'warning',
      priority: 11,
      title: 'Contribution margin is thin',
      metric: `Contribution margin ratio: ${pct(contributionRatio)}`,
      description:
        'A margin below 20% leaves little buffer for cost changes, scrap, rework or demand volatility.',
      recommendation:
        'Review price positioning, material usage, tool life, scrap rate and labor assumptions.',
    })
  }

  if (f.capacityUtilization > 0.95 && f.capacityUtilization <= 1) {
    addItem(items, {
      id: 'capacity-bottleneck-risk',
      level: 'warning',
      priority: 12,
      title: 'Capacity is near bottleneck',
      metric: `Capacity utilization: ${pct(f.capacityUtilization)}`,
      description:
        'The machine is almost fully loaded. Small disruptions can delay customer orders.',
      recommendation:
        'Keep a capacity buffer, reserve maintenance time, or plan overtime before accepting more demand.',
    })
  }

  if (f.capacityUtilization > 0 && f.capacityUtilization < 0.5) {
    addItem(items, {
      id: 'underused-capacity',
      level: 'insight',
      priority: 28,
      title: 'Capacity is underused',
      metric: `Capacity utilization: ${pct(f.capacityUtilization)}`,
      description:
        'The machine has unused time, while fixed costs continue every month.',
      recommendation:
        'Increase lead generation, sell recurring production slots, or accept small jobs that fit idle capacity.',
    })
  }

  if (scrap > 0.08) {
    addItem(items, {
      id: 'high-scrap-rate',
      level: 'warning',
      priority: 13,
      title: 'Scrap rate is high',
      metric: `Scrap rate: ${pct(scrap)}`,
      description:
        'Scrap above 8% directly increases variable cost and reduces usable output.',
      recommendation:
        'Improve process setup, cutting parameters, inspection frequency and operator training.',
    })
  }

  if (currentStock !== null && inv.reorderPoint !== undefined && currentStock < inv.reorderPoint) {
    addItem(items, {
      id: 'below-reorder-point',
      level: 'warning',
      priority: 14,
      title: 'Stock is below reorder point',
      metric: `Stock: ${Math.round(currentStock)} kg / ROP: ${Math.round(inv.reorderPoint)} kg`,
      description:
        'Current material stock is below the level needed to cover expected demand during supplier lead time.',
      recommendation:
        'Place a replenishment order now or reduce accepted orders until material availability is restored.',
    })
  }

  if (inv.isStockoutRiskHigh) {
    addItem(items, {
      id: 'stockout-risk-high',
      level: 'warning',
      priority: 15,
      title: 'High stockout risk',
      metric: `Safety stock: ${Math.round(inv.safetyStock ?? 0)} kg`,
      description:
        'Safety stock is too low relative to demand variability during supplier lead time.',
      recommendation:
        'Increase safety stock, negotiate shorter lead time, or qualify a backup supplier.',
    })
  }

  if (qto < 0.25) {
    addItem(items, {
      id: 'low-quote-to-order',
      level: 'insight',
      priority: 20,
      title: 'Quote-to-order conversion is weak',
      metric: `Quote-to-order: ${pct(qto)}`,
      description:
        'Many prospects request quotes, but too few become orders. This points to price, lead time, trust or communication gaps.',
      recommendation:
        'Improve quote response speed, show tolerances and examples clearly, and follow up with prospects after quotes.',
    })
  }

  if (inv.isStockoutRiskMedium) {
    addItem(items, {
      id: 'stockout-risk-medium',
      level: 'insight',
      priority: 21,
      title: 'Moderate stockout risk',
      metric: `Safety stock: ${Math.round(inv.safetyStock ?? 0)} kg`,
      description:
        'Safety stock covers normal variation, but larger demand spikes could still interrupt production.',
      recommendation:
        'Monitor demand variance and consider a higher service level factor for critical materials.',
    })
  }

  if (f.isProfitable && f.roi > 0.3) {
    addItem(items, {
      id: 'good-roi',
      level: 'good',
      priority: 40,
      title: 'Annual ROI is attractive',
      metric: `ROI: ${pct(f.roi)}`,
      description:
        'The annual profit is strong relative to the initial investment.',
      recommendation:
        'Keep the assumptions transparent and validate them with a small pilot before scaling.',
    })
  }

  if (feasibilityScore >= 80) {
    addItem(items, {
      id: 'feasibility-good',
      level: 'good',
      priority: 41,
      title: 'Model is feasible',
      metric: `Feasibility score: ${feasibilityScore}/100`,
      description:
        'The model performs well across profitability, payback, capacity, conversion, inventory and quality risk.',
      recommendation:
        'Proceed with a small pilot and track the same metrics monthly.',
    })
  } else if (feasibilityScore < 60) {
    addItem(items, {
      id: 'feasibility-risk',
      level: feasibilityScore < 40 ? 'critical' : 'warning',
      priority: feasibilityScore < 40 ? 5 : 16,
      title: feasibilityClass === 'not-feasible' ? 'Model is not feasible yet' : 'Model is risky',
      metric: `Feasibility score: ${feasibilityScore}/100`,
      description:
        'The combined score shows that several assumptions are fragile at the same time.',
      recommendation:
        'Fix the highest-severity feedback first, then rerun the scenario comparison.',
    })
  }

  return items
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 10)
}

export default generateFeedback
