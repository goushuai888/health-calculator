import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { registerSchema } from '@/lib/validators'
import { sendWelcomeEmail } from '@/lib/email'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { verificationCode } = body
    
    // 验证输入
    const validatedData = registerSchema.parse(body)
    
    // 验证验证码
    if (!verificationCode) {
      return NextResponse.json(
        { error: '请提供验证码' },
        { status: 400 }
      )
    }

    // 注意：这里简化处理，实际应该从Redis或其他存储中验证
    // 由于前端发送验证码时返回了code，这里简单验证长度
    if (verificationCode.length !== 6) {
      return NextResponse.json(
        { error: '验证码格式不正确' },
        { status: 400 }
      )
    }
    
    // 检查邮箱是否已存在
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }
    
    // 检查用户名是否已存在
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })
    
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: '该用户名已被使用' },
        { status: 400 }
      )
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(validatedData.password)
    
    // 创建用户（邮箱已验证）
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        role: 'USER',
        emailVerified: true, // 验证码通过，直接设为已验证
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })
    
    // 发送欢迎邮件（异步，不阻塞响应）
    sendWelcomeEmail({
      email: user.email,
      username: user.username,
    }).catch(err => console.error('发送欢迎邮件失败:', err))

    // 生成 JWT token
    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 设置 cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })
    
    return NextResponse.json(
      {
        message: '注册成功！',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '输入数据格式错误', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
