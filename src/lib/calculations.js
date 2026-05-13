import { scenarioList, scenarioPresets } from '../data/scenarioPresets.js'
import { calculateInventoryMetrics } from './inventoryModels.js'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const finiteOr = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const readValue = (field, fallback = 0) => {
  if (field && typeof field === 'object' && 'value' in field) {
    return finiteOr(Number(field.value), fallback)
  }

  return finiteOr(Number(field), fallback)
}

const sectionValues = (section = {}) =>
  Object.values(section).map((field) => readValue(field, 0))

const sumSection = (section = {}) =>
  sectionValues(section).reduce((total, value) => total + value, 0)

const getInvestment = (data) => data?.investment ?? {}
const getFixedCosts = (data) => data?.fixedCosts ?? {}
const getProduction = (data) => data?.production ?? {}
const getSales = (data) => data?.sales ?? {}

const safeDivide = (numerator, denominator, fallback = null) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback
  }

  return numerator / denominator
}

const cloneData = (data) => JSON.parse(JSON.stringify(data))

const getScenario = (scenarioId = 'realistic') =>
  scenarioPresets[scenarioId] ?? scenarioPresets.realistic

const clampScenarioValue = (field, value) => {
  if (field && typeof field === 'object' && field.unit === 'ratio') {
    return clamp(value, 0, 1)
  }

  return Math.max(0, value)
}

const applyOperation = (currentValue, modifier) => {
  if (modifier.operation === 'multiply') {
    return currentValue * modifier.value
  }

  if (modifier.operation === 'add') {
    return currentValue + modifier.value
  }

  if (modifier.operation === 'set') {
    return modifier.value
  }

  return currentValue
}

const updateScenarioField = (field, modifier) => {
  const currentValue = readValue(field)
  const nextValue = clampScenarioValue(field, applyOperation(currentValue, modifier))

  if (field && typeof field === 'object' && 'value' in field) {
    field.value = nextValue
    return
  }

  return nextValue
}

const applyModifierAtPath = (data, modifier) => {
  const parts = modifier.path.split('.')
  const lastPart = parts.at(-1)
  const parent = parts.slice(0, -1).reduce((node, key) => node?.[key], data)

  if (!parent || typeof parent !== 'object') {
    return []
  }

  if (lastPart === '*') {
    return Object.keys(parent).map((key) => {
      const updatedValue = updateScenarioField(parent[key], modifier)
      if (updatedValue !== undefined) parent[key] = updatedValue
      return `${parts.slice(0, -1).join('.')}.${key}`
    })
  }

  if (!(lastPart in parent)) {
    return []
  }

  const updatedValue = updateScenarioField(parent[lastPart], modifier)
  if (updatedValue !== undefined) parent[lastPart] = updatedValue

  return [modifier.path]
}

export function applyScenario(data, scenarioId = 'realistic') {
  const scenario = getScenario(scenarioId)
  const scenarioData = cloneData(data)
  const appliedModifiers = []

  for (const modifier of scenario.modifiers) {
    const appliedPaths = applyModifierAtPath(scenarioData, modifier)
    appliedModifiers.push(
      ...appliedPaths.map((path) => ({
        ...modifier,
        path,
      })),
    )
  }

  return {
    ...scenarioData,
    scenario: {
      id: scenario.id,
      name: scenario.name,
      label: scenario.label,
      tone: scenario.tone,
      description: scenario.description,
      appliedModifiers,
    },
  }
}

export function calculateInitialInvestment(data) {
  return sumSection(getInvestment(data))
}

export function calculateFixedCosts(data) {
  return sumSection(getFixedCosts(data))
}

export function calculateCustomerJourney(data) {
  const sales = getSales(data)
  const production = getProduction(data)

  const leads = Math.max(0, readValue(sales.monthlyLeads))
  const leadToQuoteRate = clamp(readValue(sales.leadToQuoteRate), 0, 1)
  const quoteToOrderRate = clamp(readValue(sales.quoteToOrderRate), 0, 1)
  const repeatCustomerRate = clamp(readValue(sales.repeatCustomerRate), 0, 1)
  const referralRate = clamp(readValue(sales.referralRate), 0, 1)
  const averageOrdersPerCustomer = Math.max(0, readValue(sales.averageOrdersPerCustomer, 1))
  const averageBatchSize = Math.max(0, readValue(production.averageBatchSize))

  const quotes = leads * leadToQuoteRate
  const newOrders = quotes * quoteToOrderRate
  const repeatOrders = newOrders * repeatCustomerRate
  const referralOrders = newOrders * referralRate
  const totalOrders = (newOrders + repeatOrders + referralOrders) * averageOrdersPerCustomer
  const unitsSold = totalOrders * averageBatchSize

  return {
    leads,
    quotes,
    newOrders,
    repeatOrders,
    referralOrders,
    totalOrders,
    unitsSold,
    conversionRate: safeDivide(totalOrders, leads, 0),
  }
}

export function calculateUnitsSold(data) {
  return calculateCustomerJourney(data).unitsSold
}

