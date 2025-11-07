'use client'

import { ReactNode } from 'react'
import { Header } from './Header'
import { CalculatorSidebar } from './CalculatorSidebar'
import { useUser } from '@/contexts/UserContext'

interface CalculatorLayoutProps {
  children: ReactNode
}

export function CalculatorLayout({ children }: CalculatorLayoutProps) {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="flex">
        {/* 侧边栏 */}
        <CalculatorSidebar />
        
        {/* 主内容区域 */}
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}

