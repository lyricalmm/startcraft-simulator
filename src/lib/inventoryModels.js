// ─── helpers (mirror pattern from calculations.js, kept local for independence) ───

const finiteOr = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const readValue = (field, fallback = 0) => {
  if (field && typeof field === 'object' && 'value' in field) {
    return finiteOr(Number(field.value), fallback)
  }
  return finiteOr(Number(field), fallback)
}

const safeDivide = (numerator, denominator, fallback = null) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback
  }
  return numerator / denominator
}

const getInventory = (data) => data?.inventory ?? {}
const getSales = (data) => data?.sales ?? {}

// ─── monthly material need ───────────────────────────────────────────────────

/**
 * Estimated monthly raw material need based on units produced and kg per unit.
 * monthlyMaterialNeed = unitsSold × (materialCostPerPart / materialCostPerKg)
 * Fallback: use the preset monthlyMaterialDemandKg directly.
 */
export function calculateMaterialNeed(data, unitsSold = 0) {
  const inventory = getInventory(data)
  const sales = getSales(data)

  const presetDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const materialCostPerPart = Math.max(0, readValue(sales.materialCostPerPart))
  const materialCostPerKg = Math.max(0, readValue(inventory.materialCostPerKg))

  if (unitsSold > 0 && materialCostPerKg > 0) {
    const kgPerPart = safeDivide(materialCostPerPart, materialCostPerKg, 0)
    return unitsSold * kgPerPart
  }

  return presetDemandKg
}

// ─── safety stock ────────────────────────────────────────────────────────────

/**
 * Safety Stock = serviceLevelFactor × demandStdDevPerDay × √(supplierLeadTimeDays)
 * Covers demand variability during replenishment lead time at the chosen service level.
 * Example: Z=1.65 → 95% service level (stockout only 5% of cycles).
 */
export function calculateSafetyStock(data) {
  const inventory = getInventory(data)

  const serviceLevelFactor = Math.max(0, readValue(inventory.serviceLevelFactor, 1.65))
  const demandStdDevPerDay = Math.max(0, readValue(inventory.demandStdDevPerDay))
  const supplierLeadTimeDays = Math.max(0, readValue(inventory.supplierLeadTimeDays))

  return serviceLevelFactor * demandStdDevPerDay * Math.sqrt(supplierLeadTimeDays)
}

// ─── reorder point ───────────────────────────────────────────────────────────

/**
 * Reorder Point = averageDailyDemand × supplierLeadTimeDays + safetyStock
 * Order must be placed when stock reaches this level to avoid stockout during lead time.
 */
export function calculateReorderPoint(data, safetyStock = null) {
  const inventory = getInventory(data)

  const monthlyDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const workingDays = Math.max(1, readValue(inventory.workingDaysPerMonth, 22))
  const supplierLeadTimeDays = Math.max(0, readValue(inventory.supplierLeadTimeDays))

  const averageDailyDemand = safeDivide(monthlyDemandKg, workingDays, 0)
  const ss = safetyStock !== null ? safetyStock : calculateSafetyStock(data)

  return averageDailyDemand * supplierLeadTimeDays + ss
}

// ─── Economic Order Quantity ─────────────────────────────────────────────────

/**
 * EOQ = √( 2 × annualDemand × orderingCost / holdingCostPerUnit )
 * holdingCostPerUnit = materialCostPerKg × holdingCostRate (annual fraction)
 * Minimises the total cost of ordering + holding inventory.
 */
export function calculateEOQ(data) {
  const inventory = getInventory(data)

  const monthlyDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const annualDemandKg = monthlyDemandKg * 12
  const orderingCost = Math.max(0, readValue(inventory.orderingCost))
  const materialCostPerKg = Math.max(0, readValue(inventory.materialCostPerKg))
  const holdingCostRate = Math.max(0, readValue(inventory.holdingCostRate))

  const holdingCostPerUnit = materialCostPerKg * holdingCostRate

  if (holdingCostPerUnit <= 0 || annualDemandKg <= 0) return null

  return Math.sqrt((2 * annualDemandKg * orderingCost) / holdingCostPerUnit)
}

// ─── holding cost ─────────────────────────────────────────────────────────────

/**
 * Annual holding cost = (EOQ / 2) × materialCostPerKg × holdingCostRate
 * Average inventory is assumed to be EOQ/2 (cycle stock model).
 */
export function calculateHoldingCost(data, eoq = null) {
  const inventory = getInventory(data)

  const resolvedEOQ = eoq !== null ? eoq : calculateEOQ(data)
  const materialCostPerKg = Math.max(0, readValue(inventory.materialCostPerKg))
  const holdingCostRate = Math.max(0, readValue(inventory.holdingCostRate))

  if (!resolvedEOQ) return 0

  const averageInventoryKg = resolvedEOQ / 2
  const averageInventoryValue = averageInventoryKg * materialCostPerKg

  // Annual holding cost — divide by 12 for monthly equivalent
  return averageInventoryValue * holdingCostRate
}

// ─── ordering cost total (annual) ─────────────────────────────────────────────

/**
 * Total annual ordering cost = (annualDemand / EOQ) × orderingCost
 * At EOQ, ordering cost equals holding cost — that's the optimum.
 */
export function calculateOrderingCostTotal(data, eoq = null) {
  const inventory = getInventory(data)

  const resolvedEOQ = eoq !== null ? eoq : calculateEOQ(data)
  const monthlyDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const annualDemandKg = monthlyDemandKg * 12
  const orderingCost = Math.max(0, readValue(inventory.orderingCost))

  if (!resolvedEOQ || resolvedEOQ <= 0) return null

  return safeDivide(annualDemandKg, resolvedEOQ, 0) * orderingCost
}

