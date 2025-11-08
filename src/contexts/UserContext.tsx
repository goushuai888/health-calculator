'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'

export interface User {
  id: string
  username: string
  email: string
  role?: string
  avatar?: string | null
}

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// 缓存用户信息，避免重复请求
let userCache: { user: User | null; timestamp: number } | null = null
const CACHE_DURATION = 60000 // 1分钟缓存

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isRefreshing = useRef(false) // 防止并发请求

  const refreshUser = useCallback(async () => {
    // 防止并发请求
    if (isRefreshing.current) {
      return
    }

    // 检查缓存
    if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
      setUser(userCache.user)
      setLoading(false)
      return
    }

    isRefreshing.current = true
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        // 更新缓存
        userCache = { user: data.user, timestamp: Date.now() }
      } else if (response.status === 401) {
        setUser(null)
        userCache = { user: null, timestamp: Date.now() }
      }
    } catch (error) {
      setUser(null)
      userCache = { user: null, timestamp: Date.now() }
    } finally {
      setLoading(false)
      isRefreshing.current = false
    }
  }, [])

  const setUserWithCache = useCallback((newUser: User | null) => {
    setUser(newUser)
    // 更新缓存
    userCache = { user: newUser, timestamp: Date.now() }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, setUser: setUserWithCache }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

