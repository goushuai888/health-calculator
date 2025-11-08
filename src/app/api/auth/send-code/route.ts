import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendVerificationCode } from '@/lib/email'

// 生成6位数字验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json()

    if (!email || !purpose) {
      return NextResponse.json(
        { error: '请提供邮箱地址和用途' },
        { status: 400 }
      )
    }

    if (purpose !== 'register' && purpose !== 'reset-password') {
      return NextResponse.json(
        { error: '无效的用途' },
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

    // 注册场景：邮箱不应该已存在
    if (purpose === 'register') {
      if (user) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        )
      }
      
      // 注册时暂存验证码到临时存储（实际应该用Redis等，这里简化处理）
      // 注册流程中验证码会在注册API中验证
      const code = generateCode()
      const codeExpiry = new Date()
      codeExpiry.setMinutes(codeExpiry.getMinutes() + 10) // 10分钟过期
      
      // 发送验证码邮件（使用临时用户名）
      const emailResult = await sendVerificationCode({
        email,
        username: '新用户',
        code,
        purpose: 'register',
      })

      if (!emailResult.success) {
        console.error('发送验证码失败:', emailResult.error)
        return NextResponse.json(
          { error: '发送验证码失败，请稍后重试' },
          { status: 500 }
        )
      }

      // 返回验证码（实际生产环境应该存储在服务器端，这里为了简化）
      return NextResponse.json(
        { 
          message: '验证码已发送，请查收邮件',
          code, // 临时：开发时返回验证码，生产环境删除此行
          expiresAt: codeExpiry.toISOString()
        },
        { status: 200 }
      )
    }

    // 重置密码场景：用户必须存在且邮箱已验证
    if (purpose === 'reset-password') {
      if (!user) {
        // 安全考虑：即使用户不存在也返回成功
        return NextResponse.json(
          { message: '如果该邮箱已注册，您将收到验证码' },
          { status: 200 }
        )
      }

      if (!user.emailVerified) {
        return NextResponse.json(
          { error: '您的邮箱尚未验证，无法重置密码' },
          { status: 400 }
        )
      }

      // 生成验证码
      const code = generateCode()
      const codeExpiry = new Date()
      codeExpiry.setMinutes(codeExpiry.getMinutes() + 10) // 10分钟过期

      // 保存验证码到数据库
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode: code,
          codeExpiry,
        },
      })

      // 发送验证码邮件
      const emailResult = await sendVerificationCode({
        email: user.email,
        username: user.username,
        code,
        purpose: 'reset-password',
      })

      if (!emailResult.success) {
        console.error('发送验证码失败:', emailResult.error)
        return NextResponse.json(
          { error: '发送验证码失败，请稍后重试' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: '验证码已发送，请查收邮件' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: '无效的请求' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}

