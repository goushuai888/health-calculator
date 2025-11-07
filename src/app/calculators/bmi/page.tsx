'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export default function BMICalculatorPage() {
  const [formData, setFormData] = useState({
    gender: 'male',
    height: '',
    weight: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
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
          <h1 className="text-3xl font-bold text-gray-900">BMI 计算器</h1>
          <p className="text-gray-600 mt-2">身体质量指数 (Body Mass Index) 是评估体重状况的常用指标</p>
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
                label="身高 (cm)"
                placeholder="170"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                autoComplete="off"
                required
              />

              <Input
                type="number"
                label="体重 (kg)"
                placeholder="65"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                autoComplete="off"
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '计算中...' : '计算 BMI'}
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
                  <p className="text-sm text-gray-600">您的 BMI 指数</p>
                  <p className="text-4xl font-bold text-primary-600 mt-1">{result.bmi}</p>
                </div>
                
                <div className="border-t border-primary-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">健康建议：</p>
                  <p className="text-gray-700">{result.advice}</p>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">BMI 参考范围：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• &lt; 18.5: 体重偏低</li>
                    <li>• 18.5 - 23.9: 正常范围</li>
                    <li>• 24 - 27.9: 超重</li>
                    <li>• ≥ 28: 肥胖</li>
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

