/**
 * Konstanta statis yang tidak berasal dari API.
 * Data yang bisa berubah (daftar sektor, tahun, dll.) ambil dari API via useFilterOptions().
 */

export const APP_NAME = 'Dashboard Investasi DPMPTSP Jatim'

export const CURRENCY_OPTIONS = [
  { label: 'IDR (Triliun)', value: 'RP'  as const },
  { label: 'USD (Miliar)', value: 'USD' as const },
]

export const STATUS_OPTIONS = [
  { label: 'PMA (Asing)',    value: 'PMA'  as const },
  { label: 'PMDN (Domestik)', value: 'PMDN' as const },
]

export const WILAYAH_MODES = [
  { label: 'Wilayah Perpres 80', value: 'Perpres80' },
  { label: 'Bakorwil',           value: 'Bakorwil' },
]

/** Warna chart Recharts */
export const CHART_PALETTE = {
  PMA:  '#1d4ed8',
  PMDN: '#06b6d4',
} as const

/** Warna gradient untuk bar ranking (emas, perak, dll.) */
export const RANK_PALETTE = [
  '#f59e0b',
  '#1d4ed8',
  '#06b6d4',
  '#0d9488',
  '#7c3aed',
  '#db2777',
  '#64748b',
  '#64748b',
  '#64748b',
  '#64748b',
]
