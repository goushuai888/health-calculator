// 健康计算器核心逻辑

// BMI 计算和建议
export function calculateBMI(height: number, weight: number) {
  const bmi = Number((weight / (height / 100) ** 2).toFixed(2))
  return { bmi, advice: getBMIAdvice(bmi) }
}

function getBMIAdvice(bmi: number): string {
  if (bmi < 18.5) return '体重偏低，建议适当增加营养摄入并关注力量训练。'
  if (bmi < 24) return '体重处于理想范围，请继续保持健康的生活方式。'
  if (bmi < 27) return '体重略微偏高，建议提高日常活动量并管理饮食。'
  if (bmi < 30) return '已接近肥胖区间，请尽快制定运动与饮食计划。'
  return '属于肥胖区间，建议咨询医生并制定减重方案。'
}

// BMR 计算（Harris-Benedict 公式）
export function calculateBMR(
  gender: string,
  age: number,
  height: number,
  weight: number,
  activityLevel: number
) {
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }
  
  const calorieNeeds = Number((bmr * activityLevel).toFixed(0))
  
  return {
    bmr: Number(bmr.toFixed(0)),
    calorieNeeds,
    advice: `根据您的活动水平，建议您每日摄入约 ${calorieNeeds} 千卡来维持当前体重。`,
  }
}

// 体脂率计算（US Navy Method）
export function calculateBodyFat(
  gender: string,
  height: number,
  waist: number,
  hip: number
) {
  let bodyFatPercentage: number
  
  if (gender === 'male') {
    bodyFatPercentage = 86.010 * Math.log10(waist) - 70.041 * Math.log10(height) + 36.76
  } else {
    bodyFatPercentage = 163.205 * Math.log10(waist + hip) - 97.684 * Math.log10(height) - 78.387
  }
  
  bodyFatPercentage = Math.max(0, Number(bodyFatPercentage.toFixed(2)))
  
  return {
    bodyFatPercentage,
    advice: getBodyFatAdvice(bodyFatPercentage, gender === 'male'),
  }
}

function getBodyFatAdvice(percentage: number, isMale: boolean): string {
  if (isMale) {
    if (percentage < 6) return '体脂偏低，注意补充优质碳水与力量训练。'
    if (percentage <= 24) return '体脂处于健康区间，请保持良好生活方式。'
    if (percentage <= 30) return '体脂略高，建议增加有氧运动并管理饮食。'
    return '体脂较高，建议咨询专业人士制定减脂计划。'
  }
  if (percentage < 16) return '体脂偏低，注意均衡饮食，避免能量摄入不足。'
  if (percentage <= 30) return '体脂处于健康区间，请保持良好生活方式。'
  if (percentage <= 36) return '体脂略高，建议注重作息与有氧训练。'
  return '体脂较高，建议咨询专业人士制定减脂计划。'
}

// 腰臀比计算
export function calculateWaistHipRatio(gender: string, waist: number, hip: number) {
  const ratio = Number((waist / hip).toFixed(2))
  return {
    ratio,
    advice: getWaistHipAdvice(ratio, gender === 'male'),
  }
}

function getWaistHipAdvice(ratio: number, isMale: boolean): string {
  if (isMale) {
    if (ratio < 0.9) return '体型良好，继续保持规律运动与均衡饮食。'
    if (ratio < 1) return '轻度中心性肥胖风险，建议减少精制糖与深夜加餐。'
    return '中心性肥胖风险较高，请咨询医生并制定体重管理计划。'
  }
  if (ratio < 0.8) return '体型良好，继续保持规律运动与均衡饮食。'
  if (ratio < 0.85) return '轻度中心性肥胖风险，建议增加核心肌群训练。'
  return '中心性肥胖风险较高，请咨询医生并制定体重管理计划。'
}

// 血压分类
export function classifyBloodPressure(systolic: number, diastolic: number) {
  let advice: string
  
  if (systolic < 90 || diastolic < 60) {
    advice = '血压偏低，若伴随头晕乏力请咨询医生。'
  } else if (systolic < 120 && diastolic < 80) {
    advice = '血压正常，请保持良好生活方式。'
  } else if (systolic < 130 && diastolic < 80) {
    advice = '血压理想偏高，建议维持健康饮食并规律运动。'
  } else if (systolic < 140 || diastolic < 90) {
    advice = '已达高血压前期，建议减少钠盐摄入并监测血压变化。'
  } else if (systolic < 160 || diastolic < 100) {
    advice = '属于 1 级高血压，请尽快就诊并听取医生建议。'
  } else {
    advice = '属于 2 级或更高阶段高血压，请立即寻求专业医疗帮助。'
  }
  
  return { advice }
}

// 目标心率计算
export function calculateTargetHeartRate(age: number) {
  const maxHeartRate = 220 - age
  const warmUpRange = `${Math.round(maxHeartRate * 0.5)} - ${Math.round(maxHeartRate * 0.6)}`
  const fatBurnRange = `${Math.round(maxHeartRate * 0.6)} - ${Math.round(maxHeartRate * 0.7)}`
  const cardioRange = `${Math.round(maxHeartRate * 0.7)} - ${Math.round(maxHeartRate * 0.85)}`
  
  return {
    maxHeartRate,
    warmUpRange,
    fatBurnRange,
    cardioRange,
  }
}

// 心脏负荷指数 (SLI) 计算
export function calculateSLI(
  age: number,
  exerciseHeartRate: number,
  restingHeartRate: number,
  duration: number
) {
  const heartReserve = exerciseHeartRate - restingHeartRate
  const sli = Number(((heartReserve * duration) / Math.max(age, 1)).toFixed(1))
  
  return {
    sli,
    advice: getSLIAdvice(sli),
  }
}

function getSLIAdvice(sli: number): string {
  if (sli < 10) return '运动强度较低，可适当延长时长或提高运动强度。'
  if (sli < 25) return '负荷适中，保持规律运动有助于心血管健康。'
  if (sli < 40) return '负荷较高，请确保充分热身与拉伸，关注运动过程中的不适。'
  return '负荷非常高，建议在专业教练或医生指导下进行高强度训练。'
}

// 卡路里需求计算
export function calculateCalorieNeeds(
  gender: string,
  age: number,
  height: number,
  weight: number,
  activityLevel: number
) {
  const { bmr } = calculateBMR(gender, age, height, weight, activityLevel)
  const maintenance = Number((bmr * activityLevel).toFixed(0))
  const deficit = Math.max(maintenance - 500, 0)
  const surplus = maintenance + 300
  
  return {
    maintenance,
    deficit,
    surplus,
  }
}