export function calculateAvailableMachineHours(data) {
  const production = getProduction(data)
  const workingDays = Math.max(0, readValue(production.workingDaysPerMonth))
  const shiftsPerDay = Math.max(0, readValue(production.shiftsPerDay))
  const hoursPerShift = Math.max(0, readValue(production.hoursPerShift))
  const machineAvailability = clamp(readValue(production.machineAvailability), 0, 1)

  // Available hours show the real productive machine time after availability losses.
  return workingDays * shiftsPerDay * hoursPerShift * machineAvailability
}

export function calculateProductionTime(data, unitsSold = calculateUnitsSold(data)) {
  const production = getProduction(data)
  const machiningTimePerPart = Math.max(0, readValue(production.machiningTimePerPart))
  const setupTimePerOrder = Math.max(0, readValue(production.setupTimePerOrder))
  const orders = calculateCustomerJourney(data).totalOrders

  // Production time combines part machining time and setup time per order.
  return unitsSold * machiningTimePerPart + orders * setupTimePerOrder
}

export function calculateCapacityUtilization(data, unitsSold = calculateUnitsSold(data)) {
  const availableMachineHours = calculateAvailableMachineHours(data)
  const requiredMachineHours = calculateProductionTime(data, unitsSold)

  return safeDivide(requiredMachineHours, availableMachineHours, 0)
}

export function calculateVariableCostPerUnit(data) {
  const production = getProduction(data)
  const sales = getSales(data)

  const materialCost = Math.max(0, readValue(sales.materialCostPerPart))
  const machiningTime = Math.max(0, readValue(production.machiningTimePerPart))
  const energyCostPerHour = Math.max(0, readValue(production.energyCostPerMachineHour))
  const laborCostPerHour = Math.max(0, readValue(production.laborCostPerProductiveHour))
  const toolLife = Math.max(0, readValue(production.toolLife))
  const toolCost = Math.max(0, readValue(production.toolCost))
  const scrapRate = clamp(readValue(production.scrapRate), 0, 1)

  const toolingCost = safeDivide(toolCost, toolLife, 0)
  const energyCost = machiningTime * energyCostPerHour
  const laborCost = machiningTime * laborCostPerHour
  const baseVariableCost = materialCost + toolingCost + energyCost + laborCost
  const scrapAdjustment = baseVariableCost * scrapRate

  // Scrap adjustment shows the extra unit cost caused by unusable parts.
  return {
    materialCost,
    toolingCost,
    energyCost,
    laborCost,
    baseVariableCost,
    scrapAdjustment,
    total: baseVariableCost + scrapAdjustment,
  }
}

export function calculateMonthlyRevenue(data, unitsSold = calculateUnitsSold(data)) {
  const sales = getSales(data)
  const sellingPrice = Math.max(0, readValue(sales.sellingPricePerPart))

  return unitsSold * sellingPrice
}

export function calculateMonthlyCost(data, unitsSold = calculateUnitsSold(data)) {
  const fixedCosts = calculateFixedCosts(data)
  const variableCost = calculateVariableCostPerUnit(data)
  const journey = calculateCustomerJourney(data)
  const packagingPerOrder = Math.max(0, readValue(getSales(data).packagingDeliveryPerOrder))
  const packagingCosts = journey.totalOrders * packagingPerOrder
  const variableCosts = unitsSold * variableCost.total
  const totalCosts = fixedCosts + variableCosts + packagingCosts

  return {
    fixedCosts,
    variableCosts,
    packagingCosts,
    totalCosts,
  }
}

export function calculateMonthlyProfit(data, unitsSold = calculateUnitsSold(data)) {
  const revenue = calculateMonthlyRevenue(data, unitsSold)
  const costs = calculateMonthlyCost(data, unitsSold)

  return revenue - costs.totalCosts
}

export function calculateContributionMargin(data) {
  const sellingPrice = Math.max(0, readValue(getSales(data).sellingPricePerPart))
  const variableCostPerUnit = calculateVariableCostPerUnit(data).total
  const contributionMarginPerUnit = sellingPrice - variableCostPerUnit
  const contributionMarginRatio = safeDivide(contributionMarginPerUnit, sellingPrice, 0)

  return {
    sellingPrice,
    variableCostPerUnit,
    contributionMarginPerUnit,
    contributionMarginRatio,
  }
}

export function calculateBreakEvenUnits(data) {
  const fixedCosts = calculateFixedCosts(data)
  const { contributionMarginPerUnit } = calculateContributionMargin(data)

  if (contributionMarginPerUnit <= 0) {
    return null
  }

  return fixedCosts / contributionMarginPerUnit
}

export function calculateBreakEvenMonths(data) {
  const initialInvestment = calculateInitialInvestment(data)
  const monthlyProfit = calculateMonthlyProfit(data)

  if (monthlyProfit <= 0) {
    return null
  }

  return initialInvestment / monthlyProfit
}

