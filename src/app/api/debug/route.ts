import { NextResponse } from 'next/server'

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
    },
    envVars: {
      DATABASE_URL: process.env.DATABASE_URL ? {
        exists: true,
        length: process.env.DATABASE_URL.length,
        preview: process.env.DATABASE_URL.substring(0, 50) + '...',
        host: extractHost(process.env.DATABASE_URL),
        port: extractPort(process.env.DATABASE_URL),
      } : { exists: false },
      DIRECT_URL: process.env.DIRECT_URL ? {
        exists: true,
        length: process.env.DIRECT_URL.length,
      } : { exists: false },
      JWT_SECRET: process.env.JWT_SECRET ? {
        exists: true,
        length: process.env.JWT_SECRET.length,
      } : { exists: false },
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    },
    prisma: {
      available: true,
      version: '5.22.0',
    }
  }

  return NextResponse.json(debug)
}

function extractHost(url: string): string | null {
  try {
    const match = url.match(/@([^:\/]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function extractPort(url: string): string | null {
  try {
    const match = url.match(/:(\d+)\//)
    return match ? match[1] : null
  } catch {
    return null
  }
}

