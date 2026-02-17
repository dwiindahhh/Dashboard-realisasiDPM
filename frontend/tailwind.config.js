/** @type {import('tailwindcss').Config} */
export default {
  // Scan semua file di src/ untuk class Tailwind yang dipakai
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ── Design Tokens DPMPTSP ─────────────────────────────────
      colors: {
        navy: {
          DEFAULT: '#0f2a5e',
          mid:     '#1a3a7a',
          light:   '#1e4db7',
        },
        brand: {
          blue:      '#1d4ed8',
          blueLight: '#3b82f6',
          bluePale:  '#dbeafe',
          cyan:      '#06b6d4',
          cyanLight: '#67e8f9',
          cyanPale:  '#cffafe',
          gold:      '#f59e0b',
          goldLight: '#fcd34d',
          goldPale:  '#fef3c7',
          teal:      '#0d9488',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt:     '#f8faff',
          bg:      '#f0f4ff',
        },
      },
      fontFamily: {
        // Font utama — load via Google Fonts di index.html
        display: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,42,94,0.06), 0 4px 16px rgba(15,42,94,0.04)',
        'card-hover': '0 4px 24px rgba(15,42,94,0.14)',
      },
    },
  },
  plugins: [],
}
