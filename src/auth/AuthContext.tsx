import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  readSession,
  verifyLogin,
  writeSession,
  type AuthUser,
} from '../lib/auth'

type AuthContextValue = {
  user: AuthUser | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const login = useCallback(async (username: string, password: string) => {
    const next = await verifyLogin(username, password)
    if (!next) return false
    writeSession(next)
    setUser(next)
    return true
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải nằm trong AuthProvider')
  return ctx
}
