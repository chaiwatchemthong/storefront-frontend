import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SellerDashboardPage from '../pages/SellerDashboardPage'
import ProductFormPage from '../pages/ProductFormPage'
import MarketplacePage from '../pages/MarketplacePage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'

function UnauthorizedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>🚫</div>
      <h2>ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
      <a href="/login" style={{ color: 'var(--accent)' }}>กลับหน้าหลัก</a>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute allowedRole="seller" />}>
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/products/new" element={<ProductFormPage />} />
            <Route path="/seller/products/:id/edit" element={<ProductFormPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="buyer" />}>
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
