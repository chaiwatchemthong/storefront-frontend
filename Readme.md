# StoreFront — Frontend

React + TypeScript frontend สำหรับระบบ StoreFront Management System

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router DOM v6 |
| HTTP client | Axios |
| Styling | CSS Variables (ไม่มี dependency เพิ่ม) |

---

## โครงสร้างโปรเจกต์

```
src/
  api/
    client.ts           # Axios instance + JWT interceptor
    authApi.ts          # login, register, me
    productApi.ts       # CRUD + image upload (FormData)
    cartApi.ts          # cart + checkout
  context/
    AuthContext.tsx     # JWT state + useAuth() hook
  dev/
    DevToolbar.tsx      # toolbar สลับ role โดยไม่ต้อง login (dev only)
    mockUsers.ts        # mock user data สำหรับ dev mode
  pages/
    LoginPage.tsx
    RegisterPage.tsx
    SellerDashboardPage.tsx
    ProductFormPage.tsx   # ใช้ทั้ง create และ edit mode
    MarketplacePage.tsx
    ProductDetailPage.tsx
    CartPage.tsx
  router/
    AppRouter.tsx       # routes ทั้งหมด
    ProtectedRoute.tsx  # role-based guard
  types/
    index.ts            # TypeScript interfaces ทั้งหมด
  index.css             # design system
```

---

## การติดตั้งและรัน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```env
# URL ของ Django backend
VITE_API_URL=http://localhost:8000/api

# เปิด dev bypass — ข้าม login ได้ (เฉพาะ development)
VITE_DEV_BYPASS=true
```

### 3. รัน development server

```bash
npm run dev
```

เปิดที่ `http://localhost:5173`

### 4. Build สำหรับ production

```bash
npm run build
```

ผลลัพธ์อยู่ใน `dist/`

---

## Dev Mode (ข้าม Login)

เมื่อตั้ง `VITE_DEV_BYPASS=true` จะมี **toolbar สีดำมุมขวาล่าง** ให้สลับ role ได้ทันทีโดยไม่ต้อง login

| ปุ่ม | ผลลัพธ์ |
|------|--------|
| 🛍 Buyer | เข้า `/marketplace` |
| 🏪 Seller | เข้า `/seller/dashboard` |
| ✕ | logout |

> **หมายเหตุ:** toolbar นี้จะไม่แสดงใน production build เพราะ Vite กำหนด `import.meta.env.DEV = false` อัตโนมัติ

---

## Routes

### Public
| Path | หน้า |
|------|------|
| `/login` | หน้า Login |
| `/register` | หน้า Register |

### Seller (ต้อง role = seller)
| Path | หน้า |
|------|------|
| `/seller/dashboard` | รายการสินค้าทั้งหมดของ Seller |
| `/seller/products/new` | เพิ่มสินค้าใหม่ |
| `/seller/products/:id/edit` | แก้ไขสินค้า |

### Buyer (ต้อง role = buyer)
| Path | หน้า |
|------|------|
| `/marketplace` | รายการสินค้าทั้งหมด + ค้นหา |
| `/products/:id` | รายละเอียดสินค้า |
| `/cart` | ตะกร้าสินค้า + checkout |

---

## การเชื่อมต่อ Backend

Frontend คุยกับ backend ผ่าน Axios ใน `src/api/client.ts`

- ทุก request จะแนบ `Authorization: Bearer <token>` อัตโนมัติ (ถ้ามี token)
- ถ้าได้รับ `401` จะ redirect ไป `/login` อัตโนมัติ
- Image upload ใช้ `multipart/form-data` ผ่าน `productApi.ts`

ตรวจสอบให้ `VITE_API_URL` ตรงกับ URL ของ backend ก่อนรัน

---

## Architectural Decisions

**AuthContext แทน Redux** — ระบบนี้มี auth state เพียงอย่างเดียวที่ต้องแชร์ทั่วแอป ใช้ React Context เพียงพอ ไม่จำเป็นต้อง setup Redux

**ProtectedRoute ใช้ Outlet** — ใช้ pattern ของ React Router v6 ที่ถูกต้อง แทนที่จะ pass `children` โดยตรง ทำให้ role guard รองรับ nested routes ได้

**ProductFormPage เดียวสำหรับ create และ edit** — ตรวจจาก URL param `id` ถ้ามีจะเป็น edit mode ลด code ซ้ำซ้อน

**TypeScript strict types** — ทุก API response มี interface กำหนดไว้ใน `src/types/index.ts` ไม่ใช้ `any`
