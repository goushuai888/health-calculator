import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        emailVerified: true,
      },
    })

    // 即使用户不存在，也返回成功消息（安全考虑，不泄露用户是否存在）
    if (!user) {
      return NextResponse.json(
        { message: '如果该邮箱已注册，您将收到密码重置邮件' },
        { status: 200 }
      )
    }

    // 检查邮箱是否已验证
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: '您的邮箱尚未验证，请先完成邮箱验证' },
        { status: 400 }
      )
    }

    // 生成重置令牌（32字节随机字符串）
    const resetToken = crypto.randomBytes(32).toString('hex')

    // 令牌1小时后过期
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1)

    // 保存重置令牌到数据库
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // 发送密码重置邮件
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      username: user.username,
      resetToken,
    })

    if (!emailResult.success) {
      console.error('发送密码重置邮件失败:', emailResult.error)
      return NextResponse.json(
        { error: '发送邮件失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '密码重置邮件已发送，请查收' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}

