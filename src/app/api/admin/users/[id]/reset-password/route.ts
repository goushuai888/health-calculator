import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, '密码至少需要6个字符'),
})

// 重置用户密码（仅管理员）
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = resetPasswordSchema.parse(body)
    
    // 防止管理员重置自己的密码（应该通过修改密码功能）
    if (params.id === session.userId) {
      return NextResponse.json(
        { error: '不能通过此功能重置自己的密码，请使用修改密码功能' },
        { status: 400 }
      )
    }
    
    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, username: true, email: true },
    })
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    // 加密新密码
    const hashedPassword = await hashPassword(validatedData.newPassword)
    
    // 更新密码
    await prisma.user.update({
      where: { id: params.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })
    
    return NextResponse.json({
      success: true,
      message: `用户 "${user.username}" 的密码已成功重置`,
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: '重置密码失败' }, { status: 500 })
  }
}

