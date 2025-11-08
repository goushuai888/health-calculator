'use client'

import { useState, FormEvent, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!token) {
      setError('重置链接无效')
    }
  }, [token])

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (success && countdown === 0) {
      router.push('/login')
    }
  }, [success, countdown, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('重置链接无效')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '重置失败')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">重置密码</h1>
          <p className="text-gray-600">设置您的新密码</p>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                密码重置成功！
              </h3>
              <p className="text-green-700 mb-2">
                您的密码已成功重置。
              </p>
              <p className="text-sm text-green-600">
                {countdown} 秒后自动跳转到登录页面...
              </p>
            </div>

            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              立即登录
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              type="password"
              name="password"
              label="新密码"
              placeholder="请输入新密码（至少6个字符）"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              disabled={!token}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="确认新密码"
              placeholder="请再次输入新密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              disabled={!token}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !token}
            >
              {loading ? '重置中...' : '重置密码'}
            </Button>

            <div className="text-center space-y-2">
              <Link
                href="/login"
                className="block text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                返回登录
              </Link>
              <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">加载中...</div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}

