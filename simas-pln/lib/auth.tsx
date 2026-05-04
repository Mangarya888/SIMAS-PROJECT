'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// ─── USERS ────────────────────────────────────────────────────────────────────
// Role: 'admin' = akses penuh | 'viewer' = hanya lihat
const USERS = [
  { username: 'admin',   password: 'pln2024',  role: 'admin'  as const, name: 'Administrator' },
  { username: 'manager', password: 'manager123', role: 'viewer' as const, name: 'Manager PLN' },
]

export type UserRole = 'admin' | 'viewer'

export interface AuthUser {
  username: string
  name: string
  role: UserRole
}

interface AuthContextType {
  isLoggedIn: boolean
  user: AuthUser | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => false,
  logout: () => {},
  isAdmin: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const session = sessionStorage.getItem('simas_user')
    if (session) {
      try { setUser(JSON.parse(session)) } catch {}
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (found) {
      const authUser: AuthUser = { username: found.username, name: found.name, role: found.role }
      setUser(authUser)
      sessionStorage.setItem('simas_user', JSON.stringify(authUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('simas_user')
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!user,
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
