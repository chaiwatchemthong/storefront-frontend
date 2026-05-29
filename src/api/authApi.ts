import client from './client'
import type { LoginResponse, AuthUser } from '../types'

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await client.post('/auth/login/', { email, password })
    return data
  },

  register: async (payload: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: string
  }): Promise<LoginResponse> => {
    const { data } = await client.post('/auth/register/', payload)
    return data
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await client.get('/auth/me/')
    return data
  },
}
