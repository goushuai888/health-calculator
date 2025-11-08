'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('请先输入邮箱地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setError('')
    setSendingCode(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          purpose: 'reset-password',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '发送验证码失败')
        return
      }

      setCodeSent(true)
      setCountdown(60) // 60秒倒计时

      // 开始倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.verificationCode) {
      setError('请输入验证码')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
          password: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '重置失败')
        return
      }

      setSuccess(true)
      
      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 3000)
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
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">重置密码</h1>
          <p className="text-gray-600">
            输入邮箱验证码以重置您的密码
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                密码重置成功！
              </h3>
              <p className="text-green-700 mb-2">
                您的密码已成功重置。
              </p>
              <p className="text-sm text-green-600">
                3秒后自动跳转到登录页面...
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒` : codeSent ? '重新发送' : '发送验证码'}
                </Button>
              </div>
            </div>

            {codeSent && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                📧 验证码已发送到您的邮箱，请查收（有效期10分钟）
              </div>
            )}

            <Input
              type="text"
              name="verificationCode"
              label="验证码"
              placeholder="请输入6位验证码"
              value={formData.verificationCode}
              onChange={handleChange}
              maxLength={6}
              required
              disabled={!codeSent}
            />

            <Input
              type="password"
              name="newPassword"
              label="新密码"
              placeholder="请输入新密码（至少6个字符）"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
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
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !codeSent}
            >
              {loading ? '重置中...' : '重置密码'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                想起密码了？{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  立即登录
                </Link>
              </p>
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
