import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserDashboardData } from '@/lib/data-cache'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { FullLocalTime } from '@/components/LocalTime'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const {
    bmiRecords,
    bmrRecords,
    bodyFatRecords,
    waistHipRecords,
    bloodPressureRecords,
    targetHeartRateRecords,
    sliRecords,
    calorieRecords
  } = await getUserDashboardData(session.userId)

  const latestBMI = bmiRecords[0]
  const latestBMR = bmrRecords[0]
  const latestBodyFat = bodyFatRecords[0]

  // 找出所有记录中最新的一条
  type LatestRecord = {
    type: string
    icon: string
    title: string
    advice: string
    createdAt: Date
    data?: any
  }

  const allLatest: LatestRecord[] = []
  
  if (latestBMI) {
    allLatest.push({
      type: 'bmi',
      icon: '⚖️',
      title: 'BMI 计算',
      advice: latestBMI.advice,
      createdAt: latestBMI.createdAt,
      data: `身高 ${latestBMI.height}cm · 体重 ${latestBMI.weight}kg · BMI ${latestBMI.bmi}`
    })
  }
  
  if (latestBMR) {
    allLatest.push({
      type: 'bmr',
      icon: '🔥',
      title: 'BMR 计算',
      advice: `基础代谢率 ${latestBMR.bmr} 千卡/天`,
      createdAt: latestBMR.createdAt,
      data: `每日热量需求 ${latestBMR.calorieNeeds} 千卡`
    })
  }
  
  if (latestBodyFat) {
    allLatest.push({
      type: 'bodyFat',
      icon: '📊',
      title: '体脂率记录',
      advice: latestBodyFat.advice,
      createdAt: latestBodyFat.createdAt,
      data: `腰围 ${latestBodyFat.waist}cm · 臀围 ${latestBodyFat.hip}cm · 体脂率 ${latestBodyFat.bodyFatPercentage}%`
    })
  }

  if (waistHipRecords[0]) {
    const record = waistHipRecords[0]
    allLatest.push({
      type: 'waistHip',
      icon: '📏',
      title: '腰臀比记录',
      advice: record.advice,
      createdAt: record.createdAt,
      data: `腰围 ${record.waist}cm · 臀围 ${record.hip}cm · 腰臀比 ${record.ratio}`
    })
  }

  if (bloodPressureRecords[0]) {
    const record = bloodPressureRecords[0]
    allLatest.push({
      type: 'bloodPressure',
      icon: '💓',
      title: '血压记录',
      advice: record.advice,
      createdAt: record.createdAt,
      data: `收缩压 ${record.systolic}mmHg · 舒张压 ${record.diastolic}mmHg`
    })
  }

  if (targetHeartRateRecords[0]) {
    const record = targetHeartRateRecords[0]
    allLatest.push({
      type: 'targetHeartRate',
      icon: '❤️',
      title: '目标心率',
      advice: `热身区间 ${record.warmUpRange}，燃脂区间 ${record.fatBurnRange}`,
      createdAt: record.createdAt,
      data: `年龄 ${record.age}岁 · 最大心率 ${record.maxHeartRate}bpm`
    })
  }

  if (sliRecords[0]) {
    const record = sliRecords[0]
    allLatest.push({
      type: 'sli',
      icon: '🏃',
      title: '睡眠潜伏指数',
      advice: record.advice,
      createdAt: record.createdAt,
      data: `入睡时长 ${record.duration}分钟 · SLI ${record.sli}`
    })
  }

  if (calorieRecords[0]) {
    const record = calorieRecords[0]
    allLatest.push({
      type: 'calorie',
      icon: '🍽️',
      title: '热量需求',
      advice: `维持体重: ${record.maintenance} 千卡/天`,
      createdAt: record.createdAt,
      data: `减重: ${record.deficit} 千卡/天 · 增重: ${record.surplus} 千卡/天`
    })
  }

  // 按时间倒序排序，取最新的一条
  const latestActivity = allLatest.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]

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
                <FullLocalTime date={latestBMI.createdAt} />
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
                <FullLocalTime date={latestBodyFat.createdAt} />
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
        {latestActivity && (
          <Card title="最近活动">
            <div className="space-y-4">
              <div className="flex items-start border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{latestActivity.icon}</span>
                    <p className="font-medium">{latestActivity.title}</p>
                  </div>
                  {latestActivity.data && (
                    <p className="text-sm text-gray-500 mt-1">{latestActivity.data}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{latestActivity.advice}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <FullLocalTime date={latestActivity.createdAt} />
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

