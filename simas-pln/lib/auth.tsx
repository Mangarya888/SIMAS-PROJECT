'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Kredensial admin — bisa diganti sesuai kebutuhan
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'pln2024',
}

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Cek apakah sudah login sebelumnya (simpan di sessionStorage)
    const session = sessionStorage.getItem('simas_auth')
    if (session === 'true') setIsLoggedIn(true)
  }, [])

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsLoggedIn(true)
      sessionStorage.setItem('simas_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('simas_auth')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
