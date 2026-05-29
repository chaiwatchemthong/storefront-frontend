import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ตรวจสอบและย้ายผู้ใช้ออกจากหน้า Login เมื่อสถานะผู้ใช้ (State) อัปเดตเสร็จสิ้น
  useEffect(() => {
    if (user) {
      const targetPath = user.role === 'seller' ? '/seller/dashboard' : '/marketplace'
      navigate(targetPath, { replace: true })
    }
  }, [user, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await login(email, password)
    } catch (err: any) {
      // ดึงข้อความแจ้งเตือนที่หลังบ้านตอบกลับมาแสดงบนหน้า UI หากเกิดการล้มเหลว
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือเซิร์ฟเวอร์ขัดข้อง')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon" role="img" aria-label="store">🏪</span>
          <h1>StoreFront</h1>
        </div>
        <p className="auth-sub">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>อีเมล</label>
            <input 
              type="email" 
              value={email} 
              required 
              onChange={e => setEmail(e.target.value)} 
              placeholder="your@email.com" 
              disabled={loading}
            />
          </div>
          
          <div className="field">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              value={password} 
              required 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-msg">{error}</div>}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <p className="auth-link">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  )
}