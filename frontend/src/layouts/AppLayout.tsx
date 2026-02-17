import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header  from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#f0f4ff' }}>
      <Header onToggleSidebar={() => setSidebarOpen(o => !o)} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Sidebar isOpen={sidebarOpen} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          minWidth: 0,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
