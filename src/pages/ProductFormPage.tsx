import { useState, useEffect, useRef } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi } from '../api/productApi'

// สเปกโครงสร้างข้อมูลที่แมตช์ตรงกับฟิลด์ของ Django หลังบ้าน
interface ProductFormData {
  name: string
  description: string
  price: string | number
  stock: number
  image: File | null
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  
  // 💡 ปรับชื่อ State ทุกตัวให้ตรงกับ Django Models (name, price, stock)
  const [form, setForm] = useState<ProductFormData>({ 
    name: '', 
    description: '', 
    price: '', 
    stock: 0, 
    image: null 
  })
  
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    productApi.getById(Number(id))
      .then(p => {
        // 💡 แมตช์ข้อมูลที่ดึงมาจาก API (หลังบ้าน) เข้าสู่ระบบ State ของหน้าบ้าน
        setForm({ 
          name: p.name, 
          description: p.description, 
          price: p.price, 
          stock: p.stock, 
          image: null 
        })
        if (p.image) setPreview(p.image)
      })
      .catch(() => setError('ไม่สามารถโหลดข้อมูลสินค้าได้'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  // ฟังก์ชันช่วยอัปเดตค่าใน State แบบไดนามิกตาม Key
  function set(key: keyof ProductFormData, val: string | number | File | null) { 
    setForm(f => ({ ...f, [key]: val })) 
  }

  function handleFile(file: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return }
    if (file.size > 5 * 1024 * 1024) { setError('ขนาดไฟล์ต้องไม่เกิน 5MB'); return }
    setError('')
    set('image', file)
    setPreview(URL.createObjectURL(file))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dropRef.current?.classList.remove('drag-over')
    handleFile(e.dataTransfer.files[0] ?? null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // 💡 ปรับดักจับ Validation ฝั่งหน้าบ้านตามชื่อฟิลด์ใหม่
    if (!form.name.trim()) { setError('กรุณาใส่ชื่อสินค้า'); return }
    if (!form.price || Number(form.price) <= 0) { setError('กรุณาใส่ราคาที่ถูกต้อง'); return }
    if (form.stock < 0) { setError('จำนวนสต็อกต้องไม่ติดลบ'); return }
    
    setSaving(true)
    setError('')
    
    try {
      if (isEdit) {
        await productApi.update(Number(id), form)
      } else {
        await productApi.create(form)
      }
      navigate('/seller/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } }
      setError(e.response?.data?.detail ?? 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง')
    } finally { 
      setSaving(false) 
    }
  }

  if (loading) return <div className="page"><div className="empty-state">กำลังโหลดข้อมูลสินค้า...</div></div>

  return (
    <div className="page">
      <nav className="topnav">
        <div className="nav-brand">🏪 StoreFront <span className="role-pill seller">Seller</span></div>
        <button className="btn-ghost" onClick={() => navigate('/seller/dashboard')}>← กลับ</button>
      </nav>
      <div className="container form-container">
        <h2>{isEdit ? 'แก้ไขสินค้าชิ้นนี้' : 'เพิ่มสินค้าใหม่เข้าสต็อก'}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          
          {/* ส่วนจัดการรูปภาพสินค้า */}
          <div className="field">
            <label>รูปภาพสินค้า</label>
            {preview ? (
              <div className="image-preview">
                <img src={preview} alt="preview" />
                <button type="button" className="remove-img" onClick={() => { setPreview(null); set('image', null) }}>✕</button>
              </div>
            ) : (
              <div ref={dropRef} className="upload-zone"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); dropRef.current?.classList.add('drag-over') }}
                onDragLeave={() => dropRef.current?.classList.remove('drag-over')}
                onDrop={handleDrop}>
                <div className="upload-icon">📁</div>
                <p>คลิกหรือลากไฟล์รูปภาพมาวางที่นี่</p>
                <p className="upload-hint">PNG, JPG ขนาดสูงสุดไม่เกิน 5MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* ช่องกรอกชื่อสินค้า */}
          <div className="field">
            <label>ชื่อสินค้า <span className="required">*</span></label>
            <input value={form.name} required onChange={e => set('name', e.target.value)} placeholder="เช่น คีย์บอร์ดกลไก RGB, เสื้อยืด Oversize" />
          </div>

          {/* ช่องกรอกรายละเอียด */}
          <div className="field">
            <label>รายละเอียดสินค้า <span className="required">*</span></label>
            <textarea value={form.description} required onChange={e => set('description', e.target.value)} placeholder="อธิบายคุณสมบัติสินค้า หรือรายละเอียดการจัดซื้อ..." rows={4} />
          </div>

          {/* แถวราคาและจำนวนสินค้า */}
          <div className="field-row">
            <div className="field">
              <label>ราคาขาย (฿) <span className="required">*</span></label>
              <input type="number" min="0" step="0.01" value={form.price} required onChange={e => set('price', e.target.value)} placeholder="0.00" />
            </div>
            <div className="field">
              <label>จำนวนในสต็อก <span className="required">*</span></label>
              <input type="number" min="0" value={form.stock} required onChange={e => set('stock', Number(e.target.value))} placeholder="0" />
            </div>
          </div>

          {/* แสดงข้อความแจ้งเตือน Error */}
          {error && <div className="error-msg">{error}</div>}

          {/* ปุ่มกดยืนยัน / ยกเลิก */}
          <div className="form-footer">
            <button type="button" className="btn-ghost" onClick={() => navigate('/seller/dashboard')}>ยกเลิก</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'กำลังบันทึกข้อมูล...' : isEdit ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มสินค้าเข้าสต็อก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}