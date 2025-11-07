import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  // 获取最近的计算记录
  const [bmiRecords, bmrRecords, bodyFatRecords] = await Promise.all([
    prisma.bMIRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    }),
    prisma.bMRRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    }),
    prisma.bodyFatRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    }),
  ])

  const latestBMI = bmiRecords[0]
  const latestBMR = bmrRecords[0]
  const latestBodyFat = bodyFatRecords[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ username: session.username, email: session.email, role: session.role }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-2">欢迎回来，{session.username}！</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">最新 BMI</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">
                  {latestBMI ? latestBMI.bmi : '--'}
                </p>
              </div>
              <div className="text-4xl">⚖️</div>
            </div>
            {latestBMI && (
              <p className="text-sm text-gray-600 mt-2">
                {new Date(latestBMI.createdAt).toLocaleDateString('zh-CN')}
              </p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">基础代谢率</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">
                  {latestBMR ? latestBMR.bmr : '--'}
                </p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
            {latestBMR && (
              <p className="text-sm text-gray-600 mt-2">千卡/天</p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">体脂率</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">
                  {latestBodyFat ? `${latestBodyFat.bodyFatPercentage}%` : '--'}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            {latestBodyFat && (
              <p className="text-sm text-gray-600 mt-2">
                {new Date(latestBodyFat.createdAt).toLocaleDateString('zh-CN')}
              </p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="快速操作" className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/calculators/bmi" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <div className="text-3xl mb-2">⚖️</div>
              <p className="font-medium">BMI 计算</p>
            </Link>
            <Link href="/calculators/bmr" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <div className="text-3xl mb-2">🔥</div>
              <p className="font-medium">BMR 计算</p>
            </Link>
            <Link href="/calculators/body-fat" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-medium">体脂率</p>
            </Link>
            <Link href="/calculators/blood-pressure" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <div className="text-3xl mb-2">💓</div>
              <p className="font-medium">血压评估</p>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        {latestBMI && (
          <Card title="最近活动">
            <div className="space-y-4">
              <div className="flex items-start border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex-1">
                  <p className="font-medium">BMI 计算</p>
                  <p className="text-sm text-gray-600 mt-1">{latestBMI.advice}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(latestBMI.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                查看全部历史记录 →
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

