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
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '注册失败')
        return
      }

      // 如果需要邮箱验证
      if (data.requiresVerification) {
        setRegisteredEmail(formData.email)
        setSuccess(true)
        return
      }

      // 注册成功后，刷新全局用户状态
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

        {success ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                注册成功！请验证您的邮箱
              </h3>
              <p className="text-blue-700 mb-4">
                我们已向 <strong>{registeredEmail}</strong> 发送了验证邮件。
              </p>
              <div className="bg-white rounded p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">📝 <strong>下一步：</strong></p>
                <ol className="text-sm text-gray-600 text-left space-y-1 list-decimal list-inside">
                  <li>检查您的邮箱收件箱</li>
                  <li>找到来自健康计算器的邮件</li>
                  <li>点击邮件中的验证按钮</li>
                  <li>验证成功后即可登录</li>
                </ol>
              </div>
              <p className="text-xs text-blue-600">
                💡 验证链接将在 24 小时后失效
              </p>
              <p className="text-xs text-gray-500 mt-2">
                没收到邮件？请检查垃圾邮件文件夹
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                前往登录
              </Button>
              
              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← 返回首页
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            label="邮箱地址"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>
        )}

        {!success && (
          <>
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
          </>
        )}
      </Card>
    </div>
  )
}

