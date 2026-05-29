export type UserRole = 'seller' | 'buyer'

export interface AuthUser {
  id: number
  email: string
  role: UserRole
  first_name: string
  last_name: string
}

// 💡 อัปเดตโครงสร้างสินค้าให้ตรงกับโมเดล Django หลังบ้าน
export interface Product {
  id: number
  seller_id: number
  seller_name: string
  name: string            // เปลี่ยนจาก title -> name
  description: string
  price: string           // เปลี่ยนจาก unit_price -> price (รับเป็น string จาก API ก่อนนำไปแปลง)
  stock: number           // เปลี่ยนจาก quantity -> stock
  image: string | null
  created_at: string
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  price: string          // เปลี่ยนจาก unit_price -> price ให้ล้อไปกับโครงสร้างใหม่
}

export interface Order {
  id: number
  status: string
  total_price: string
  items: OrderItem[]
  created_at: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: AuthUser
}

// 💡 อัปเดตโครงสร้างฟอร์มส่งข้อมูลให้ตรงกับหน้าฟอร์มปัจจุบัน
export interface ProductFormData {
  name: string           // เปลี่ยนจาก title -> name
  description: string
  price: string | number // เปลี่ยนจาก unit_price -> price
  stock: number          // เปลี่ยนจาก quantity -> stock
  image?: File | null
}