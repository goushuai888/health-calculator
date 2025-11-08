import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserHistoryData } from '@/lib/data-cache'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { ShortLocalTime } from '@/components/LocalTime'

type HealthRecord = {
  id: string
  type: 'bmi' | 'bmr' | 'bodyFat' | 'waistHip' | 'bloodPressure' | 'targetHeartRate' | 'sli' | 'calorie'
  createdAt: string
  data: any
}

export default async function HistoryPage() {
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
  } = await getUserHistoryData(session.userId)

  // 将所有记录合并为统一格式，并按时间倒序排列
  const allRecords: HealthRecord[] = [
    ...bmiRecords.map(r => ({ id: r.id, type: 'bmi' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...bmrRecords.map(r => ({ id: r.id, type: 'bmr' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...bodyFatRecords.map(r => ({ id: r.id, type: 'bodyFat' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...waistHipRecords.map(r => ({ id: r.id, type: 'waistHip' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...bloodPressureRecords.map(r => ({ id: r.id, type: 'bloodPressure' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...targetHeartRateRecords.map(r => ({ id: r.id, type: 'targetHeartRate' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...sliRecords.map(r => ({ id: r.id, type: 'sli' as const, createdAt: r.createdAt.toISOString(), data: r })),
    ...calorieRecords.map(r => ({ id: r.id, type: 'calorie' as const, createdAt: r.createdAt.toISOString(), data: r })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // 按时间倒序排列

  // 获取记录类型的图标和名称
  const getRecordInfo = (type: HealthRecord['type']) => {
    const info = {
      bmi: { icon: '⚖️', name: 'BMI 记录', color: 'bg-blue-50' },
      bmr: { icon: '🔥', name: 'BMR 记录', color: 'bg-orange-50' },
      bodyFat: { icon: '📊', name: '体脂率记录', color: 'bg-purple-50' },
      waistHip: { icon: '📏', name: '腰臀比记录', color: 'bg-pink-50' },
      bloodPressure: { icon: '💓', name: '血压记录', color: 'bg-red-50' },
      targetHeartRate: { icon: '❤️', name: '目标心率记录', color: 'bg-rose-50' },
      sli: { icon: '💪', name: '心脏负荷指数记录', color: 'bg-indigo-50' },
      calorie: { icon: '🍽️', name: '卡路里需求记录', color: 'bg-green-50' },
    }
    return info[type]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ username: session.username, email: session.email, role: session.role }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">历史记录</h1>
          <p className="text-gray-600 mt-2">查看您的健康数据历史（共 {allRecords.length} 条记录，按时间排序）</p>
        </div>

        {allRecords.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无历史记录</h3>
              <p className="text-gray-600">开始使用计算器来记录您的健康数据吧！</p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-700 whitespace-nowrap">类型</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-700 whitespace-nowrap">时间</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-700">详细数据</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-700 min-w-[200px]">建议</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecords.map((record) => {
                    const info = getRecordInfo(record.type)
                    const { data, type } = record
                    
                    let detailsContent = ''
                    let advice = ''
                    
                    switch (type) {
                      case 'bmi':
                        detailsContent = `身高 ${data.height}cm · 体重 ${data.weight}kg · BMI ${data.bmi}`
                        advice = data.advice
                        break
                      case 'bmr':
                        detailsContent = `年龄 ${data.age}岁 · BMR ${data.bmr}千卡 · 卡路里需求 ${data.calorieNeeds}千卡`
                        advice = data.advice || '-'
                        break
                      case 'bodyFat':
                        detailsContent = `腰围 ${data.waist}cm · 臀围 ${data.hip}cm · 体脂率 ${data.bodyFatPercentage}%`
                        advice = data.advice
                        break
                      case 'waistHip':
                        detailsContent = `腰围 ${data.waist}cm · 臀围 ${data.hip}cm · 腰臀比 ${data.ratio}`
                        advice = data.advice
                        break
                      case 'bloodPressure':
                        detailsContent = `收缩压 ${data.systolic}mmHg · 舒张压 ${data.diastolic}mmHg`
                        advice = data.advice
                        break
                      case 'targetHeartRate':
                        detailsContent = `年龄 ${data.age}岁 · 最大心率 ${data.maxHeartRate}bpm · 目标区间 ${data.targetMin}-${data.targetMax}bpm`
                        advice = data.advice || '-'
                        break
                      case 'sli':
                        detailsContent = `运动心率 ${data.exerciseHeartRate}bpm · 运动时长 ${data.exerciseDuration}分钟 · SLI ${data.sli}`
                        advice = data.advice
                        break
                      case 'calorie':
                        const goalText = data.goal === 'lose' ? '减重' : data.goal === 'maintain' ? '维持' : '增重'
                        detailsContent = `目标 ${goalText} · 维持 ${Math.round(data.maintenance)}千卡 · 减重 ${Math.round(data.deficit)}千卡 · 增重 ${Math.round(data.surplus)}千卡`
                        advice = data.advice || '-'
                        break
                    }
                    
                    return (
                      <tr key={record.id} className={`border-b border-gray-100 ${info.color} hover:bg-opacity-80 transition-colors`}>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{info.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{info.name.replace(' 记录', '')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600 whitespace-nowrap">
                          <ShortLocalTime date={record.createdAt} />
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-900">
                          {detailsContent}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {advice}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
