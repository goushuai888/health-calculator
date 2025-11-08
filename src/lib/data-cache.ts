import { cache } from 'react'
import { prisma } from './db'

export const getUserDashboardData = cache(async (userId: string) => {
  const [
    bmiRecords, 
    bmrRecords, 
    bodyFatRecords,
    waistHipRecords,
    bloodPressureRecords,
    targetHeartRateRecords,
    sliRecords,
    calorieRecords
  ] = await Promise.all([
    prisma.bMIRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        height: true,
        weight: true,
        bmi: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.bMRRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bmr: true,
        calorieNeeds: true,
        createdAt: true,
      }
    }),
    prisma.bodyFatRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        waist: true,
        hip: true,
        bodyFatPercentage: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.waistHipRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        waist: true,
        hip: true,
        ratio: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.bloodPressureRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        systolic: true,
        diastolic: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.targetHeartRateRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        age: true,
        maxHeartRate: true,
        warmUpRange: true,
        fatBurnRange: true,
        createdAt: true,
      }
    }),
    prisma.sLIRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        duration: true,
        sli: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.calorieRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        maintenance: true,
        deficit: true,
        surplus: true,
        createdAt: true,
      }
    }),
  ])

  return {
    bmiRecords: bmiRecords ? [bmiRecords] : [],
    bmrRecords: bmrRecords ? [bmrRecords] : [],
    bodyFatRecords: bodyFatRecords ? [bodyFatRecords] : [],
    waistHipRecords: waistHipRecords ? [waistHipRecords] : [],
    bloodPressureRecords: bloodPressureRecords ? [bloodPressureRecords] : [],
    targetHeartRateRecords: targetHeartRateRecords ? [targetHeartRateRecords] : [],
    sliRecords: sliRecords ? [sliRecords] : [],
    calorieRecords: calorieRecords ? [calorieRecords] : [],
  }
})

export const getUserHistoryData = cache(async (userId: string) => {
  const [
    bmiRecords, 
    bmrRecords, 
    bodyFatRecords, 
    waistHipRecords,
    bloodPressureRecords,
    targetHeartRateRecords,
    sliRecords,
    calorieRecords
  ] = await Promise.all([
    prisma.bMIRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        height: true,
        weight: true,
        bmi: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.bMRRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        age: true,
        bmr: true,
        calorieNeeds: true,
        createdAt: true,
      }
    }),
    prisma.bodyFatRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        waist: true,
        hip: true,
        bodyFatPercentage: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.waistHipRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        waist: true,
        hip: true,
        ratio: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.bloodPressureRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        systolic: true,
        diastolic: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.targetHeartRateRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        age: true,
        maxHeartRate: true,
        warmUpRange: true,
        fatBurnRange: true,
        cardioRange: true,
        createdAt: true,
      }
    }),
    prisma.sLIRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        exerciseHeartRate: true,
        duration: true,
        sli: true,
        advice: true,
        createdAt: true,
      }
    }),
    prisma.calorieRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        maintenance: true,
        deficit: true,
        surplus: true,
        createdAt: true,
      }
    }),
  ])

  return {
    bmiRecords,
    bmrRecords,
    bodyFatRecords,
    waistHipRecords,
    bloodPressureRecords,
    targetHeartRateRecords,
    sliRecords,
    calorieRecords,
  }
})

