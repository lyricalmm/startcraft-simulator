export const formatCurrency = (value, currency = 'RON') =>
  new Intl.NumberFormat('ro-RO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)

export const formatPercent = (value, decimals = 1) =>
  `${(value * 100).toFixed(decimals)}%`

export const formatNumber = (value, decimals = 0) =>
  new Intl.NumberFormat('ro-RO', { maximumFractionDigits: decimals }).format(value)
