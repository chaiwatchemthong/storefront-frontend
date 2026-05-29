import client from './client'
import type { Product, ProductFormData } from '../types'

export const productApi = {
  list: async (params?: { search?: string; min_price?: string; max_price?: string }): Promise<Product[]> => {
    const { data } = await client.get('/products/', { params })
    return data
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await client.get(`/products/${id}/`)
    return data
  },

  myProducts: async (): Promise<Product[]> => {
    const { data } = await client.get('/products/my/')
    return data
  },

  create: async (form: ProductFormData): Promise<Product> => {
    const fd = buildFormData(form)
    const { data } = await client.post('/products/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (id: number, form: ProductFormData): Promise<Product> => {
    const fd = buildFormData(form)
    const { data } = await client.patch(`/products/${id}/`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  remove: async (id: number): Promise<void> => {
    await client.delete(`/products/${id}/`)
  },
}

// 💡 ปรับเปลี่ยนชื่อคีย์ภายใน FormData ให้ตรงกับโมเดลของ Django (name, price, stock)
function buildFormData(form: any): FormData {
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('description', form.description)
  fd.append('price', String(form.price))
  fd.append('stock', String(form.stock))
  if (form.image) fd.append('image', form.image)
  return fd
}