'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useUser } from '@/contexts/UserContext'

export default function RegisterPage() {
  const router = useRouter()
  const { refreshUser } = useUser()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  })
  const [error, setError] = useState('')
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
          purpose: 'register',
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

      // 开发环境显示验证码（生产环境删除）
      if (data.code) {
        console.log('验证码:', data.code)
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.verificationCode) {
      setError('请输入验证码')
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          verificationCode: formData.verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '注册失败')
        return
      }

      // 注册成功后，刷新全局用户状态并跳转
      await refreshUser()
      router.push('/dashboard')
      router.refresh()
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建账户</h1>
          <p className="text-gray-600">开始您的健康管理之旅</p>
        </div>

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
            type="text"
            name="username"
            label="用户名"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <Input
            type="password"
            name="password"
            label="密码"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <Button type="submit" className="w-full" disabled={loading || !codeSent}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            已有账户？{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              立即登录
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 返回首页
          </Link>
        </div>
      </Card>
    </div>
  )
}
