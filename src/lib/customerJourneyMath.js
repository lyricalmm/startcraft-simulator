const finiteOr = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const readValue = (field, fallback = 0) => {
  if (field && typeof field === 'object' && 'value' in field) {
    return finiteOr(Number(field.value), fallback)
  }

  return finiteOr(Number(field), fallback)
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const safeDivide = (numerator, denominator, fallback = 0) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback
  }

  return numerator / denominator
}

const getSales = (data) => data?.sales ?? {}
const getProduction = (data) => data?.production ?? {}

const fallbackStageMeta = {
  awareness: {
    name: 'Awareness',
    customerAction: 'Discovers the CNC workshop through referrals, university networks or search.',
    painPoint: 'Low visibility makes qualified leads scarce.',
    businessImpact: 'Sets the top of the demand funnel.',
  },
  interest: {
    name: 'Interest',
    customerAction: 'Requests information, capabilities or a quotation.',
    painPoint: 'Unclear offer details reduce quote requests.',
    businessImpact: 'Turns leads into measurable commercial opportunities.',
  },
  evaluation: {
    name: 'Evaluation',
    customerAction: 'Compares price, lead time, tolerances, materials and trust signals.',
    painPoint: 'Weak value communication lowers quote-to-order conversion.',
    businessImpact: 'Controls how many quotes become paid orders.',
  },
  decision: {
    name: 'Decision',
    customerAction: 'Places an order for prototype or low-volume CNC parts.',
    painPoint: 'Payment terms and delivery time can block purchase decisions.',
    businessImpact: 'Determines monthly order volume and unit demand.',
  },
  use: {
    name: 'Use',
    customerAction: 'Receives, tests and integrates the machined parts.',
    painPoint: 'Scrap, rework or tolerance issues damage trust.',
    businessImpact: 'Quality performance shapes retention and referrals.',
  },
  feedback: {
    name: 'Feedback / Repeat',
    customerAction: 'Returns with new orders or recommends the workshop.',
    painPoint: 'No follow-up reduces repeat and referral revenue.',
    businessImpact: 'Reduces dependence on new leads.',
  },
}

function stageMeta(data, id) {
  const configuredStage = data?.customerJourney?.stages?.find((stage) => stage.id === id)
  return {
    ...fallbackStageMeta[id],
    ...configuredStage,
    id,
  }
}

export function calculateCustomerJourneyMetrics(data) {
  const sales = getSales(data)
  const production = getProduction(data)

  const leads = Math.max(0, readValue(sales.monthlyLeads))
  const leadToQuoteRate = clamp(readValue(sales.leadToQuoteRate), 0, 1)
  const quoteToOrderRate = clamp(readValue(sales.quoteToOrderRate), 0, 1)
  const repeatCustomerRate = clamp(readValue(sales.repeatCustomerRate), 0, 1)
  const referralRate = clamp(readValue(sales.referralRate), 0, 1)
  const averageOrdersPerCustomer = Math.max(0, readValue(sales.averageOrdersPerCustomer, 1))
  const averageBatchSize = Math.max(0, readValue(production.averageBatchSize))
  const sellingPricePerPart = Math.max(0, readValue(sales.sellingPricePerPart))
  const reworkRate = clamp(readValue(production.reworkRate), 0, 1)
  const scrapRate = clamp(readValue(production.scrapRate), 0, 1)

  // Funnel logic connects customer behavior directly to orders, units and revenue.
  const interestedCustomers = leads * leadToQuoteRate
  const quoteRequests = interestedCustomers
  const newOrders = quoteRequests * quoteToOrderRate
  const repeatOrders = newOrders * repeatCustomerRate
  const referralOrders = newOrders * referralRate
  const totalOrders = (newOrders + repeatOrders + referralOrders) * averageOrdersPerCustomer
  const unitsSold = totalOrders * averageBatchSize
  const estimatedMonthlyRevenue = unitsSold * sellingPricePerPart

  return {
    leads,
    interestedCustomers,
    quoteRequests,
    newOrders,
    repeatOrders,
    referralOrders,
    totalOrders,
    unitsSold,
    estimatedMonthlyRevenue,
    leadToQuoteRate,
    quoteToOrderRate,
    repeatCustomerRate,
    referralRate,
    averageOrdersPerCustomer,
    averageBatchSize,
    sellingPricePerPart,
    reworkRate,
    scrapRate,
    overallLeadToOrderRate: safeDivide(totalOrders, leads, 0),
  }
}

