import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi } from '../api/productApi'
import { cartApi } from '../api/cartApi'
import type { Product } from '../types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    productApi.getById(Number(id)).then(setProduct).finally(() => setLoading(false))
  }, [id])

  async function addToCart() {
    if (!product) return
    setAdding(true)
    await cartApi.add(product.id, 1)
    setAdded(true)
    setAdding(false)
  }

  if (loading) return <div className="page"><div className="empty-state">กำลังโหลดรายละเอียดสินค้า...</div></div>
  if (!product) return <div className="page"><div className="empty-state">ไม่พบสินค้าชิ้นนี้</div></div>

  return (
    <div className="page">
      <nav className="topnav">
        <div className="nav-brand">🏪 StoreFront</div>
        <div className="nav-right">
          <button className="btn-ghost" onClick={() => navigate('/marketplace')}>← กลับ</button>
          <button className="btn-cart" onClick={() => navigate('/cart')}>🛒</button>
        </div>
      </nav>

      <div className="container">
        <div className="detail-layout">
          <div className="detail-img">
            {/* 💡 ปรับชื่อคีย์รูปภาพทางเลือกเป็น .name */}
            {product.image ? <img src={product.image} alt={product.name} /> : <div className="no-img-lg">📦</div>}
          </div>
          <div className="detail-info">
            {/* 💡 ปรับชื่อฟิลด์หัวข้อสินค้าเป็น .name */}
            <h2>{product.name}</h2>
            <p className="detail-seller">ขายโดย {product.seller_name}</p>
            {/* 💡 ปรับคีย์ราคาแสดงผลเป็น .price เพื่อป้องกันการแสดงผลเป็น NaN */}
            <div className="detail-price">฿{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            {/* 💡 ปรับเช็กสถานะสต็อกและตัวเลขสินค้าคงเหลือผ่านคีย์ .stock */}
            <div className={`detail-stock ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'ok'}`}>
              {product.stock === 0 ? 'หมดสต็อก' : `มีสินค้าในสต็อก ${product.stock} ชิ้น`}
            </div>
            <p className="detail-desc">{product.description}</p>
            
            {added ? (
              <div className="added-msg">✅ เพิ่มลงตะกร้าแล้ว — <button className="link-btn" onClick={() => navigate('/cart')}>ดูตะกร้า</button></div>
            ) : (
              <button 
                className="btn-primary btn-lg" 
                onClick={addToCart} 
                disabled={product.stock === 0 || adding}
              >
                {adding ? 'กำลังเพิ่ม...' : product.stock === 0 ? 'หมดสต็อก' : '🛒 เพิ่มลงตะกร้า'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}