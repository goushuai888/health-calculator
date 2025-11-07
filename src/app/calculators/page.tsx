import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function CalculatorsPage() {
  const session = await getSession()

  const calculators = [
    {
      id: 'bmi',
      name: 'BMI 计算器',
      icon: '⚖️',
      description: '计算身体质量指数，评估体重状况',
      href: '/calculators/bmi',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'bmr',
      name: 'BMR 计算器',
      icon: '🔥',
      description: '计算基础代谢率和每日热量需求',
      href: '/calculators/bmr',
      color: 'bg-red-50 border-red-200',
    },
    {
      id: 'body-fat',
      name: '体脂率计算器',
      icon: '📊',
      description: '估算身体脂肪百分比',
      href: '/calculators/body-fat',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'waist-hip',
      name: '腰臀比计算器',
      icon: '📏',
      description: '评估中心性肥胖风险',
      href: '/calculators/waist-hip',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      id: 'blood-pressure',
      name: '血压评估',
      icon: '💓',
      description: '评估血压水平和健康状况',
      href: '/calculators/blood-pressure',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'heart-rate',
      name: '目标心率',
      icon: '❤️',
      description: '计算不同运动强度的目标心率',
      href: '/calculators/target-heart-rate',
      color: 'bg-pink-50 border-pink-200',
    },
    {
      id: 'sli',
      name: '心脏负荷指数',
      icon: '💪',
      description: '评估运动心脏负荷',
      href: '/calculators/sli',
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'calorie',
      name: '卡路里需求',
      icon: '🍽️',
      description: '计算每日卡路里摄入建议',
      href: '/calculators/calorie',
      color: 'bg-orange-50 border-orange-200',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session ? { username: session.username, email: session.email, role: session.role } : null} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">健康计算器</h1>
          <p className="text-gray-600 mt-2">选择一个计算器开始您的健康评估</p>
          {!session && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>提示：</strong>所有计算器无需登录即可使用。
                <a href="/register" className="underline font-medium ml-1">注册账户</a> 后可自动保存您的计算历史并追踪健康趋势。
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <Link key={calc.id} href={calc.href}>
              <Card className={`h-full hover:shadow-lg transition-all cursor-pointer border-2 ${calc.color}`}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{calc.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {calc.name}
                    </h3>
                    <p className="text-sm text-gray-600">{calc.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

