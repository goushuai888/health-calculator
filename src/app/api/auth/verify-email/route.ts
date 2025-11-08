import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'
import { createSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '缺少验证令牌' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        tokenExpiry: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: '无效的验证令牌' },
        { status: 400 }
      )
    }

    // 检查令牌是否已过期
    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return NextResponse.json(
        { error: '验证令牌已过期，请重新注册或联系管理员' },
        { status: 400 }
      )
    }

    // 检查是否已验证
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          message: '邮箱已验证过，无需重复验证',
          alreadyVerified: true 
        },
        { status: 200 }
      )
    }

    // 更新用户状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        tokenExpiry: null,
      },
    })

    // 发送欢迎邮件
    await sendWelcomeEmail({
      email: user.email,
      username: user.username,
    })

    // 创建会话，自动登录
    await createSession(user.id, user.email, user.username, user.role)

    return NextResponse.json(
      {
        message: '邮箱验证成功！',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: '验证失败，请稍后重试' },
      { status: 500 }
    )
  }
}

