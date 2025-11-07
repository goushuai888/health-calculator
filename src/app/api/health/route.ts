import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      databaseUrl: !!process.env.DATABASE_URL,
      directUrl: !!process.env.DIRECT_URL,
      jwtSecret: !!process.env.JWT_SECRET,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    },
    database: {
      connected: false,
      error: null as string | null,
    },
  }

  // 测试数据库连接
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database.connected = true
  } catch (error: any) {
    checks.database.connected = false
    checks.database.error = error.message
  }

  const allChecksPass = 
    checks.checks.databaseUrl &&
    checks.checks.directUrl &&
    checks.checks.jwtSecret &&
    checks.database.connected

  return NextResponse.json(
    {
      status: allChecksPass ? 'healthy' : 'unhealthy',
      ...checks,
    },
    { status: allChecksPass ? 200 : 503 }
  )
}

