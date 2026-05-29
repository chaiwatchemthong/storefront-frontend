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

  if (loading) return <div className="page"><div className="empty-state">กำลังโหลด...</div></div>
  if (!product) return <div className="page"><div className="empty-state">ไม่พบสินค้า</div></div>

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
            {product.image ? <img src={product.image} alt={product.title} /> : <div className="no-img-lg">📦</div>}
          </div>
          <div className="detail-info">
            <h2>{product.title}</h2>
            <p className="detail-seller">ขายโดย {product.seller_name}</p>
            <div className="detail-price">฿{Number(product.unit_price).toLocaleString()}</div>
            <div className={`detail-stock ${product.quantity === 0 ? 'out' : product.quantity <= 5 ? 'low' : 'ok'}`}>
              {product.quantity === 0 ? 'หมดสต็อก' : `มีสินค้า ${product.quantity} ชิ้น`}
            </div>
            <p className="detail-desc">{product.description}</p>
            {added ? (
              <div className="added-msg">✅ เพิ่มลงตะกร้าแล้ว — <button className="link-btn" onClick={() => navigate('/cart')}>ดูตะกร้า</button></div>
            ) : (
              <button className="btn-primary btn-lg" onClick={addToCart} disabled={product.quantity === 0 || adding}>
                {adding ? 'กำลังเพิ่ม...' : product.quantity === 0 ? 'หมดสต็อก' : '🛒 เพิ่มลงตะกร้า'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