// ─── stockout risk ────────────────────────────────────────────────────────────

/**
 * Qualitative risk assessment: compares safety stock to the demand variation
 * that could occur during lead time (demandStdDevPerDay × √leadTime).
 * Returns: 'high' | 'medium' | 'low'
 */
export function calculateStockoutRisk(data, safetyStock = null) {
  const inventory = getInventory(data)

  const ss = safetyStock !== null ? safetyStock : calculateSafetyStock(data)
  const demandStdDevPerDay = Math.max(0, readValue(inventory.demandStdDevPerDay))
  const supplierLeadTimeDays = Math.max(0, readValue(inventory.supplierLeadTimeDays))

  // Demand variability during lead time
  const leadTimeDemandVariability = demandStdDevPerDay * Math.sqrt(supplierLeadTimeDays)

  if (ss <= 0) return 'high'
  if (ss < leadTimeDemandVariability * 0.5) return 'high'
  if (ss < leadTimeDemandVariability) return 'medium'
  return 'low'
}

// ─── sawtooth chart data ──────────────────────────────────────────────────────

/**
 * Generates the classic inventory sawtooth pattern for visualisation.
 * Returns an array of { day, stock, event } points covering 2 full order cycles.
 */
export function generateInventorySawtoothData(data, eoq = null, safetyStock = null) {
  const inventory = getInventory(data)

  const resolvedEOQ = (eoq !== null ? eoq : calculateEOQ(data)) ?? 0
  const ss = safetyStock !== null ? safetyStock : calculateSafetyStock(data)
  const monthlyDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const workingDays = Math.max(1, readValue(inventory.workingDaysPerMonth, 22))
  const supplierLeadTimeDays = Math.max(0, readValue(inventory.supplierLeadTimeDays))
  const reorderPoint = calculateReorderPoint(data, ss)

  const dailyDemand = safeDivide(monthlyDemandKg, workingDays, 0)

  if (dailyDemand <= 0 || resolvedEOQ <= 0) return []

  const cycleDays = Math.ceil(safeDivide(resolvedEOQ, dailyDemand, 30))
  const totalDays = cycleDays * 2 + supplierLeadTimeDays

  const points = []
  let stock = resolvedEOQ + ss
  let pendingDeliveryDay = null

  for (let day = 0; day <= totalDays; day++) {
    if (pendingDeliveryDay !== null && day >= pendingDeliveryDay) {
      stock += resolvedEOQ
      pendingDeliveryDay = null
    }

    const event =
      pendingDeliveryDay === null && stock - dailyDemand <= reorderPoint
        ? 'reorder'
        : day === pendingDeliveryDay
          ? 'delivery'
          : null

    if (event === 'reorder') {
      pendingDeliveryDay = day + supplierLeadTimeDays
    }

    points.push({
      day,
      stock: Math.max(0, Math.round(stock)),
      reorderPoint: Math.round(reorderPoint),
      safetyStock: Math.round(ss),
      event,
    })

    stock = Math.max(0, stock - dailyDemand)
  }

  return points
}

// ─── aggregate inventory metrics ─────────────────────────────────────────────

/**
 * Main entry point: run all inventory calculations and return a single results object.
 * Pass unitsSold from calculateFinancials to keep the material need consistent.
 */
export function calculateInventoryMetrics(data, unitsSold = 0) {
  const safetyStock = calculateSafetyStock(data)
  const eoq = calculateEOQ(data)
  const reorderPoint = calculateReorderPoint(data, safetyStock)
  const holdingCost = calculateHoldingCost(data, eoq)
  const orderingCostTotal = calculateOrderingCostTotal(data, eoq)
  const stockoutRisk = calculateStockoutRisk(data, safetyStock)
  const materialNeedKg = calculateMaterialNeed(data, unitsSold)
  const sawtoothData = generateInventorySawtoothData(data, eoq, safetyStock)

  const inventory = getInventory(data)
  const currentStockKg = Math.max(0, readValue(inventory.currentStockKg))
  const materialCostPerKg = Math.max(0, readValue(inventory.materialCostPerKg))
  const monthlyDemandKg = Math.max(0, readValue(inventory.monthlyMaterialDemandKg))
  const orderingCost = Math.max(0, readValue(inventory.orderingCost))
  const workingDays = Math.max(1, readValue(inventory.workingDaysPerMonth, 22))

  const averageDailyDemand = safeDivide(monthlyDemandKg, workingDays, 0)
  const monthlyMaterialCost = materialNeedKg * materialCostPerKg
  const ordersPerMonth = eoq ? safeDivide(monthlyDemandKg, eoq, 0) : null
  const monthlyOrderingCost = ordersPerMonth !== null ? ordersPerMonth * orderingCost : null

  return {
    safetyStock,
    reorderPoint,
    eoq,
    holdingCost,
    orderingCostTotal,
    ordersPerMonth,
    monthlyOrderingCost,
    stockoutRisk,
    materialNeedKg,
    monthlyMaterialCost,
    currentStockKg,
    averageDailyDemand,
    sawtoothData,
    // convenience flags for feedback engine
    isStockoutRiskHigh: stockoutRisk === 'high',
    isStockoutRiskMedium: stockoutRisk === 'medium',
  }
}

export default calculateInventoryMetrics
