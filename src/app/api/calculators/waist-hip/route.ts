import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { waistHipSchema } from '@/lib/validators'
import { calculateWaistHipRatio } from '@/lib/calculators'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    const body = await request.json()
    const validatedData = waistHipSchema.parse(body)
    
    const { ratio, advice } = calculateWaistHipRatio(
      validatedData.gender,
      validatedData.waist,
      validatedData.hip
    )
    
    let recordId = null
    if (session) {
      const record = await prisma.waistHipRecord.create({
        data: {
          userId: session.userId,
          gender: validatedData.gender,
          waist: validatedData.waist,
          hip: validatedData.hip,
          ratio,
          advice,
        },
      })
      recordId = record.id
      
      // 刷新历史记录页面缓存
      revalidatePath('/history')
    }
    
    return NextResponse.json({
      success: true,
      data: { ratio, advice },
      recordId,
      savedToHistory: !!session,
    })
  } catch (error: any) {
    console.error('Waist-hip calculation error:', error)
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
    
    const records = await prisma.waistHipRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Get waist-hip records error:', error)
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 })
  }
}

