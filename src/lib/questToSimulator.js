// Converts a completed quest result into simulator input adjustments.
// Safe to import — does not modify any external state.

import { cncQuestData } from '../data/cncQuestData'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function getQuestAdjustments(questResult) {
  if (!questResult?.completed) return null

  const mission4     = cncQuestData.missions[3]
  const strategyChoice = mission4.choices.find((c) => c.id === questResult.chosenStrategy)

  const base = strategyChoice?.simulatorModifiers ?? {
    conversionRateModifier: 0,
    priceModifier: 0,
    scrapRiskModifier: 0,
    retentionRateModifier: 0,
  }

  return {
    conversionRateModifier: clamp(base.conversionRateModifier, -0.15, 0.15),
    priceModifier:          clamp(base.priceModifier,          -0.15, 0.20),
    scrapRiskModifier:      clamp(base.scrapRiskModifier,      -0.05, 0.10),
    retentionRateModifier:  clamp(base.retentionRateModifier,  -0.10, 0.10),
    capacityRiskModifier:   0,
  }
}

// Returns a deep clone of baseData with quest adjustments applied.
// baseData is the raw cncPreset — never mutated.
export function applyQuestAdjustments(baseData, questResult) {
  if (!questResult?.completed) return baseData

  const adj = getQuestAdjustments(questResult)
  if (!adj) return baseData

  const data = JSON.parse(JSON.stringify(baseData))

  if (data.customerJourney?.conversionRate) {
    data.customerJourney.conversionRate.value = clamp(
      data.customerJourney.conversionRate.value + adj.conversionRateModifier,
      0.05,
      0.95,
    )
  }

  if (data.customerJourney?.retentionRate) {
    data.customerJourney.retentionRate.value = clamp(
      data.customerJourney.retentionRate.value + adj.retentionRateModifier,
      0.05,
      0.95,
    )
  }

  if (data.sales?.sellingPrice) {
    data.sales.sellingPrice.value = Math.round(
      data.sales.sellingPrice.value * (1 + adj.priceModifier),
    )
  }

  if (data.production?.scrapRate) {
    data.production.scrapRate.value = clamp(
      data.production.scrapRate.value + adj.scrapRiskModifier,
      0.01,
      0.20,
    )
  }

  return data
}

// Human-readable summary of applied adjustments for the simulator banner.
export function describeAdjustments(questResult) {
  const adj = getQuestAdjustments(questResult)
  if (!adj) return []

  const lines = []
  if (adj.conversionRateModifier !== 0)
    lines.push(`Conversion rate ${adj.conversionRateModifier > 0 ? '+' : ''}${(adj.conversionRateModifier * 100).toFixed(0)}%`)
  if (adj.priceModifier !== 0)
    lines.push(`Selling price ${adj.priceModifier > 0 ? '+' : ''}${(adj.priceModifier * 100).toFixed(0)}%`)
  if (adj.retentionRateModifier !== 0)
    lines.push(`Retention rate ${adj.retentionRateModifier > 0 ? '+' : ''}${(adj.retentionRateModifier * 100).toFixed(0)}%`)
  if (adj.scrapRiskModifier !== 0)
    lines.push(`Scrap risk ${adj.scrapRiskModifier > 0 ? '+' : ''}${(adj.scrapRiskModifier * 100).toFixed(0)}%`)
  return lines
}
