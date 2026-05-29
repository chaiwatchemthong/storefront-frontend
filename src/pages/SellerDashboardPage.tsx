import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '../api/productApi'
import type { Product } from '../types'
import { useAuth } from '../context/AuthContext'

export default function SellerDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    productApi.myProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากคลัง?')) return
    setDeleting(id)
    await productApi.remove(id)
    setProducts(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  // 💡 อัปเดตตัวคำนวณสถิติ (Stats) ด้านบนให้ตรวจสอบผ่านฟิลด์ stock และคำนวณได้ถูกต้อง
  const stats = {
    total: products.length,
    low: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    out: products.filter(p => p.stock === 0).length,
  }

  return (
    <div className="page">
      <nav className="topnav">
        <div className="nav-brand">🏪 StoreFront <span className="role-pill seller">Seller</span></div>
        <div className="nav-right">
          <span className="nav-user">{user?.first_name} {user?.last_name}</span>
          <button className="btn-ghost" onClick={logout}>ออกจากระบบ</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div>
            <h2>สินค้าของฉัน</h2>
            <p className="page-sub">จัดการรายการสินค้าและระบบสต็อกทั้งหมด</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/seller/products/new')}>
            + เพิ่มสินค้า
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">สินค้าทั้งหมด</div>
            <div className="stat-val">{stats.total}</div>
          </div>
          <div className="stat-card warn">
            <div className="stat-label">ใกล้หมด (≤5)</div>
            <div className="stat-val">{stats.low}</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-label">หมดสต็อก</div>
            <div className="stat-val">{stats.out}</div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">กำลังโหลดข้อมูลแดชบอร์ด...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>ยังไม่มีสินค้าในคลังของคุณ</p>
            <button className="btn-primary" onClick={() => navigate('/seller/products/new')}>เพิ่มสินค้าแรก</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="product-table">
              <thead>
                <tr>
                  <th>สินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {p.image ? <img src={p.image} alt={p.name} /> : '📦'}
                        </div>
                        {/* 💡 ปรับชื่อคีย์แสดงผลหัวข้อสินค้าเป็น name */}
                        <span className="product-title">{p.name}</span>
                      </div>
                    </td>
                    {/* 💡 ปรับชื่อคีย์แสดงผลราคาเป็น price เพื่อป้องกันปัญหา ฿NaN */}
                    <td>฿{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    {/* 💡 ปรับชื่อคีย์แสดงผลจำนวนคงเหลือเป็น stock */}
                    <td>{p.stock} ชิ้น</td>
                    <td>
                      {/* 💡 ปรับแสตมป์ Badge แจ้งเตือนเช็กผ่านเงื่อนไข stock แทน quantity */}
                      <span className={`stock-badge ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>
                        {p.stock === 0 ? 'หมด' : p.stock <= 5 ? 'ใกล้หมด' : 'มีสินค้า'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm" onClick={() => navigate(`/seller/products/${p.id}/edit`)}>แก้ไข</button>
                        <button className="btn-sm danger" onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                          {deleting === p.id ? '...' : 'ลบ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}