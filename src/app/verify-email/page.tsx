'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('缺少验证令牌')
      return
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus('already_verified')
            setMessage(data.message)
          } else {
            setStatus('success')
            setMessage(data.message)
            
            // 3秒后跳转到仪表板
            setTimeout(() => {
              router.push('/dashboard')
            }, 3000)
          }
        } else {
          setStatus('error')
          setMessage(data.error || '验证失败')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('验证过程中出现错误，请稍后重试')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={null} />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                正在验证邮箱...
              </h1>
              <p className="text-gray-600">
                请稍候，我们正在验证您的邮箱地址
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                验证成功！
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="inline-flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                3秒后自动跳转到仪表板...
              </div>
              <div className="mt-6">
                <Button onClick={() => router.push('/dashboard')}>
                  立即前往仪表板
                </Button>
              </div>
            </>
          )}

          {status === 'already_verified' && (
            <>
              <div className="text-6xl mb-6">✓</div>
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                邮箱已验证
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/login')}>
                  前往登录
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  返回首页
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                验证失败
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/register')}>
                  重新注册
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  返回首页
                </Button>
              </div>
            </>
          )}
        </Card>

        {status !== 'loading' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              如有问题，请联系我们的客服支持
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

