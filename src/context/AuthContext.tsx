import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  role: 'seller' | 'buyer'
  first_name: string
  last_name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<any>
  register: (
    username: string, 
    email: string, 
    password: string, 
    role: string, 
    first_name: string, 
    last_name: string
  ) => Promise<any>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user_data')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
    setLoading(false)
  }, [])

  // ฟังก์ชัน Login 
  async function login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, { email, password })
      const { access, user: userData } = response.data
      setToken(access)
      setUser(userData)
      localStorage.setItem('access_token', access)
      localStorage.setItem('user_data', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`
      return response.data
    } catch (error) {
      console.error('Error at auth login view:', error)
      throw error
    }
  }

  // ✅ ฟังก์ชัน Register (แก้ไขส่ง 6 พารามิเตอร์ครบถ้วนเข้าบอดี้ Axios)
  async function register(
    username: string, 
    email: string, 
    password: string, 
    role: string, 
    first_name: string, 
    last_name: string
  ) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register/`, {
        username,
        email,
        password,
        role,
        first_name,  // 🔥 ส่งไป Django
        last_name    // 🔥 ส่งไป Django
      })
      return response.data
    } catch (error) {
      console.error('Error at auth register view:', error)
      throw error
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}