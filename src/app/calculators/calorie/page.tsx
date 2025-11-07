'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export default function CalorieCalculatorPage() {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'sedentary',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/calorie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: formData.gender,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel,
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
          <h1 className="text-3xl font-bold text-gray-900">卡路里需求计算器</h1>
          <p className="text-gray-600 mt-2">根据您的目标计算每日所需卡路里</p>
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

              <Select
                label="活动水平"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                options={[
                  { value: 'sedentary', label: '久坐 (很少运动)' },
                  { value: 'light', label: '轻度活动 (每周1-3天运动)' },
                  { value: 'moderate', label: '中度活动 (每周3-5天运动)' },
                  { value: 'active', label: '高度活动 (每周6-7天运动)' },
                  { value: 'veryActive', label: '非常活跃 (体力劳动或专业运动员)' },
                ]}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '计算中...' : '计算卡路里需求'}
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
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">维持体重</p>
                    <p className="text-3xl font-bold text-blue-600">{result.maintenance?.toFixed(0) || '0'} 千卡/天</p>
                    <p className="text-xs text-gray-500 mt-1">保持当前体重的每日摄入量</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">减重目标</p>
                    <p className="text-2xl font-bold text-green-600">{result.deficit?.toFixed(0) || '0'} 千卡/天</p>
                    <p className="text-xs text-gray-500 mt-1">每周减重约 0.5 kg</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600 mb-1">增重目标</p>
                    <p className="text-2xl font-bold text-orange-600">{result.surplus?.toFixed(0) || '0'} 千卡/天</p>
                    <p className="text-xs text-gray-500 mt-1">每周增重约 0.5 kg</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">营养建议：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>蛋白质：</strong>体重 × 1.6-2.2g (增肌/减脂)</li>
                    <li>• <strong>脂肪：</strong>总热量的 20-35%</li>
                    <li>• <strong>碳水化合物：</strong>剩余热量来源</li>
                    <li>• 保持均衡饮食，多吃蔬菜水果</li>
                    <li>• 多喝水，每天至少 2 升</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>注意：</strong>
                    <br />• 不建议每日热量低于 1200 千卡（女性）或 1500 千卡（男性）
                    <br />• 减重或增重应循序渐进，避免极端饮食
                    <br />• 如有特殊健康需求，请咨询专业营养师
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </CalculatorLayout>
  )
}

