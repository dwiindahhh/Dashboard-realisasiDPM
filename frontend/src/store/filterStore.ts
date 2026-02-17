import { create } from 'zustand'
import type { FilterParams } from '@/hooks/useDashboard'

/**
 * Global filter state — diakses oleh semua chart dan sidebar.
 * Menggunakan Zustand agar tidak perlu prop drilling.
 *
 * Cara pakai:
 *   const { filter, setCurrency } = useFilterStore()
 */

interface FilterStore {
  filter: FilterParams

  // Actions
  setCurrency:  (c: 'RP' | 'USD') => void
  setStatus:    (s: ('PMA' | 'PMDN')[]) => void
  setTahun:     (t: number[]) => void
  setSektor:    (s: string[]) => void
  setPerpres:   (p: string[]) => void
  setBarakorwil:(b: string[]) => void
  setNegara:    (n: string[]) => void
  setWilayah:   (w: string) => void
  resetAll:     (defaults: Partial<FilterParams>) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filter: {
    currency:  'RP',
    status:    ['PMA', 'PMDN'],
    tahun:     [],       // [] = semua tahun (diisi dari server via useFilterOptions)
    sektor:    [],       // [] = semua sektor
    wilayah:   'Perpres80',
    perpres:   [],
    bakorwil:  [],
    negara:    [],
  },

  setCurrency:   (currency)  => set((s) => ({ filter: { ...s.filter, currency } })),
  setStatus:     (status)    => set((s) => ({ filter: { ...s.filter, status } })),
  setTahun:      (tahun)     => set((s) => ({ filter: { ...s.filter, tahun } })),
  setSektor:     (sektor)    => set((s) => ({ filter: { ...s.filter, sektor } })),
  setPerpres:    (perpres)   => set((s) => ({ filter: { ...s.filter, perpres } })),
  setBarakorwil: (bakorwil)  => set((s) => ({ filter: { ...s.filter, bakorwil } })),
  setNegara:     (negara)    => set((s) => ({ filter: { ...s.filter, negara } })),
  setWilayah:    (wilayah)   => set((s) => ({ filter: { ...s.filter, wilayah } })),

  resetAll: (defaults) =>
    set((s) => ({
      filter: {
        ...s.filter,
        status:   ['PMA', 'PMDN'],
        negara:   [],
        ...defaults,
      },
    })),
}))
