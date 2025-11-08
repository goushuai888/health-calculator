import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json()

    if (!email || !code || !password) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // 查找用户并验证验证码
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        codeExpiry: {
          gt: new Date(), // 验证码未过期
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    // 加密新密码
    const hashedPassword = await hashPassword(password)

    // 更新密码并清除验证码
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        codeExpiry: null,
      },
    })

    return NextResponse.json(
      { 
        message: '密码重置成功！',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