export function calculateROI(data) {
  const initialInvestment = calculateInitialInvestment(data)
  const monthlyProfit = calculateMonthlyProfit(data)
  const annualProfit = monthlyProfit * 12

  return safeDivide(annualProfit, initialInvestment, 0)
}

export function calculatePaybackPeriod(data) {
  return calculateBreakEvenMonths(data)
}

export function calculateScrapCost(data, unitsSold = calculateUnitsSold(data)) {
  const variableCost = calculateVariableCostPerUnit(data)

  return unitsSold * variableCost.scrapAdjustment
}

export function calculateMinimumRecommendedPrice(data, targetMarginRatio = 0.2) {
  const variableCostPerUnit = calculateVariableCostPerUnit(data).total
  const fixedCosts = calculateFixedCosts(data)
  const unitsSold = calculateUnitsSold(data)
  const fixedCostPerUnit = safeDivide(fixedCosts, unitsSold, 0)
  const fullCostPerUnit = variableCostPerUnit + fixedCostPerUnit
  const margin = clamp(targetMarginRatio, 0, 0.95)

  return safeDivide(fullCostPerUnit, 1 - margin, fullCostPerUnit)
}

export function calculateFinancials(data) {
  const customerJourney = calculateCustomerJourney(data)
  const unitsSold = customerJourney.unitsSold
  const initialInvestment = calculateInitialInvestment(data)
  const fixedCosts = calculateFixedCosts(data)
  const variableCostPerUnit = calculateVariableCostPerUnit(data)
  const monthlyRevenue = calculateMonthlyRevenue(data, unitsSold)
  const monthlyCosts = calculateMonthlyCost(data, unitsSold)
  const monthlyProfit = monthlyRevenue - monthlyCosts.totalCosts
  const annualProfit = monthlyProfit * 12
  const contributionMargin = calculateContributionMargin(data)
  const breakEvenUnits = calculateBreakEvenUnits(data)
  const breakEvenMonths = monthlyProfit > 0 ? initialInvestment / monthlyProfit : null
  const roi = safeDivide(annualProfit, initialInvestment, 0)
  const grossMargin = safeDivide(monthlyRevenue - monthlyCosts.variableCosts, monthlyRevenue, 0)
  const netMargin = safeDivide(monthlyProfit, monthlyRevenue, 0)
  const availableMachineHours = calculateAvailableMachineHours(data)
  const requiredMachineHours = calculateProductionTime(data, unitsSold)
  const capacityUtilization = safeDivide(requiredMachineHours, availableMachineHours, 0)
  const scrapCost = calculateScrapCost(data, unitsSold)
  const minimumRecommendedPrice = calculateMinimumRecommendedPrice(data)

  return {
    initialInvestment,
    fixedCosts,
    customerJourney,
    unitsSold,
    monthlyRevenue,
    monthlyVariableCosts: monthlyCosts.variableCosts,
    monthlyPackagingCosts: monthlyCosts.packagingCosts,
    monthlyTotalCosts: monthlyCosts.totalCosts,
    monthlyProfit,
    annualProfit,
    grossMargin,
    netMargin,
    variableCostPerUnit,
    contributionMargin,
    breakEvenUnits,
    breakEvenMonths,
    paybackMonths: breakEvenMonths,
    roi,
    availableMachineHours,
    requiredMachineHours,
    capacityUtilization,
    capacityStatus: capacityUtilization > 1 ? 'over-capacity' : 'within-capacity',
    scrapCost,
    profitAfterScrap: monthlyProfit,
    minimumRecommendedPrice,
    isProfitable: monthlyProfit > 0,
    canReachBreakEven: breakEvenUnits !== null && breakEvenMonths !== null,
  }
}

export function calculateScenarioFinancials(data, scenarioId = 'realistic') {
  const scenarioData = applyScenario(data, scenarioId)
  const financials = calculateFinancials(scenarioData)

  return {
    scenario: scenarioData.scenario,
    data: scenarioData,
    financials,
  }
}

export function calculateScenarioResults(data, scenarioId = 'realistic') {
  const scenarioResult = calculateScenarioFinancials(data, scenarioId)
  const inventory = calculateInventoryMetrics(
    scenarioResult.data,
    scenarioResult.financials.unitsSold,
  )

  return {
    ...scenarioResult,
    inventory,
  }
}

export function calculateScenarioComparison(
  data,
  scenarioIds = scenarioList.map((scenario) => scenario.id),
) {
  return scenarioIds.map((scenarioId) => {
    const result = calculateScenarioResults(data, scenarioId)
    const { financials, inventory, scenario } = result

    return {
      scenario,
      data: result.data,
      financials,
      inventory,
      metrics: {
        monthlyRevenue: financials.monthlyRevenue,
        monthlyProfit: financials.monthlyProfit,
        unitsSold: financials.unitsSold,
        breakEvenUnits: financials.breakEvenUnits,
        paybackMonths: financials.paybackMonths,
        roi: financials.roi,
        capacityUtilization: financials.capacityUtilization,
        stockoutRisk: inventory.stockoutRisk,
      },
    }
  })
}

export default calculateFinancials
