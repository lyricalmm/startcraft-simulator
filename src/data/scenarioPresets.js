export const scenarioPresets = {
  realistic: {
    id: 'realistic',
    name: 'Realistic',
    label: 'Realistic',
    tone: 'baseline',
    description:
      'Uses the base educational assumptions and acts as the starting point for analysis.',
    modifiers: [],
  },
  pessimistic: {
    id: 'pessimistic',
    name: 'Pessimistic',
    label: 'Pessimistic',
    tone: 'risk',
    description:
      'Tests lower demand, higher costs and weaker operational efficiency.',
    modifiers: [
      {
        path: 'sales.monthlyLeads',
        operation: 'multiply',
        value: 0.7,
        explanation: 'Leads decrease by 30%.',
      },
      {
        path: 'sales.quoteToOrderRate',
        operation: 'multiply',
        value: 0.8,
        explanation: 'Quote-to-order conversion decreases by 20%.',
      },
      {
        path: 'sales.sellingPricePerPart',
        operation: 'multiply',
        value: 0.95,
        explanation: 'Selling price decreases by 5%.',
      },
      {
        path: 'sales.materialCostPerPart',
        operation: 'multiply',
        value: 1.1,
        explanation: 'Material cost per part increases by 10%.',
      },
      {
        path: 'sales.packagingDeliveryPerOrder',
        operation: 'multiply',
        value: 1.1,
        explanation: 'Packaging and delivery cost increases by 10%.',
      },
      {
        path: 'fixedCosts.*',
        operation: 'multiply',
        value: 1.1,
        explanation: 'Monthly fixed costs increase by 10%.',
      },
      {
        path: 'inventory.materialCostPerKg',
        operation: 'multiply',
        value: 1.1,
        explanation: 'Raw material cost per kg increases by 10%.',
      },
      {
        path: 'production.scrapRate',
        operation: 'add',
        value: 0.05,
        explanation: 'Scrap rate increases by 5 percentage points.',
      },
      {
        path: 'production.machineAvailability',
        operation: 'multiply',
        value: 0.9,
        explanation: 'Machine availability decreases by 10%.',
      },
      {
        path: 'fixedCosts.maintenanceReserve',
        operation: 'multiply',
        value: 1.1,
        explanation: 'Maintenance reserve increases by 10%.',
      },
    ],
  },
  optimistic: {
    id: 'optimistic',
    name: 'Optimistic',
    label: 'Optimistic',
    tone: 'growth',
    description:
      'Models stronger demand, better conversion and improved operational efficiency.',
    modifiers: [
      {
        path: 'sales.monthlyLeads',
        operation: 'multiply',
        value: 1.25,
        explanation: 'Leads increase by 25%.',
      },
      {
        path: 'sales.quoteToOrderRate',
        operation: 'add',
        value: 0.02,
        explanation: 'Quote-to-order conversion increases by 2 percentage points.',
      },
      {
        path: 'sales.sellingPricePerPart',
        operation: 'multiply',
        value: 1.05,
        explanation: 'Selling price increases by 5%.',
      },
      {
        path: 'sales.materialCostPerPart',
        operation: 'multiply',
        value: 0.95,
        explanation: 'Material cost per part decreases by 5%.',
      },
      {
        path: 'sales.packagingDeliveryPerOrder',
        operation: 'multiply',
        value: 0.95,
        explanation: 'Packaging and delivery cost decreases by 5%.',
      },
      {
        path: 'fixedCosts.*',
        operation: 'multiply',
        value: 0.95,
        explanation: 'Monthly fixed costs decrease by 5%.',
      },
      {
        path: 'inventory.materialCostPerKg',
        operation: 'multiply',
        value: 0.95,
        explanation: 'Raw material cost per kg decreases by 5%.',
      },
      {
        path: 'production.scrapRate',
        operation: 'add',
        value: -0.02,
        explanation: 'Scrap rate decreases by 2 percentage points.',
      },
      {
        path: 'production.machineAvailability',
        operation: 'multiply',
        value: 1.05,
        explanation: 'Machine availability increases by 5%.',
      },
      {
        path: 'sales.referralRate',
        operation: 'add',
        value: 0.02,
        explanation: 'Referral rate increases by 2 percentage points.',
      },
    ],
  },
}

export const scenarioOrder = ['pessimistic', 'realistic', 'optimistic']

export const scenarioList = scenarioOrder.map((id) => scenarioPresets[id])

export default scenarioPresets
