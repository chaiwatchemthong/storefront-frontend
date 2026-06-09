import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi, orderApi } from '../api/cartApi'
import type { CartItem } from '../types'

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
  cartApi.get()
    .then(data => {
      console.log(data)
      setItems(data)
    })
    .finally(() => setLoading(false))
}, [])

  async function remove(id: number) {
    await cartApi.remove(id)
    setItems(i => i.filter(x => x.id !== id))
  }

  async function checkout() {
    if (!confirm('ยืนยันการสั่งซื้อ?')) return
    setCheckingOut(true)
    try {
      await orderApi.checkout()
      setDone(true)
      setItems([])
    } catch (e: any) {
      alert(e.response?.data?.detail ?? 'เกิดข้อผิดพลาดระหว่างการสั่งซื้อ')
    } finally {
      setCheckingOut(false)
    }
  }

  // 💡 ปรับการคำนวณราคารวมทั้งหมดให้ใช้ .price แทน .unit_price
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)

  if (done) return (
    <div className="page">
      <div className="container">
        <div className="success-state">
          <div className="success-icon">✅</div>
          <h2>สั่งซื้อสำเร็จ!</h2>
          <p>ขอบคุณสำหรับการสั่งซื้อ</p>
          <button className="btn-primary" onClick={() => navigate('/marketplace')}>ช้อปปิ้งต่อ</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <nav className="topnav">
        <div className="nav-brand">🏪 StoreFront</div>
        <button className="btn-ghost" onClick={() => navigate('/marketplace')}>← ช้อปปิ้งต่อ</button>
      </nav>

      <div className="container">
        <h2>ตะกร้าสินค้า</h2>

        {loading ? (
          <div className="empty-state">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>ตะกร้าว่างเปล่า</p>
            <button className="btn-primary" onClick={() => navigate('/marketplace')}>เริ่มช้อปปิ้ง</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-img">
                    {/* 💡 ปรับชื่อคีย์รูปภาพทางเลือกเป็น .name */}
                    {item.product.image ? <img src={item.product.image} alt={item.product.name} /> : '📦'}
                  </div>
                  <div className="cart-info">
                    {/* 💡 ปรับชื่อฟิลด์หัวข้อสินค้าเป็น .name */}
                    <h4>{item.product.name}</h4>
                    {/* 💡 ปรับคีย์ราคาแสดงผลเป็น .price */}
                    <p>฿{Number(item.product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {item.quantity}</p>
                  </div>
                  {/* 💡 ปรับคีย์ราคารวมของแต่ละรายการเป็น .price */}
                  <div className="cart-subtotal">
                    ฿{(Number(item.product.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <button className="btn-remove" onClick={() => remove(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>สรุปคำสั่งซื้อ</h3>
              <div className="summary-row"><span>รายการ</span><span>{items.length} รายการ</span></div>
              <div className="summary-row total">
                <span>ยอดรวม</span>
                <span>฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <button className="btn-primary" onClick={checkout} disabled={checkingOut}>
                {checkingOut ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}