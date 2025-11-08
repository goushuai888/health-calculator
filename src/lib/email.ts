import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationCodeParams {
  email: string
  username: string
  code: string
  purpose: 'register' | 'reset-password'
}

export async function sendVerificationCode({
  email,
  username,
  code,
  purpose,
}: SendVerificationCodeParams) {
  const isRegister = purpose === 'register'
  const subject = isRegister ? '邮箱验证码 - 健康计算器' : '密码重置验证码 - 健康计算器'
  const title = isRegister ? '验证您的邮箱' : '重置您的密码'
  const icon = isRegister ? '🏥' : '🔐'
  const description = isRegister 
    ? '感谢您注册健康计算器！请使用以下验证码完成注册：' 
    : '我们收到了您的密码重置请求。请使用以下验证码重置密码：'

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@mail.langne.com',
      to: email,
      subject,
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
                <div class="logo">${icon}</div>
                <h1>${title}</h1>
              </div>
              
              <div class="content">
                <p>您好 <strong>${username}</strong>，</p>
                <p>${description}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; display: inline-block;">
                    <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 8px;">验证码</div>
                    <div style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </div>
                </div>
                
                <div class="warning">
                  ⏰ <strong>注意：</strong>验证码将在 10 分钟后失效。
                </div>
                
                <div class="info" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 14px;">
                  🔒 <strong>安全提示：</strong>请勿将验证码透露给任何人，包括客服人员。
                </div>
                
                <p>如果这不是您的操作，请忽略此邮件。</p>
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
      console.error('发送验证码失败:', error)
      return { success: false, error }
    }

    console.log('验证码发送成功:', data)
    return { success: true, data }
  } catch (error) {
    console.error('发送验证码异常:', error)
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
      from: process.env.EMAIL_FROM || 'noreply@mail.langne.com',
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

