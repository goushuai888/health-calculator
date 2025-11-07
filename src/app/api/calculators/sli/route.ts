import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sliSchema } from '@/lib/validators'
import { calculateSLI } from '@/lib/calculators'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    const body = await request.json()
    const validatedData = sliSchema.parse(body)
    
    const { sli, advice } = calculateSLI(
      validatedData.age,
      validatedData.exerciseHeartRate,
      validatedData.restingHeartRate,
      validatedData.duration
    )
    
    let recordId = null
    if (session) {
      const record = await prisma.sLIRecord.create({
        data: {
          userId: session.userId,
          age: validatedData.age,
          exerciseHeartRate: validatedData.exerciseHeartRate,
          restingHeartRate: validatedData.restingHeartRate,
          duration: validatedData.duration,
          sli,
          advice,
        },
      })
      recordId = record.id
    }
    
    return NextResponse.json({
      success: true,
      data: { sli, advice },
      recordId,
      savedToHistory: !!session,
    })
  } catch (error: any) {
    console.error('SLI calculation error:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: '输入数据格式错误', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '计算失败' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    const records = await prisma.sLIRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Get SLI records error:', error)
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 })
  }
}

