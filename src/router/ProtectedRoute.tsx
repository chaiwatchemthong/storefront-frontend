import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DevToolbar } from '../dev/DevToolbar'

interface Props { 
  // 💡 ปรับสเปกไทป์ให้ล้อไปตามอินเทอร์เฟซของบทบาทผู้ใช้จริงในระบบ
  allowedRole: 'seller' | 'buyer' 
}

export function ProtectedRoute({ allowedRole }: Props) {
  // 💡 เปลี่ยนจาก isLoading เป็น loading ตามสเปกจริงใน AuthContext
  const { user, token, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  // กรณีผู้ใช้งานยังไม่ได้เข้าสู่ระบบ (ไม่มี Token หรือ ข้อมูล User)
  if (!token || !user) {
    // 💡 เปิดพื้นที่ให้ DevToolbar แสดงผลในกรณีติดล็อก เพื่อให้โปรแกรมเมอร์กดจำลองสิทธิ์ข้ามหน้าไปเทสระบบได้ทันที
    return (
      <>
        <DevToolbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1rem', color: '#888' }}>
          <div style={{ fontSize: '3rem' }}>🛠️</div>
          <p style={{ fontSize: '15px' }}>โหมดนักพัฒนา — คลิกสลับ Role ด้านล่างเพื่อจำลองเข้าสู่ระบบ</p>
        </div>
      </>
    )
  }

  // กรณีล็อกอินแล้วแต่สิทธิ์ (Role) ไม่ตรงกับหน้าปลายทางที่กำหนดไว้
  if (user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />
  }

  // ผ่านทุกเงื่อนไขความปลอดภัย -> อนุญาตให้เข้าถึงเนื้อหาภายในหน้าเพจนั้น ๆ
  return (
    <>
      <Outlet />
      {/* 💡 แปะ DevToolbar สแตนด์บายไว้ที่มุมขวาล่างในทุกหน้าเพื่อให้สลับทดสอบ Logic ซื้อ-ขาย ได้สะดวกรวดเร็ว */}
      <DevToolbar />
    </>
  )
}