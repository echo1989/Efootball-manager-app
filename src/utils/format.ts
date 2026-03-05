export function formatNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return '0'
  return Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatCurrency(value: number): string {
  return '€ ' + formatNumber(value)
}

export function parseCurrency(value: string): number {
  if (!value) return 0
  return Number(value.toString().replace(/\./g, ''))
}
