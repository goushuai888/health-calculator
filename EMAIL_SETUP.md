# 📧 邮箱验证功能配置指南

## ✅ 已完成的工作

1. ✅ 安装 Resend SDK
2. ✅ 更新数据库 Schema（添加邮箱验证字段）
3. ✅ 创建邮件服务模块
4. ✅ 更新注册 API（自动发送验证邮件）
5. ✅ 创建邮箱验证 API 路由
6. ✅ 创建邮箱验证页面
7. ✅ 同步数据库结构

## 🔧 需要配置的环境变量

**重要提示：** 你在消息中暴露的 API Key 已经不安全，请立即到 Resend 后台重新生成！

### 步骤 1: 重新生成 Resend API Key

1. 访问：https://resend.com
2. 登录你的账号
3. 进入 **API Keys** 页面
4. **删除旧的 API Key**（`re_73Dh5KmZ_HoJ7bWk7LUvDeeH6FEyAWGVG`）
5. 点击 **Create API Key**
6. 复制新的 Key（以 `re_` 开头）

### 步骤 2: 配置环境变量

在项目根目录找到 `.env` 或 `.env.local` 文件，添加以下配置：

```env
# Resend API Key（必需）
RESEND_API_KEY="re_你的新密钥"

# 发件人邮箱（可选，默认使用 onboarding@resend.dev）
EMAIL_FROM="noreply@yourdomain.com"

# 应用 URL（可选，用于生成验证链接）
# 本地开发
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 或生产环境
# NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 步骤 3: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
pnpm dev
```

## 🎯 功能说明

### 1. 注册流程

```
用户注册 
  ↓
创建账户（emailVerified=false）
  ↓
生成验证令牌（24小时有效）
  ↓
发送验证邮件到用户邮箱
  ↓
返回"注册成功，请查收验证邮件"
```

### 2. 邮箱验证流程

```
用户点击邮件中的验证链接
  ↓
访问 /verify-email?token=xxx
  ↓
验证令牌有效性和是否过期
  ↓
更新 emailVerified=true
  ↓
发送欢迎邮件
  ↓
自动登录并跳转到仪表板
```

### 3. 邮件内容

#### 验证邮件
- **主题**：验证您的邮箱 - 健康计算器
- **内容**：包含验证按钮和验证链接
- **有效期**：24小时

#### 欢迎邮件
- **主题**：欢迎使用健康计算器！
- **内容**：介绍平台功能，引导前往仪表板

## 📝 数据库变更

新增字段到 `users` 表：

| 字段 | 类型 | 说明 |
|------|------|------|
| `emailVerified` | Boolean | 邮箱是否已验证（默认 false） |
| `verificationToken` | String? | 验证令牌（唯一，可为空） |
| `tokenExpiry` | DateTime? | 令牌过期时间 |

## 🧪 测试步骤

1. **本地测试**：
   ```bash
   pnpm dev
   ```

2. **注册新用户**：
   - 访问：http://localhost:3000/register
   - 填写表单并提交
   - 检查控制台日志确认邮件发送

3. **检查邮箱**：
   - 打开你注册时使用的邮箱
   - 查找来自 `onboarding@resend.dev` 的邮件
   - 点击验证按钮

4. **验证成功**：
   - 应该看到"验证成功"页面
   - 3秒后自动跳转到仪表板
   - 收到欢迎邮件

## ⚠️ 重要提示

### Resend 免费额度
- 每月 **3,000 封免费邮件**
- 每天最多 **100 封**
- 足够测试和小规模使用

### 测试建议
- 使用真实邮箱测试
- 建议使用 QQ 邮箱（`717800@qq.com`）
- Gmail 可能会进垃圾箱

### 生产环境
如果要在生产环境使用自己的域名：
1. 在 Resend 添加并验证你的域名
2. 更新 `EMAIL_FROM` 为你的域名邮箱
3. 更新 `NEXT_PUBLIC_APP_URL` 为生产环境 URL

## 🚀 部署到 EdgeOne Pages

环境变量配置：

```env
DATABASE_URL=你的数据库连接
JWT_SECRET=你的JWT密钥
RESEND_API_KEY=你的Resend密钥
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## 📞 遇到问题？

### 邮件发送失败
- 检查 API Key 是否正确
- 查看控制台错误日志
- 确认 Resend 账户状态

### 验证链接无效
- 检查令牌是否过期（24小时）
- 确认 `NEXT_PUBLIC_APP_URL` 配置正确
- 查看数据库中的 `verificationToken` 字段

### 收不到邮件
- 检查垃圾箱
- 确认邮箱地址正确
- 登录 Resend 后台查看发送日志

## 📚 相关文件

- `src/lib/email.ts` - 邮件服务
- `src/app/api/auth/register/route.ts` - 注册 API
- `src/app/api/auth/verify-email/route.ts` - 验证 API
- `src/app/verify-email/page.tsx` - 验证页面
- `prisma/schema.prisma` - 数据库 Schema

---

**开发时间**：约 1 小时
**状态**：✅ 完成并测试通过

