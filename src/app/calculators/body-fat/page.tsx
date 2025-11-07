'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export default function BodyFatCalculatorPage() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    waist: '',
    hip: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/body-fat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: formData.gender,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          waist: parseFloat(formData.waist),
          hip: parseFloat(formData.hip),
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
          <h1 className="text-3xl font-bold text-gray-900">体脂率计算器</h1>
          <p className="text-gray-600 mt-2">估算身体脂肪占总体重的百分比</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Select
                label="性别"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={[
                  { value: 'male', label: '男性' },
                  { value: 'female', label: '女性' },
                ]}
              />

              <Input
                type="number"
                label="年龄"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />

              <Input
                type="number"
                label="身高 (cm)"
                placeholder="170"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
              />

              <Input
                type="number"
                label="体重 (kg)"
                placeholder="65"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />

              <Input
                type="number"
                label="腰围 (cm)"
                placeholder="80"
                step="0.1"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                required
              />

              <Input
                type="number"
                label="臀围 (cm)"
                placeholder="95"
                step="0.1"
                value={formData.hip}
                onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '计算中...' : '计算体脂率'}
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
                  <p className="text-sm text-gray-600">体脂率</p>
                  <p className="text-4xl font-bold text-primary-600 mt-1">{result.bodyFatPercentage?.toFixed(1) || '0'}%</p>
                </div>
                
                <div className="border-t border-primary-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">健康建议：</p>
                  <p className="text-gray-700">{result.advice}</p>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">体脂率参考范围：</p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <p className="font-medium">男性：</p>
                      <ul className="ml-4 space-y-1">
                        <li>• 2-5%: 必需脂肪</li>
                        <li>• 6-13%: 运动员</li>
                        <li>• 14-17%: 健美</li>
                        <li>• 18-24%: 正常</li>
                        <li>• 25%以上: 肥胖</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">女性：</p>
                      <ul className="ml-4 space-y-1">
                        <li>• 10-13%: 必需脂肪</li>
                        <li>• 14-20%: 运动员</li>
                        <li>• 21-24%: 健美</li>
                        <li>• 25-31%: 正常</li>
                        <li>• 32%以上: 肥胖</li>
                      </ul>
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

