'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function BloodPressureCalculatorPage() {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/blood-pressure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systolic: parseInt(formData.systolic),
          diastolic: parseInt(formData.diastolic),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '计算失败')
        return
      }

      setResult({
        ...data.data,
        savedToHistory: data.savedToHistory,
      })
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalculatorLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">血压评估</h1>
          <p className="text-gray-600 mt-2">根据血压值评估您的心血管健康状况</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                type="number"
                label="收缩压 (mmHg)"
                placeholder="120"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                required
                help="高压值，心脏收缩时的压力"
              />

              <Input
                type="number"
                label="舒张压 (mmHg)"
                placeholder="80"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                required
                help="低压值，心脏舒张时的压力"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>测量提示：</strong>
                  <br />• 测量前休息 5 分钟
                  <br />• 避免咖啡因和运动
                  <br />• 坐姿，手臂与心脏同高
                  <br />• 测量 2-3 次取平均值
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '评估中...' : '评估血压'}
              </Button>
            </form>
          </Card>

          {result && (
            <Card title="评估结果" className="bg-primary-50">
              <div className="space-y-4">
                {!result.savedToHistory && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      💡 <a href="/login" className="font-medium underline">登录</a> 或 <a href="/register" className="font-medium underline">注册</a> 后可自动保存您的计算历史
                    </p>
                  </div>
                )}
                
                {result.savedToHistory && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      ✅ 评估结果已保存到您的历史记录
                    </p>
                  </div>
                )}
                
                <div className="border-t border-primary-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">健康建议：</p>
                  <p className="text-gray-700">{result.advice}</p>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">血压分类标准 (mmHg)：</p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="font-medium">理想血压</span>
                      <span>&lt; 120 / &lt; 80</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">正常血压</span>
                      <span>120-129 / 80-84</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="font-medium">正常高值</span>
                      <span>130-139 / 85-89</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="font-medium">1级高血压</span>
                      <span>140-159 / 90-99</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">2级高血压</span>
                      <span>160-179 / 100-109</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                      <span className="font-medium">3级高血压</span>
                      <span>≥ 180 / ≥ 110</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </CalculatorLayout>
  )
}

