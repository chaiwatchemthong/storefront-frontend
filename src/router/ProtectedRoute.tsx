import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DevToolbar } from '../dev/DevToolbar'
import type { UserRole } from '../types'

interface Props { allowedRole: UserRole }

export function ProtectedRoute({ allowedRole }: Props) {
  const { user, token, isLoading, devMode } = useAuth()

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!token || !user) {
    if (devMode) return (
      <>
        <DevToolbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1rem', color: 'var(--text2)' }}>
          <div style={{ fontSize: '3rem' }}>🛠️</div>
          <p style={{ fontSize: '15px' }}>Dev mode — เลือก role ด้านบนเพื่อเข้าใช้งาน</p>
        </div>
      </>
    )
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) return <Navigate to="/unauthorized" replace />

  return (
    <>
      {devMode && <DevToolbar />}
      <Outlet />
    </>
  )
}
