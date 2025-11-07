import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function HomePage() {
  const session = await getSession()
  
  const calculators = [
    {
      id: 'bmi',
      name: 'BMI 计算器',
      icon: '⚖️',
      description: '计算身体质量指数，评估体重状况',
      href: '/calculators/bmi',
    },
    {
      id: 'bmr',
      name: 'BMR 计算器',
      icon: '🔥',
      description: '计算基础代谢率和每日热量需求',
      href: '/calculators/bmr',
    },
    {
      id: 'body-fat',
      name: '体脂率计算器',
      icon: '📊',
      description: '估算身体脂肪百分比',
      href: '/calculators/body-fat',
    },
    {
      id: 'waist-hip',
      name: '腰臀比计算器',
      icon: '📏',
      description: '评估中心性肥胖风险',
      href: '/calculators/waist-hip',
    },
    {
      id: 'blood-pressure',
      name: '血压评估',
      icon: '💓',
      description: '评估血压水平和健康状况',
      href: '/calculators/blood-pressure',
    },
    {
      id: 'heart-rate',
      name: '目标心率',
      icon: '❤️',
      description: '计算不同运动强度的目标心率',
      href: '/calculators/target-heart-rate',
    },
    {
      id: 'sli',
      name: '心脏负荷指数',
      icon: '💪',
      description: '评估运动心脏负荷',
      href: '/calculators/sli',
    },
    {
      id: 'calorie',
      name: '卡路里需求',
      icon: '🍽️',
      description: '计算每日卡路里摄入建议',
      href: '/calculators/calorie',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session ? { username: session.username, email: session.email, role: session.role } : null} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            全方位健康管理工具
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            使用科学的健康计算器，轻松追踪和管理您的健康数据
          </p>
          <p className="text-lg text-primary-600 mb-8 font-medium">
            ✨ 无需注册，立即免费使用所有计算器
          </p>
          {!session && (
            <div className="flex gap-4 justify-center">
              <Link href="/calculators">
                <Button size="lg">开始使用计算器</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">注册账户</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            为什么选择我们？
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">完全免费</h3>
              <p className="text-gray-600">
                无需注册登录，所有计算器完全免费使用
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">数据追踪</h3>
              <p className="text-gray-600">
                注册后自动保存历史，可视化展示健康趋势
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">科学准确</h3>
              <p className="text-gray-600">
                基于国际认可的健康计算公式和标准
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">个性化建议</h3>
              <p className="text-gray-600">
                根据您的数据提供定制化的健康建议
              </p>
            </Card>
          </div>
        </div>

        {/* Calculators Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            健康计算工具
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc) => (
              <Link key={calc.id} href={calc.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">{calc.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600">{calc.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 健康计算器. 免责声明：本工具仅供参考，不能替代专业医疗建议。
          </p>
        </div>
      </footer>
    </div>
  )
}

