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
  // 初始化时从 localStorage 读取用户信息，避免闪烁
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage())
  const [loading, setLoading] = useState(true)
  const isRefreshing = useRef(false) // 防止并发请求

  const refreshUser = useCallback(async () => {
    // 防止并发请求
    if (isRefreshing.current) {
      return
    }

    // 检查缓存
    if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
      const cachedUser = userCache.user
      setUser(cachedUser)
      saveUserToStorage(cachedUser) // 同步到 localStorage
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
        const fetchedUser = data.user
        setUser(fetchedUser)
        // 更新缓存
        userCache = { user: fetchedUser, timestamp: Date.now() }
        // 保存到 localStorage
        saveUserToStorage(fetchedUser)
      } else if (response.status === 401) {
        setUser(null)
        userCache = { user: null, timestamp: Date.now() }
        saveUserToStorage(null)
      }
    } catch (error) {
      // 出错时不清除 localStorage 中的用户信息，保持显示
      // 只在明确 401 时才清除
      console.error('Failed to refresh user:', error)
    } finally {
      setLoading(false)
      isRefreshing.current = false
    }
  }, [])

  const setUserWithCache = useCallback((newUser: User | null) => {
    setUser(newUser)
    // 更新缓存
    userCache = { user: newUser, timestamp: Date.now() }
    // 保存到 localStorage
    saveUserToStorage(newUser)
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

