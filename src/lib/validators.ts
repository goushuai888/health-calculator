import { z } from 'zod'

// 用户注册验证
export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z.string()
    .min(3, '用户名至少需要3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z.string()
    .min(6, '密码至少需要6个字符')
    .max(100, '密码最多100个字符'),
})

// 用户登录验证
export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

// BMI 计算验证
export const bmiSchema = z.object({
  gender: z.enum(['male', 'female']),
  height: z.number().min(50, '身高必须大于50cm').max(300, '身高必须小于300cm'),
  weight: z.number().min(20, '体重必须大于20kg').max(500, '体重必须小于500kg'),
})

// BMR 计算验证
export const bmrSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.number().min(10, '年龄必须大于10岁').max(120, '年龄必须小于120岁'),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
})

// 体脂率计算验证
export const bodyFatSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.number().min(10).max(120),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  waist: z.number().min(30, '腰围必须大于30cm').max(300),
  hip: z.number().min(30, '臀围必须大于30cm').max(300),
})

// 腰臀比计算验证
export const waistHipSchema = z.object({
  gender: z.enum(['male', 'female']),
  waist: z.number().min(30).max(300),
  hip: z.number().min(30).max(300),
})

// 血压评估验证
export const bloodPressureSchema = z.object({
  systolic: z.number().min(50, '收缩压必须大于50').max(250),
  diastolic: z.number().min(30, '舒张压必须大于30').max(200),
})

// 目标心率验证
export const targetHeartRateSchema = z.object({
  age: z.number().min(10, '年龄必须大于10岁').max(90, '年龄必须小于90岁'),
})

// 心脏负荷指数验证
export const sliSchema = z.object({
  age: z.number().min(10).max(120),
  exerciseHeartRate: z.number().min(60, '运动心率必须大于60').max(220),
  restingHeartRate: z.number().min(40, '静息心率必须大于40').max(120),
  duration: z.number().min(1, '运动时长必须大于1分钟').max(300),
})

// 卡路里需求验证
export const calorieSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.number().min(10).max(120),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
})

