import { cncPreset } from './cncPreset'

export const nicheStatus = {
  available: 'available',
  comingSoon: 'coming-soon',
}

export const niches = [
  {
    id: 'cnc-micro-factory',
    name: 'CNC Micro-Factory',
    subtitle: 'Custom machined parts and prototypes',
    status: nicheStatus.available,
    badge: 'Demo Available',
    model: cncPreset,
    description:
      'A small CNC workshop for prototypes and low-volume parts, with investment, cost, capacity, scrap, tooling, inventory and B2B customer journey inputs.',
    audience: ['hardware startups', 'university labs', 'student teams', 'local firms'],
    previewConstants: [
      { label: 'Initial investment', value: 200000, unit: 'lei' },
      { label: 'Fixed costs', value: 15600, unit: 'lei/month' },
      { label: 'Selling price', value: 180, unit: 'lei/part' },
    ],
    tags: ['manufacturing', 'CNC', 'capacity', 'inventory', 'B2B'],
  },
  {
    id: '3d-printing-service',
    name: '3D Printing Service',
    subtitle: 'Additive manufacturing for student and startup prototypes',
    status: nicheStatus.comingSoon,
    badge: 'Coming Soon',
    description:
      'Future model for filament/resin costs, print time, failed prints, post-processing and order batching.',
    previewConstants: [
      { label: 'Printer setup', value: 18000, unit: 'lei' },
      { label: 'Material cost', value: 95, unit: 'lei/kg' },
      { label: 'Failure rate', value: 0.08, unit: 'ratio' },
    ],
    unavailableMessage:
      'This niche is prepared for a future version. The current demo fully models CNC Micro-Factory.',
    tags: ['additive manufacturing', 'prototyping', 'materials'],
  },
  {
    id: 'campus-bike-sharing',
    name: 'Campus Bike-Sharing',
    subtitle: 'Shared mobility service for university campuses',
    status: nicheStatus.comingSoon,
    badge: 'Coming Soon',
    description:
      'Future model for fleet investment, maintenance, subscriptions, utilization and seasonal demand.',
    previewConstants: [
      { label: 'Fleet size', value: 40, unit: 'bikes' },
      { label: 'Maintenance', value: 65, unit: 'lei/bike/month' },
      { label: 'Monthly subscription', value: 35, unit: 'lei/user' },
    ],
    unavailableMessage:
      'This niche is prepared for a future version. The current demo fully models CNC Micro-Factory.',
    tags: ['mobility', 'subscriptions', 'utilization'],
  },
  {
    id: 'technical-maintenance-service',
    name: 'Technical Maintenance Service',
    subtitle: 'Maintenance contracts for small companies',
    status: nicheStatus.comingSoon,
    badge: 'Coming Soon',
    description:
      'Future model for technician hours, travel cost, spare parts, emergency calls and recurring contracts.',
    previewConstants: [
      { label: 'Service contracts', value: 12, unit: 'clients' },
      { label: 'Labor rate', value: 110, unit: 'lei/hour' },
      { label: 'Travel cost', value: 45, unit: 'lei/visit' },
    ],
    unavailableMessage:
      'This niche is prepared for a future version. The current demo fully models CNC Micro-Factory.',
    tags: ['maintenance', 'service', 'recurring revenue'],
  },
  {
    id: 'smart-hardware-product',
    name: 'Smart Hardware Product',
    subtitle: 'Student-built device with assembly and distribution costs',
    status: nicheStatus.comingSoon,
    badge: 'Coming Soon',
    description:
      'Future model for prototyping, bill of materials, assembly labor, testing, warranty and distribution.',
    previewConstants: [
      { label: 'Prototype budget', value: 25000, unit: 'lei' },
      { label: 'Unit BOM', value: 140, unit: 'lei/unit' },
      { label: 'Warranty reserve', value: 0.04, unit: 'ratio' },
    ],
    unavailableMessage:
      'This niche is prepared for a future version. The current demo fully models CNC Micro-Factory.',
    tags: ['hardware', 'BOM', 'assembly'],
  },
  {
    id: 'metrology-testing-lab',
    name: 'Metrology / Testing Lab',
    subtitle: 'Measurement and testing services for engineering teams',
    status: nicheStatus.comingSoon,
    badge: 'Coming Soon',
    description:
      'Future model for equipment investment, calibration, technician time, service pricing and project volume.',
    previewConstants: [
      { label: 'Equipment investment', value: 85000, unit: 'lei' },
      { label: 'Calibration reserve', value: 900, unit: 'lei/month' },
      { label: 'Service price', value: 380, unit: 'lei/project' },
    ],
    unavailableMessage:
      'This niche is prepared for a future version. The current demo fully models CNC Micro-Factory.',
    tags: ['metrology', 'testing', 'quality'],
  },
]

export const availableNiche = niches.find((niche) => niche.status === nicheStatus.available)

export function getNicheById(id) {
  return niches.find((niche) => niche.id === id)
}

export default niches
