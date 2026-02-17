import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '@/pages/DashboardPage'
import PetaPage      from '@/pages/PetaPage'
import DataPage      from '@/pages/DataPage'
import AppLayout     from '@/layouts/AppLayout'

export default function App() {
  return (
    <Routes>
      {/* Semua halaman pakai AppLayout (header + sidebar) */}
      <Route element={<AppLayout />}>
        <Route path="/"         element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/peta"      element={<PetaPage />} />
        <Route path="/data"      element={<DataPage />} />
      </Route>
    </Routes>
  )
}
