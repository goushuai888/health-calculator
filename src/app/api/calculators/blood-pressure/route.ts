import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { bloodPressureSchema } from '@/lib/validators'
import { classifyBloodPressure } from '@/lib/calculators'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    const body = await request.json()
    const validatedData = bloodPressureSchema.parse(body)
    
    const { advice } = classifyBloodPressure(
      validatedData.systolic,
      validatedData.diastolic
    )
    
    let recordId = null
    if (session) {
      const record = await prisma.bloodPressureRecord.create({
        data: {
          userId: session.userId,
          systolic: validatedData.systolic,
          diastolic: validatedData.diastolic,
          advice,
        },
      })
      recordId = record.id
    }
    
    return NextResponse.json({
      success: true,
      data: { advice },
      recordId,
      savedToHistory: !!session,
    })
  } catch (error: any) {
    console.error('Blood pressure calculation error:', error)
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
    
    const records = await prisma.bloodPressureRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Get blood pressure records error:', error)
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 })
  }
}

