import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../types'

export function DevToolbar() {
  const { user, devLogin, logout } = useAuth()
  const navigate = useNavigate()

  function switchRole(role: UserRole) {
    devLogin(role)
    navigate(role === 'seller' ? '/seller/dashboard' : '/marketplace', { replace: true })
  }

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
      background: '#1a1916', color: '#f7f6f3',
      borderRadius: '12px', padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontSize: '13px', boxShadow: '0 4px 20px rgba(0,0,0,.4)',
      border: '1px solid #333',
    }}>
      <span style={{ color: '#9e9a93', fontFamily: 'monospace', fontSize: '11px' }}>🛠 DEV</span>

      <span style={{ color: '#555', fontSize: '10px' }}>|</span>

      <button
        onClick={() => switchRole('buyer')}
        style={{
          padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px',
          background: user?.role === 'buyer' ? '#2563eb' : '#2a2927',
          color: user?.role === 'buyer' ? '#fff' : '#aaa',
          fontFamily: 'inherit', transition: 'all .15s',
        }}
      >
        🛍 Buyer
      </button>

      <button
        onClick={() => switchRole('seller')}
        style={{
          padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px',
          background: user?.role === 'seller' ? '#d97706' : '#2a2927',
          color: user?.role === 'seller' ? '#fff' : '#aaa',
          fontFamily: 'inherit', transition: 'all .15s',
        }}
      >
        🏪 Seller
      </button>

      <span style={{ color: '#555', fontSize: '10px' }}>|</span>

      <button
        onClick={() => { logout(); navigate('/login', { replace: true }) }}
        style={{
          padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px',
          background: 'transparent', color: '#666', fontFamily: 'inherit',
        }}
      >
        ✕
      </button>
    </div>
  )
}
