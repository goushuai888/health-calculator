import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 获取系统统计数据（仅管理员）
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalRecords,
      todayUsers,
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),
      
      // 活跃用户数
      prisma.user.count({ where: { isActive: true } }),
      
      // 管理员数量
      prisma.user.count({ where: { role: 'ADMIN' } }),
      
      // 总记录数
      Promise.all([
        prisma.bMIRecord.count(),
        prisma.bMRRecord.count(),
        prisma.bodyFatRecord.count(),
        prisma.waistHipRecord.count(),
        prisma.bloodPressureRecord.count(),
      ]).then(counts => counts.reduce((a, b) => a + b, 0)),
      
      // 今日新增用户
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])
    
    // 最近注册用户
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    
    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalRecords,
        todayUsers,
      },
      recentUsers,
    })
  } catch (error: any) {
    console.error('Get stats error:', error)
    
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}

