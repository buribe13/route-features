'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Role } from '@/types'

const ROLE_KEY = 'la28-active-role'
const AUTH_KEY = 'la28-logged-in'
const VALID_ROLES: Role[] = ['design', 'pm', 'engineer']

const DEMO_CREDENTIALS: Record<string, { password: string; role: Role }> = {
  design: { password: 'design', role: 'design' },
  pm: { password: 'pm', role: 'pm' },
  engineer: { password: 'engineer', role: 'engineer' },
}

type AuthContextValue = {
  isLoggedIn: boolean
  activeRole: Role
  login: (username: string, password: string) => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>('design')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const storedRole = window.sessionStorage.getItem(ROLE_KEY) as Role | null
    const storedAuth = window.sessionStorage.getItem(AUTH_KEY)

    if (storedAuth === 'true' && storedRole && VALID_ROLES.includes(storedRole)) {
      setActiveRole(storedRole)
      setIsLoggedIn(true)
    }
    setHydrated(true)
  }, [])

  const login = useCallback((username: string, password: string): string | null => {
    const key = username.trim().toLowerCase()
    const account = DEMO_CREDENTIALS[key]
    if (!account || account.password !== password) {
      return 'Invalid username or password.'
    }
    setActiveRole(account.role)
    setIsLoggedIn(true)
    window.sessionStorage.setItem(ROLE_KEY, account.role)
    window.sessionStorage.setItem(AUTH_KEY, 'true')
    return null
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setActiveRole('design')
    window.sessionStorage.removeItem(ROLE_KEY)
    window.sessionStorage.removeItem(AUTH_KEY)
  }, [])

  const value = useMemo(
    () => ({ isLoggedIn, activeRole, login, logout }),
    [isLoggedIn, activeRole, login, logout],
  )

  if (!hydrated) return null

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within RoleProvider')
  }
  return context
}

export function useActiveRole() {
  const { activeRole } = useAuth()
  return { activeRole, setActiveRole: () => {} }
}
