import axios from 'axios'

/**
 * Axios instance terpusat.
 * - baseURL '/api' → Vite proxy meneruskan ke http://localhost:8000/api
 * - Interceptor request: bisa tambahkan Authorization header di sini
 * - Interceptor response: handle error 401/403/500 secara global
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Contoh: tambahkan token kalau ada
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: redirect ke halaman login jika ada autentikasi
      console.warn('[API] Unauthorized – 401')
    }
    if (error.response?.status >= 500) {
      console.error('[API] Server error:', error.response?.data)
    }
    return Promise.reject(error)
  },
)

export default api
