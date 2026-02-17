/**
 * Design Tokens — DPMPTSP Dashboard
 * Single source of truth untuk semua warna, spacing, dan typography.
 * Import file ini di komponen yang butuh token secara programatis
 * (mis. untuk chart color di Recharts yang tidak bisa pakai Tailwind class).
 */

export const C = {
  // ── Brand Navy ──────────────────────────────────────────
  navy:       '#0f2a5e',
  navyMid:    '#1a3a7a',
  navyLight:  '#1e4db7',

  // ── Blue ────────────────────────────────────────────────
  blue:       '#1d4ed8',
  blueLight:  '#3b82f6',
  bluePale:   '#dbeafe',

  // ── Cyan ────────────────────────────────────────────────
  cyan:       '#06b6d4',
  cyanLight:  '#67e8f9',
  cyanPale:   '#cffafe',

  // ── Gold (aksen) ────────────────────────────────────────
  gold:       '#f59e0b',
  goldLight:  '#fcd34d',
  goldPale:   '#fef3c7',

  // ── Teal ────────────────────────────────────────────────
  teal:       '#0d9488',

  // ── Surface & Background ────────────────────────────────
  bg:         '#f0f4ff',
  surface:    '#ffffff',
  surfaceAlt: '#f8faff',

  // ── Border ──────────────────────────────────────────────
  border:       '#e2e8f0',
  borderStrong: '#c7d7f0',

  // ── Text ────────────────────────────────────────────────
  text:     '#0f172a',
  textMid:  '#334155',
  textMute: '#64748b',

  // ── Status ──────────────────────────────────────────────
  green: '#059669',
  red:   '#dc2626',
} as const

/**
 * Warna untuk chart Recharts (urutan untuk bar/line series)
 */
export const CHART_COLORS = {
  PMA:   C.blue,
  PMDN:  C.cyan,
  total: C.navy,
  accent: C.gold,
} as const

/**
 * Palet berurutan untuk ranking (emas, perak, perunggu, dst.)
 */
export const RANK_COLORS = [
  C.gold, C.blue, C.cyan, C.teal, '#7c3aed', '#db2777',
] as const
