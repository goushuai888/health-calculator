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

// localStorage 键名
const USER_STORAGE_KEY = 'health_calculator_user'

// 从 localStorage 读取用户信息
function loadUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error)
  }
  return null
}

// 保存用户信息到 localStorage
function saveUserToStorage(user: User | null) {
  if (typeof window === 'undefined') return
  
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  } catch (error) {
    console.error('Failed to save user to localStorage:', error)
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = loadUserFromStorage()
    if (storedUser) {
      userCache = { user: storedUser, timestamp: Date.now() }
    }
    return storedUser
  })
  const [loading, setLoading] = useState(false)
  const isRefreshing = useRef(false)
  const hasVerified = useRef(false)

  const refreshUser = useCallback(async () => {
    if (isRefreshing.current) return

    if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
      return
    }

    isRefreshing.current = true
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        const fetchedUser = data.user
        setUser(fetchedUser)
        userCache = { user: fetchedUser, timestamp: Date.now() }
        saveUserToStorage(fetchedUser)
      } else if (response.status === 401) {
        setUser(null)
        userCache = { user: null, timestamp: Date.now() }
        saveUserToStorage(null)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    } finally {
      isRefreshing.current = false
    }
  }, [])

  const setUserWithCache = useCallback((newUser: User | null) => {
    setUser(newUser)
    userCache = { user: newUser, timestamp: Date.now() }
    saveUserToStorage(newUser)
  }, [])

  useEffect(() => {
    if (!hasVerified.current) {
      hasVerified.current = true
      refreshUser()
    }
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