export function buildCustomerJourneyStages(data, financials = null) {
  const metrics = calculateCustomerJourneyMetrics(data)
  const revenue = financials?.monthlyRevenue ?? metrics.estimatedMonthlyRevenue
  const revenuePerOrder = safeDivide(revenue, metrics.totalOrders, 0)

  return [
    {
      ...stageMeta(data, 'awareness'),
      value: metrics.leads,
      unit: 'leads',
      indicatorLabel: 'Monthly leads',
      conversionToNext: metrics.leadToQuoteRate,
      impactValue: revenue,
      impactLabel: 'potential revenue baseline',
    },
    {
      ...stageMeta(data, 'interest'),
      value: metrics.quoteRequests,
      unit: 'quotes',
      indicatorLabel: 'Quote requests',
      conversionToNext: metrics.quoteToOrderRate,
      impactValue: metrics.quoteRequests * metrics.quoteToOrderRate * revenuePerOrder,
      impactLabel: 'pipeline value after decision rate',
    },
    {
      ...stageMeta(data, 'evaluation'),
      value: metrics.newOrders,
      unit: 'new orders',
      indicatorLabel: 'New orders',
      conversionToNext: safeDivide(metrics.totalOrders, metrics.newOrders, 0),
      impactValue: metrics.newOrders * revenuePerOrder,
      impactLabel: 'new-order revenue base',
    },
    {
      ...stageMeta(data, 'decision'),
      value: metrics.totalOrders,
      unit: 'orders',
      indicatorLabel: 'Total orders',
      conversionToNext: safeDivide(metrics.unitsSold, metrics.totalOrders, 0),
      impactValue: revenue,
      impactLabel: 'monthly revenue from accepted orders',
    },
    {
      ...stageMeta(data, 'use'),
      value: metrics.unitsSold,
      unit: 'parts',
      indicatorLabel: 'Units delivered',
      conversionToNext: 1 - metrics.reworkRate,
      impactValue: revenue * (1 - metrics.scrapRate),
      impactLabel: 'quality-adjusted revenue signal',
    },
    {
      ...stageMeta(data, 'feedback'),
      value: metrics.repeatOrders + metrics.referralOrders,
      unit: 'repeat/referral orders',
      indicatorLabel: 'Repeat + referral orders',
      conversionToNext: null,
      impactValue: (metrics.repeatOrders + metrics.referralOrders) * revenuePerOrder,
      impactLabel: 'relationship-driven revenue',
    },
  ]
}

export function summarizeCustomerJourney(data, financials = null) {
  const metrics = calculateCustomerJourneyMetrics(data)
  const stages = buildCustomerJourneyStages(data, financials)
  const revenue = financials?.monthlyRevenue ?? metrics.estimatedMonthlyRevenue

  return {
    metrics,
    stages,
    summary: {
      leads: metrics.leads,
      quoteRequests: metrics.quoteRequests,
      totalOrders: metrics.totalOrders,
      unitsSold: metrics.unitsSold,
      estimatedMonthlyRevenue: revenue,
      overallLeadToOrderRate: metrics.overallLeadToOrderRate,
      repeatAndReferralShare: safeDivide(
        metrics.repeatOrders + metrics.referralOrders,
        metrics.totalOrders,
        0,
      ),
    },
  }
}

export default summarizeCustomerJourney
