'use client'

import { useState, FormEvent } from 'react'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SLICalculatorPage() {
  const [formData, setFormData] = useState({
    age: '',
    exerciseHeartRate: '',
    restingHeartRate: '',
    duration: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/calculators/sli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          exerciseHeartRate: parseInt(formData.exerciseHeartRate),
          restingHeartRate: parseInt(formData.restingHeartRate),
          duration: parseInt(formData.duration),
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
          <h1 className="text-3xl font-bold text-gray-900">心脏负荷指数 (SLI)</h1>
          <p className="text-gray-600 mt-2">评估运动对心脏的负荷程度</p>
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

              <Input
                type="number"
                label="运动后心率 (次/分)"
                placeholder="140"
                value={formData.exerciseHeartRate}
                onChange={(e) => setFormData({ ...formData, exerciseHeartRate: e.target.value })}
                required
                help="运动结束后立即测量"
              />

              <Input
                type="number"
                label="安静心率 (次/分)"
                placeholder="70"
                value={formData.restingHeartRate}
                onChange={(e) => setFormData({ ...formData, restingHeartRate: e.target.value })}
                required
                help="清晨起床前测量"
              />

              <Input
                type="number"
                label="运动时间 (分钟)"
                placeholder="30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>测量提示：</strong>
                  <br />• 安静心率应在早晨测量
                  <br />• 运动后心率应在结束时立即测量
                  <br />• 确保测量准确性
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '计算中...' : '计算 SLI'}
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
                  <p className="text-sm text-gray-600">心脏负荷指数</p>
                  <p className="text-4xl font-bold text-primary-600 mt-1">{result.sli?.toFixed(1) || '0'}</p>
                </div>
                
                <div className="border-t border-primary-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">健康建议：</p>
                  <p className="text-gray-700">{result.advice}</p>
                </div>

                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">SLI 参考范围：</p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span>优秀</span>
                      <span className="font-medium">8-12</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span>良好</span>
                      <span className="font-medium">13-16</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span>一般</span>
                      <span className="font-medium">17-20</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span>较差</span>
                      <span className="font-medium">21-25</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span>差</span>
                      <span className="font-medium">&gt; 25</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * SLI 越低表示心脏功能越好，运动效率越高
                    </p>
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

