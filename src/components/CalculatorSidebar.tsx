'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, memo, useMemo } from 'react'

const calculators = [
  {
    id: 'bmi',
    name: 'BMI 计算器',
    icon: '📊',
    href: '/calculators/bmi',
    description: '身体质量指数',
  },
  {
    id: 'bmr',
    name: 'BMR 计算器',
    icon: '🔥',
    href: '/calculators/bmr',
    description: '基础代谢率',
  },
  {
    id: 'body-fat',
    name: '体脂率',
    icon: '💪',
    href: '/calculators/body-fat',
    description: '体脂百分比',
  },
  {
    id: 'waist-hip',
    name: '腰臀比',
    icon: '📏',
    href: '/calculators/waist-hip',
    description: '脂肪分布',
  },
  {
    id: 'blood-pressure',
    name: '血压评估',
    icon: '❤️',
    href: '/calculators/blood-pressure',
    description: '心血管健康',
  },
  {
    id: 'target-heart-rate',
    name: '目标心率',
    icon: '💓',
    href: '/calculators/target-heart-rate',
    description: '运动心率区间',
  },
  {
    id: 'sli',
    name: '心脏负荷',
    icon: '🏃',
    href: '/calculators/sli',
    description: 'SLI 指数',
  },
  {
    id: 'calorie',
    name: '卡路里需求',
    icon: '🍽️',
    href: '/calculators/calorie',
    description: '每日热量',
  },
]

export const CalculatorSidebar = memo(function CalculatorSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="切换计算器菜单"
      >
        {isMobileMenuOpen ? '✕' : '📋'}
      </button>

      {/* 移动端遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 z-40
          overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">健康计算器</h2>
            <Link
              href="/calculators"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              全部
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-1">选择一个计算器</p>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {calculators.map((calc) => {
              const isActive = pathname === calc.href
              return (
                <li key={calc.id}>
                  <Link
                    href={calc.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-start p-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                  >
                    <span className="text-2xl mr-3 flex-shrink-0">{calc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`
                          text-sm font-medium
                          ${isActive ? 'text-primary-700' : 'text-gray-900'}
                        `}
                      >
                        {calc.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {calc.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* 返回按钮 */}
        <div className="p-4 border-t border-gray-200 mt-4">
          <Link
            href="/"
            className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="mr-2">←</span>
            返回首页
          </Link>
        </div>
      </aside>
    </>
  )
})

