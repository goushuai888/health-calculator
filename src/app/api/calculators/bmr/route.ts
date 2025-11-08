import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { bmrSchema } from '@/lib/validators'
import { calculateBMR } from '@/lib/calculators'

// 活动水平映射
const activityLevelMap: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    const body = await request.json()
    const validatedData = bmrSchema.parse(body)
    
    const activityLevelValue = activityLevelMap[validatedData.activityLevel]
    
    const { bmr, calorieNeeds, advice } = calculateBMR(
      validatedData.gender,
      validatedData.age,
      validatedData.height,
      validatedData.weight,
      activityLevelValue
    )
    
    let recordId = null
    if (session) {
      const record = await prisma.bMRRecord.create({
        data: {
          userId: session.userId,
          gender: validatedData.gender,
          age: validatedData.age,
          height: validatedData.height,
          weight: validatedData.weight,
          activityLevel: activityLevelValue,
          bmr,
          calorieNeeds,
        },
      })
      recordId = record.id
      
      // 刷新历史记录页面缓存
      revalidatePath('/history')
    }
    
    return NextResponse.json({
      success: true,
      data: { bmr, calorieNeeds, advice },
      recordId,
      savedToHistory: !!session,
    })
  } catch (error: any) {
    console.error('BMR calculation error:', error)
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
    
    const records = await prisma.bMRRecord.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Get BMR records error:', error)
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 })
  }
}

