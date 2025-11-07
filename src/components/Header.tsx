'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/Button'
import { useUser } from '@/contexts/UserContext'

interface HeaderProps {
  user?: {
    username: string
    email: string
    role?: string
  } | null
}

export function Header({ user: propUser }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user: contextUser, setUser } = useUser()
  
  // 优先使用 context 中的 user，如果没有则使用 prop
  const user = contextUser || propUser

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null) // 清除全局用户状态
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              🏥 健康计算器
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  仪表板
                </Link>
                <Link href="/calculators" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  计算器
                </Link>
                <Link href="/history" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  历史记录
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-orange-600 hover:text-orange-700 px-3 py-2 font-medium">
                    👑 管理员面板
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    你好，{user.username}
                    {user.role === 'ADMIN' && <span className="ml-1 text-orange-600 font-semibold">👑</span>}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    登出
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">注册</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  仪表板
                </Link>
                <Link href="/calculators" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  计算器
                </Link>
                <Link href="/history" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  历史记录
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block px-3 py-2 text-orange-600 hover:bg-orange-50 font-medium">
                    👑 管理员面板
                  </Link>
                )}
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    你好，{user.username}
                    {user.role === 'ADMIN' && <span className="ml-1 text-orange-600 font-semibold">👑</span>}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    登出
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  登录
                </Link>
                <Link href="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  注册
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

