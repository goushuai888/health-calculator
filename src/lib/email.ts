import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationEmailParams {
  email: string
  username: string
  verificationToken: string
}

export async function sendVerificationEmail({
  email,
  username,
  verificationToken,
}: SendVerificationEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '验证您的邮箱 - 健康计算器',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 48px;
                margin-bottom: 10px;
              }
              h1 {
                color: #2563eb;
                margin: 0 0 20px 0;
                font-size: 24px;
              }
              .content {
                margin-bottom: 30px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                background-color: #2563eb;
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 6px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #1d4ed8;
              }
              .link {
                word-break: break-all;
                color: #6b7280;
                font-size: 14px;
                margin-top: 20px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
                text-align: center;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏥</div>
                <h1>验证您的邮箱</h1>
              </div>
              
              <div class="content">
                <p>您好 <strong>${username}</strong>，</p>
                <p>感谢您注册健康计算器！请点击下方按钮验证您的邮箱地址：</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">
                    验证邮箱
                  </a>
                </div>
                
                <p class="link">
                  或复制以下链接到浏览器：<br>
                  <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
                
                <div class="warning">
                  ⏰ <strong>注意：</strong>此验证链接将在 24 小时后失效。
                </div>
                
                <p>如果您没有注册健康计算器账户，请忽略此邮件。</p>
              </div>
              
              <div class="footer">
                <p>
                  此邮件由健康计算器自动发送，请勿直接回复。<br>
                  © 2024 健康计算器. 保留所有权利。
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('发送验证邮件失败:', error)
      return { success: false, error }
    }

    console.log('验证邮件发送成功:', data)
    return { success: true, data }
  } catch (error) {
    console.error('发送验证邮件异常:', error)
    return { success: false, error }
  }
}

interface SendWelcomeEmailParams {
  email: string
  username: string
}

export async function sendWelcomeEmail({
  email,
  username,
}: SendWelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '欢迎使用健康计算器！',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #2563eb;
                font-size: 24px;
              }
              .features {
                margin: 30px 0;
              }
              .feature {
                margin: 15px 0;
                padding-left: 30px;
                position: relative;
              }
              .feature:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
                font-size: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">🎉</div>
              <h1>欢迎加入健康计算器！</h1>
              <p>您好 <strong>${username}</strong>，</p>
              <p>您的邮箱已验证成功！现在您可以享受以下功能：</p>
              
              <div class="features">
                <div class="feature">自动保存所有健康计算历史</div>
                <div class="feature">可视化展示健康数据趋势</div>
                <div class="feature">获取个性化的健康建议</div>
                <div class="feature">8 种专业健康评估工具</div>
              </div>
              
              <p>立即开始您的健康管理之旅吧！</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                   style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600;">
                  前往仪表板
                </a>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('发送欢迎邮件失败:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('发送欢迎邮件异常:', error)
    return { success: false, error }
  }
}

interface SendPasswordResetEmailParams {
  email: string
  username: string
  resetToken: string
}

export async function sendPasswordResetEmail({
  email,
  username,
  resetToken,
}: SendPasswordResetEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '重置您的密码 - 健康计算器',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 48px;
                margin-bottom: 10px;
              }
              h1 {
                color: #dc2626;
                margin: 0 0 20px 0;
                font-size: 24px;
              }
              .content {
                margin-bottom: 30px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                background-color: #dc2626;
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 6px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #b91c1c;
              }
              .link {
                word-break: break-all;
                color: #6b7280;
                font-size: 14px;
                margin-top: 20px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
                text-align: center;
              }
              .warning {
                background-color: #fee2e2;
                border-left: 4px solid #dc2626;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
              }
              .info {
                background-color: #dbeafe;
                border-left: 4px solid #3b82f6;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🔐</div>
                <h1>重置您的密码</h1>
              </div>
              
              <div class="content">
                <p>您好 <strong>${username}</strong>，</p>
                <p>我们收到了您的密码重置请求。请点击下方按钮重置您的密码：</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">
                    重置密码
                  </a>
                </div>
                
                <p class="link">
                  或复制以下链接到浏览器：<br>
                  <a href="${resetUrl}">${resetUrl}</a>
                </p>
                
                <div class="warning">
                  ⏰ <strong>注意：</strong>此重置链接将在 1 小时后失效。
                </div>
                
                <div class="info">
                  🔒 <strong>安全提示：</strong>如果您没有请求重置密码，请忽略此邮件。您的密码不会被更改。
                </div>
              </div>
              
              <div class="footer">
                <p>
                  此邮件由健康计算器自动发送，请勿直接回复。<br>
                  © 2024 健康计算器. 保留所有权利。
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('发送密码重置邮件失败:', error)
      return { success: false, error }
    }

    console.log('密码重置邮件发送成功:', data)
    return { success: true, data }
  } catch (error) {
    console.error('发送密码重置邮件异常:', error)
    return { success: false, error }
  }
}

