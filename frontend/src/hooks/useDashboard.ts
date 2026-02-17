import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────
export interface FilterParams {
  tahun?:   number[]
  sektor?:  string[]
  status?:  ('PMA' | 'PMDN')[]
  wilayah?: string
  perpres?: string[]
  bakorwil?: string[]
  negara?:  string[]
  currency: 'RP' | 'USD'
}

export interface KpiData {
  total:  number
  pma:    number
  pmdn:   number
  tki:    number
  totalGrowth: number   // persen vs tahun sebelumnya
  pmaGrowth:   number
  pmdnGrowth:  number
  tkiGrowth:   number
}

export interface BarTahunItem {
  tahun: number
  PMA:   number
  PMDN:  number
}

export interface SektorItem {
  sektor: string
  PMA:    number
  PMDN:   number
}

export interface KabKotaItem {
  kab:   string
  total: number
  persen: number
}

export interface NegaraItem {
  negara: string
  nilai:  number
  persen: number
}

export interface FilterOptions {
  tahun:    number[]
  sektor:   string[]
  status:   string[]
  perpres:  string[]
  bakorwil: string[]
  negara:   string[]
}

// ── Query Keys ───────────────────────────────────────────────────────
// Penamaan konsisten agar invalidasi cache mudah
export const QUERY_KEYS = {
  kpi:        (f: FilterParams) => ['kpi',     f] as const,
  barTahun:   (f: FilterParams) => ['barTahun', f] as const,
  sektor:     (f: FilterParams) => ['sektor',   f] as const,
  kabkota:    (f: FilterParams) => ['kabkota',  f] as const,
  negara:     (f: FilterParams) => ['negara',   f] as const,
  options:    ()                => ['options']    as const,
}

// ── Hooks ────────────────────────────────────────────────────────────

/** KPI utama: total, PMA, PMDN, TKI, dan growth % */
export function useKpi(filter: FilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.kpi(filter),
    queryFn: () =>
      api.post<KpiData>('/dashboard/kpi', filter).then((r) => r.data),
  })
}

/** Data bar chart per tahun */
export function useBarTahun(filter: FilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.barTahun(filter),
    queryFn: () =>
      api.post<BarTahunItem[]>('/dashboard/bar-tahun', filter).then((r) => r.data),
  })
}

/** Realisasi per sektor */
export function useSektor(filter: FilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.sektor(filter),
    queryFn: () =>
      api.post<SektorItem[]>('/dashboard/sektor', filter).then((r) => r.data),
  })
}

/** Ranking Kab/Kota Top 10 */
export function useKabKota(filter: FilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.kabkota(filter),
    queryFn: () =>
      api.post<KabKotaItem[]>('/dashboard/kabkota', filter).then((r) => r.data),
  })
}

/** Ranking Negara Asal PMA */
export function useNegaraPma(filter: FilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.negara(filter),
    queryFn: () =>
      api.post<NegaraItem[]>('/dashboard/negara', filter).then((r) => r.data),
    // Hanya fetch kalau status hanya PMA
    enabled: filter.status?.includes('PMA') && filter.status.length === 1,
  })
}

/** Opsi filter (tahun, sektor, dll.) dari server */
export function useFilterOptions() {
  return useQuery({
    queryKey: QUERY_KEYS.options(),
    queryFn: () =>
      api.get<FilterOptions>('/dashboard/options').then((r) => r.data),
    staleTime: 60 * 60 * 1000, // Cache 1 jam — jarang berubah
  })
}
