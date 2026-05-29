import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    role: 'buyer' as UserRole 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key: string, val: string) { 
    setForm(f => ({ ...f, [key]: val })) 
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // ✅ ส่งพารามิเตอร์ 6 ตัวเรียงตามลำดับที่ดักไว้ใน AuthContext ครบถ้วน
      await register(
        form.email,       // 1. username (ยืมค่า email มาสวมรอย)
        form.email,       // 2. email
        form.password,    // 3. password
        form.role,        // 4. role
        form.first_name,  // 5. first_name 🔥 ส่งค่าชื่อจริง
        form.last_name    // 6. last_name 🔥 ส่งค่านามสกุล
      )
      
      // เมื่อสำเร็จ ย้ายหน้าไป Login ทันที
      navigate('/login', { replace: true })
      
    } catch (err: any) {
      // ถอด Error แกะข้อความภาษาไทยโชว์บนหน้าจอ
      if (err.response && err.response.data) {
        const backendErrors = err.response.data
        const messages = Object.keys(backendErrors).map(key => {
          let fieldName = key
          if (key === 'username' || key === 'email') fieldName = 'อีเมล'
          if (key === 'first_name') fieldName = 'ชื่อ'
          if (key === 'last_name') fieldName = 'นามสกุล'
          return `${fieldName}: ${backendErrors[key].join(', ')}`
        })
        setError(messages.join(' | '))
      } else {
        setError('ไม่สามารถสมัครสมาชิกได้ กรุณาตรวจสอบข้อมูล')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">🏪</span>
          <h1>StoreFront</h1>
        </div>
        <p className="auth-sub">สร้างบัญชีใหม่เพื่อเข้าสู่ระบบจัดซื้อและสต็อกสินค้า</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-row">
            <div className="field">
              <label>ชื่อ</label>
              <input 
                value={form.first_name} 
                required 
                onChange={e => set('first_name', e.target.value)} 
                placeholder="สมชาย" 
                disabled={loading}
              />
            </div>
            <div className="field">
              <label>นามสกุล</label>
              <input 
                value={form.last_name} 
                required 
                onChange={e => set('last_name', e.target.value)} 
                placeholder="ใจดี" 
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="field">
            <label>อีเมล</label>
            <input 
              type="email" 
              value={form.email} 
              required 
              onChange={e => set('email', e.target.value)} 
              placeholder="your@email.com" 
              disabled={loading}
            />
          </div>
          
          <div className="field">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              value={form.password} 
              required 
              minLength={8} 
              onChange={e => set('password', e.target.value)} 
              placeholder="อย่างน้อย 8 ตัวอักษร" 
              disabled={loading}
            />
          </div>
          
          <div className="field">
            <label>ประเภทบัญชี</label>
            <div className="role-selector">
              {(['buyer', 'seller'] as UserRole[]).map(r => (
                <button 
                  type="button" 
                  key={r} 
                  className={`role-btn ${form.role === r ? 'active' : ''}`} 
                  onClick={() => !loading && set('role', r)}
                  disabled={loading}
                >
                  <span>{r === 'buyer' ? '🛍️' : '🏪'}</span>
                  <span>{r === 'buyer' ? 'ผู้ซื้อ (Buyer)' : 'ผู้ขาย (Seller)'}</span>
                </button>
              ))}
            </div>
          </div>
          
          {error && <div className="error-msg">{error}</div>}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังลงทะเบียนข้อมูล...' : 'สมัครสมาชิกบัญชี'}
          </button>
        </form>
        
        <p className="auth-link">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  )
}