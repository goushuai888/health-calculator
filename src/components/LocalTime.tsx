'use client'

import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface LocalTimeProps {
  date: Date | string
  formatStr?: string
  className?: string
}

/**
 * 本地时间显示组件
 * 自动将 UTC 时间转换为用户本地时区
 */
export function LocalTime({ date, formatStr = 'yyyy-MM-dd HH:mm:ss', className }: LocalTimeProps) {
  // 确保转换为 Date 对象
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // format() 函数会自动使用浏览器的本地时区
  return (
    <span className={className}>
      {format(dateObj, formatStr, { locale: zhCN })}
    </span>
  )
}

/**
 * 简短时间格式（月-日 时:分）
 */
export function ShortLocalTime({ date, className }: { date: Date | string; className?: string }) {
  return <LocalTime date={date} formatStr="MM-dd HH:mm" className={className} />
}

/**
 * 完整时间格式（年-月-日 时:分:秒）
 */
export function FullLocalTime({ date, className }: { date: Date | string; className?: string }) {
  return <LocalTime date={date} formatStr="yyyy-MM-dd HH:mm:ss" className={className} />
}

/**
 * 仅日期格式（年-月-日）
 */
export function DateOnly({ date, className }: { date: Date | string; className?: string }) {
  return <LocalTime date={date} formatStr="yyyy-MM-dd" className={className} />
}

