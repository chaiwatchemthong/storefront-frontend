import client from './client'
import type { CartItem, Order } from '../types'

export const cartApi = {
  get: async (): Promise<CartItem[]> => {
    const { data } = await client.get('/cart/')
    return data
  },
  add: async (productId: number, quantity: number): Promise<CartItem> => {
    const { data } = await client.post('/cart/', { product_id: productId, quantity })
    return data
  },
  remove: async (itemId: number): Promise<void> => {
    await client.delete(`/cart/${itemId}/`)
  },
  clear: async (): Promise<void> => {
    await client.delete('/cart/clear/')
  },
}

export const orderApi = {
  list: async (): Promise<Order[]> => {
    const { data } = await client.get('/orders/')
    return data
  },
  checkout: async (): Promise<Order> => {
    const { data } = await client.post('/orders/checkout/')
    return data
  },
}
