import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '../api/productApi'
import { cartApi } from '../api/cartApi'
import type { Product } from '../types'
import { useAuth } from '../context/AuthContext'

export default function MarketplacePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<number | null>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    cartApi.get().then(items => setCartCount(items.reduce((s, i) => s + i.quantity, 0)))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = search ? { search } : undefined
    productApi.list(params).then(setProducts).finally(() => setLoading(false))
  }, [search])

  async function addToCart(productId: number) {
    setAdding(productId)
    await cartApi.add(productId, 1)
    setCartCount(c => c + 1)
    setAdding(null)
  }

  return (
    <div className="page">
      <nav className="topnav">
        <div className="nav-brand">🏪 StoreFront <span className="role-pill buyer">Buyer</span></div>
        <div className="nav-right">
          <button className="btn-cart" onClick={() => navigate('/cart')}>
            🛒 <span className="cart-badge">{cartCount}</span>
          </button>
          <span className="nav-user">{user?.first_name}</span>
          <button className="btn-ghost" onClick={logout}>ออก</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h2>สินค้าทั้งหมด</h2>
        </div>

        <div className="search-bar">
          <input
            placeholder="🔍 ค้นหาสินค้า..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">กำลังโหลดสินค้า...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>ไม่พบสินค้าที่ค้นหา</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <div className="card-img" onClick={() => navigate(`/products/${p.id}`)}>
                  {/* 💡 ปรับชื่อคีย์รูปภาพทางเลือก และตัวเช็กสินค้าหมดสต็อก (stock === 0) */}
                  {p.image ? <img src={p.image} alt={p.name} /> : <span className="no-img">📦</span>}
                  {p.stock === 0 && <div className="sold-out">หมดแล้ว</div>}
                </div>
                <div className="card-body">
                  {/* 💡 ปรับชื่อฟิลด์หัวข้อสินค้าเป็น p.name */}
                  <h3 className="card-title" onClick={() => navigate(`/products/${p.id}`)}>{p.name}</h3>
                  <p className="card-seller">โดย {p.seller_name}</p>
                  <div className="card-footer">
                    {/* 💡 ปรับคีย์แสดงผลราคาเพื่อแก้บั๊กตัวแดงบรรทัดที่ 79 (p.price) */}
                    <span className="card-price">฿{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button
                      className="btn-add"
                      disabled={p.stock === 0 || adding === p.id}
                      onClick={() => addToCart(p.id)}
                    >
                      {adding === p.id ? '...' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}