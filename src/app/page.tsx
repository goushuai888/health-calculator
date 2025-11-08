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
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              为什么选择我们？
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              专业、免费、易用的健康管理解决方案
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* 完全免费 */}
            <div className="group">
              <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary-200">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative text-5xl">🎁</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  完全免费
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  无需注册登录，所有计算器完全免费使用
                </p>
              </Card>
            </div>

            {/* 数据追踪 */}
            <div className="group">
              <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-green-200">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative text-5xl">📈</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                  数据追踪
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  注册后自动保存历史，可视化展示健康趋势
                </p>
              </Card>
            </div>

            {/* 科学准确 */}
            <div className="group">
              <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-200">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative text-5xl">🔬</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  科学准确
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  基于国际认可的健康计算公式和标准
                </p>
              </Card>
            </div>

            {/* 个性化建议 */}
            <div className="group">
              <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-200">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative text-5xl">🎯</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  个性化建议
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  根据您的数据提供定制化的健康建议
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Calculators Grid */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              健康计算工具
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              8 种专业健康评估工具，一键获取个性化建议
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc) => (
              <Link key={calc.id} href={calc.href}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-primary-100">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative text-5xl">{calc.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{calc.description}</p>
                  <div className="flex items-center justify-center mt-auto pt-3 border-t border-gray-100">
                    <span className="text-primary-600 text-sm font-semibold flex items-center group-hover:text-primary-700 transition-colors">
                      立即使用
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
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

