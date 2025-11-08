import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { registerSchema } from '@/lib/validators'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入
    const validatedData = registerSchema.parse(body)
    
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
    
    // 生成验证令牌（32字节随机字符串）
    const verificationToken = crypto.randomBytes(32).toString('hex')
    
    // 令牌24小时后过期
    const tokenExpiry = new Date()
    tokenExpiry.setHours(tokenExpiry.getHours() + 24)
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        role: 'USER',
        emailVerified: false,
        verificationToken,
        tokenExpiry,
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
    
    // 发送验证邮件
    const emailResult = await sendVerificationEmail({
      email: user.email,
      username: user.username,
      verificationToken,
    })
    
    if (!emailResult.success) {
      console.error('发送验证邮件失败:', emailResult.error)
      // 即使邮件发送失败，也返回成功（用户已创建）
      return NextResponse.json(
        {
          message: '注册成功，但验证邮件发送失败，请联系管理员',
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            emailVerified: user.emailVerified,
          },
          requiresVerification: true,
        },
        { status: 201 }
      )
    }
    
    return NextResponse.json(
      {
        message: '注册成功！请查收验证邮件',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
        },
        requiresVerification: true,
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

