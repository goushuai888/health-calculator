'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function TargetHeartRateCalculatorPage() {
  const [formData, setFormData] = useState({
    age: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/target-heart-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
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
          <h1 className="text-3xl font-bold text-gray-900">目标心率计算器</h1>
          <p className="text-gray-600 mt-2">计算不同运动强度下的目标心率区间</p>
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
                label="年龄"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>说明：</strong>
                  <br />• 热身区：适合初学者和恢复训练
                  <br />• 燃脂区：有效燃烧脂肪
                  <br />• 有氧区：提升心肺功能
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '计算中...' : '计算目标心率'}
              </Button>
            </form>
          </Card>

          {result && (
            <Card title="计算结果" className="bg-primary-50">
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
                      ✅ 计算结果已保存到您的历史记录
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">最大心率</p>
                  <p className="text-4xl font-bold text-primary-600 mt-1">{result.maxHeartRate} 次/分</p>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-900">热身区 (50-60%)</p>
                      <p className="text-sm font-semibold text-gray-900">{result.warmUpRange}</p>
                    </div>
                    <p className="text-xs text-gray-600">适合：热身、放松、恢复训练</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-900">燃脂区 (60-70%)</p>
                      <p className="text-sm font-semibold text-gray-900">{result.fatBurnRange}</p>
                    </div>
                    <p className="text-xs text-gray-600">适合：减脂、长时间有氧运动</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-900">有氧区 (70-85%)</p>
                      <p className="text-sm font-semibold text-gray-900">{result.cardioRange}</p>
                    </div>
                    <p className="text-xs text-gray-600">适合：提升心肺耐力、竞技训练</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">运动建议：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 初学者：从热身区和燃脂区开始</li>
                    <li>• 减脂目标：在燃脂区保持 30-60 分钟</li>
                    <li>• 提升体能：在有氧区间歇训练</li>
                    <li>• 运动时监测心率，避免过度疲劳</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </CalculatorLayout>
  )
}

