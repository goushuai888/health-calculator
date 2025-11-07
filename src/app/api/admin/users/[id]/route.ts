import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 获取单个用户详情（仅管理员）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        _count: {
          select: {
            bmiRecords: true,
            bmrRecords: true,
            bodyFatRecords: true,
            waistHipRecords: true,
            bloodPressureRecords: true,
            targetHeartRateRecords: true,
            sliRecords: true,
            calorieRecords: true,
          },
        },
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Get user error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 })
  }
}

// 更新用户信息（仅管理员）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    
    const { role, isActive } = body
    
    // 防止管理员修改自己的角色或禁用自己
    if (params.id === session.userId) {
      if (role && role !== session.role) {
        return NextResponse.json(
          { error: '不能修改自己的角色' },
          { status: 400 }
        )
      }
      if (isActive === false) {
        return NextResponse.json(
          { error: '不能禁用自己的账户' },
          { status: 400 }
        )
      }
    }
    
    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json({
      message: '用户信息已更新',
      user,
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    return NextResponse.json({ error: '更新用户信息失败' }, { status: 500 })
  }
}

// 删除用户（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    
    // 防止管理员删除自己
    if (params.id === session.userId) {
      return NextResponse.json(
        { error: '不能删除自己的账户' },
        { status: 400 }
      )
    }
    
    await prisma.user.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: '用户已删除' })
  } catch (error: any) {
    console.error('Delete user error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}

