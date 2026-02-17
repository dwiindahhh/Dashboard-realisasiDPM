/**
 * Format angka ke format Indonesia (titik ribuan, koma desimal).
 * Contoh: formatIDR(1234567.89) → "1.234.567,89"
 */
export function formatIDR(value: number, decimals = 2): string {
  return value
    .toFixed(decimals)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Format nilai investasi lengkap dengan satuan.
 * currency = 'RP'  → "Rp 103,50 T"
 * currency = 'USD' → "US$ 6,72 M"
 */
export function formatInvestasi(
  valueTriliun: number,
  currency: 'RP' | 'USD',
): string {
  if (currency === 'RP') {
    return `Rp ${formatIDR(valueTriliun)} T`
  }
  // Konversi Triliun Rp → Miliar USD (asumsi kurs ~15.500)
  const mUSD = (valueTriliun * 1_000_000) / 15_500 / 1_000_000
  return `US$ ${formatIDR(mUSD)} M`
}

/**
 * Format angka besar ke satuan pendek.
 * Contoh: 287432 → "287,4K"
 */
export function formatShort(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

/**
 * Potong teks panjang dengan ellipsis.
 */
export function truncate(text: string, maxLen = 28): string {
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1).trimEnd() + '…'
}

/**
 * Format growth percentage dengan tanda + atau -.
 */
export function formatGrowth(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

/**
 * Gabungkan class names (pengganti clsx sederhana).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
