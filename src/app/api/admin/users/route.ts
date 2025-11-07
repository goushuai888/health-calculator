import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 获取所有用户列表（仅管理员）
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role') // 'ADMIN' | 'USER' | null
    const isActive = searchParams.get('isActive') // 'true' | 'false' | null
    
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === 'true'
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          avatar: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              bmiRecords: true,
              bmrRecords: true,
              bodyFatRecords: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}

