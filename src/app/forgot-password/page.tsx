'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '发送失败')
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
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">忘记密码</h1>
          <p className="text-gray-600">
            输入您的邮箱地址，我们将发送重置密码的链接
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                邮件已发送！
              </h3>
              <p className="text-green-700 mb-4">
                我们已向 <strong>{email}</strong> 发送了密码重置链接。
              </p>
              <p className="text-sm text-green-600">
                请查收邮件并点击链接重置密码。链接将在 1 小时后失效。
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                variant="secondary"
                className="w-full"
              >
                重新发送
              </Button>
              
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  返回登录
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
              label="邮箱地址"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '发送中...' : '发送重置链接'}
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

