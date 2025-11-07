# 🔐 EdgeOne Pages 环境变量配置

## 📊 项目信息

| 项目 | 值 |
|------|-----|
| **项目名称** | jiankang（健康计算器） |
| **项目 ID** | hnoadhraxrbcwqdpvzux |
| **区域** | ap-southeast-1（新加坡） |
| **状态** | ✅ ACTIVE_HEALTHY |
| **数据库版本** | PostgreSQL 17.6.1 |

## ✅ 必需环境变量

### 复制以下配置到 EdgeOne Pages

在 EdgeOne Pages 控制台 → 设置 → 环境变量 中添加：

```bash
# 1. 数据库连接池 URL（用于 Prisma 查询）
DATABASE_URL=postgresql://postgres.hnoadhraxrbcwqdpvzux:[YOUR_DB_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# 2. 数据库直连 URL（用于 Prisma 迁移）
DIRECT_URL=postgresql://postgres.hnoadhraxrbcwqdpvzux:[YOUR_DB_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

# 3. JWT 密钥（生成一个随机密钥）
JWT_SECRET=使用下方命令生成

# 4. 应用 URL
NEXT_PUBLIC_APP_URL=https://health-calculator.edgeone.app
```

### 🔑 如何获取数据库密码？

#### 方法 1：从 Supabase 控制台复制（推荐）

1. 登录 Supabase: https://supabase.com/dashboard
2. 选择项目：**jiankang**
3. 进入 **Settings** → **Database**
4. 找到 **Connection String** 部分
5. 点击 **Connection pooling** 旁边的 **复制** 按钮
   - ✅ **密码会自动填充**，无需手动输入
6. 将完整字符串粘贴到 EdgeOne Pages 的 `DATABASE_URL`
7. 重复上述步骤，复制 **Direct connection** 到 `DIRECT_URL`

#### 方法 2：如果忘记密码

如果您忘记了数据库密码：

1. 在 Supabase 控制台 → Settings → Database
2. 点击 **Reset Database Password**
3. 生成新密码并保存
4. 使用新密码更新连接字符串

### 🔐 生成 JWT 密钥

在终端运行以下命令：

```bash
openssl rand -base64 32
```

或者使用 Node.js：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

复制生成的字符串（类似：`Xn3kP9mQ7vR2sW6tY8zB4cD5eF7gH1jK3lM9nP0qR2s=`）

## 📋 EdgeOne Pages 环境变量清单

| 变量名 | 值示例 | 说明 |
|--------|--------|------|
| `DATABASE_URL` | `postgresql://postgres.hnoad...` | Prisma 连接池 URL |
| `DIRECT_URL` | `postgresql://postgres.hnoad...` | Prisma 直连 URL |
| `JWT_SECRET` | `Xn3kP9mQ7vR2sW6...` | 随机生成的密钥 |
| `NEXT_PUBLIC_APP_URL` | `https://health-calculator.edgeone.app` | 应用域名 |

## ✅ 当前数据库状态

### 数据库表
所有 Prisma 表已创建：
- ✅ `users` (1 条记录)
- ✅ `user_profiles` (1 条记录)
- ✅ `bmi_records` (1 条记录)
- ✅ `bmr_records` (0 条记录)
- ✅ `body_fat_records` (1 条记录)
- ✅ `waist_hip_records` (0 条记录)
- ✅ `blood_pressure_records` (1 条记录)
- ✅ `target_heart_rate_records` (0 条记录)
- ✅ `sli_records` (0 条记录)
- ✅ `calorie_records` (0 条记录)

### 现有用户
- **用户名**: goushuai
- **邮箱**: 717800@qq.com
- **角色**: USER（普通用户）
- **状态**: 活跃
- **注册时间**: 2025-11-07

## 🎯 配置步骤（详细）

### 第 1 步：登录 EdgeOne Pages

1. 访问 EdgeOne Pages 控制台
2. 找到项目：**health-calculator**

### 第 2 步：进入环境变量设置

1. 点击项目名称
2. 进入 **设置** 或 **Build Settings**
3. 找到 **环境变量** 或 **Environment Variables** 选项

### 第 3 步：添加环境变量

逐个添加以下 4 个环境变量：

#### 变量 1: DATABASE_URL
- **变量名**: `DATABASE_URL`
- **变量值**: 从 Supabase 控制台复制的连接池字符串
- **生效范围**: 全部范围（Production）

#### 变量 2: DIRECT_URL
- **变量名**: `DIRECT_URL`
- **变量值**: 从 Supabase 控制台复制的直连字符串
- **生效范围**: 全部范围（Production）

#### 变量 3: JWT_SECRET
- **变量名**: `JWT_SECRET`
- **变量值**: 使用 `openssl rand -base64 32` 生成
- **生效范围**: 全部范围（Production）

#### 变量 4: NEXT_PUBLIC_APP_URL
- **变量名**: `NEXT_PUBLIC_APP_URL`
- **变量值**: `https://health-calculator.edgeone.app`
- **生效范围**: 全部范围（Production）

### 第 4 步：保存并重新部署

1. 点击 **保存** 按钮
2. EdgeOne Pages 可能会自动触发重新部署
3. 如果没有，点击 **重新部署** 按钮

## 🔍 验证配置

### 部署完成后（约 2-3 分钟）

访问健康检查接口：
```
https://health-calculator.edgeone.app/api/health
```

✅ **成功响应**（应该看到）：
```json
{
  "status": "healthy",
  "checks": {
    "databaseUrl": true,
    "directUrl": true,
    "jwtSecret": true,
    "appUrl": "https://health-calculator.edgeone.app"
  },
  "database": {
    "connected": true,
    "error": null
  }
}
```

❌ **失败响应**（如果配置有误）：
```json
{
  "status": "unhealthy",
  "checks": {
    "databaseUrl": false,  // ← 缺失或错误
    // ...
  }
}
```

## 🎉 测试应用

配置完成后，测试以下功能：

1. **访问首页**
   ```
   https://health-calculator.edgeone.app
   ```

2. **使用计算器（访客模式）**
   - 无需登录即可使用所有计算器
   - 测试 BMI、BMR 等功能

3. **用户登录**
   ```
   用户名: goushuai
   密码: （您设置的密码）
   ```

4. **查看历史记录**
   - 登录后使用计算器
   - 查看是否保存到历史记录

## 👑 升级管理员

如果需要将现有用户提升为管理员：

### 方法 1：使用 Prisma Studio（本地）

```bash
cd /Users/shuai/wwwroot/jiankang
DATABASE_URL="你的生产数据库URL" pnpm prisma studio
```

在 Prisma Studio 中：
1. 打开 `users` 表
2. 找到用户 `goushuai`
3. 将 `role` 字段从 `USER` 改为 `ADMIN`
4. 保存

### 方法 2：使用 SQL（Supabase SQL Editor）

在 Supabase 控制台 → SQL Editor 中执行：

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE username = 'goushuai';
```

或者：

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = '717800@qq.com';
```

## 🆘 常见问题

### Q1: 数据库连接失败？

检查：
- ✅ 数据库密码是否正确
- ✅ 连接字符串格式是否正确
- ✅ Supabase 项目是否已暂停（免费版会暂停）

**解决**：
- 在 Supabase 控制台点击 **Resume** 恢复项目
- 重新复制正确的连接字符串

### Q2: 500 错误仍然存在？

检查：
- ✅ 环境变量是否已保存
- ✅ 是否已重新部署
- ✅ 访问 `/api/health` 查看详细错误

### Q3: 登录成功但没有管理员权限？

原因：
- 默认注册用户角色为 `USER`

**解决**：
- 使用上述方法将用户提升为 `ADMIN`

## 📱 其他配置（可选）

### Supabase 环境变量（如需使用 Supabase Auth）

如果将来想使用 Supabase 的官方认证功能，可以添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hnoadhraxrbcwqdpvzux.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkaHJheHJiY3dxZHB2enV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Mjg2NTQsImV4cCI6MjA3ODEwNDY1NH0.UoHEuN9ewDc8Cu-6pxK7Itm3xfvLfA1JjeNN5BYRJ8U
SUPABASE_SERVICE_ROLE_KEY=（需要从 Supabase 控制台获取）
```

> ⚠️ **注意**：当前项目使用自定义认证系统，不需要这些变量。

## 📝 配置模板

### EdgeOne Pages 环境变量（复制粘贴）

```
DATABASE_URL=postgresql://postgres.hnoadhraxrbcwqdpvzux:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres.hnoadhraxrbcwqdpvzux:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

JWT_SECRET=[运行 openssl rand -base64 32 生成]

NEXT_PUBLIC_APP_URL=https://health-calculator.edgeone.app
```

**替换**：
- `[YOUR_PASSWORD]` → 您的 Supabase 数据库密码
- `[运行 openssl rand -base64 32 生成]` → 生成的随机密钥

---

## ✅ 快速检查清单

配置前请确认：

- [ ] 已登录 Supabase 控制台
- [ ] 已获取数据库连接字符串（包含密码）
- [ ] 已生成 JWT 随机密钥
- [ ] 已登录 EdgeOne Pages 控制台
- [ ] 已找到环境变量配置页面

配置后请验证：

- [ ] 4 个环境变量已全部添加
- [ ] 已保存配置
- [ ] 已触发重新部署
- [ ] 访问 `/api/health` 返回 healthy
- [ ] 可以成功登录
- [ ] 计算器功能正常

---

**更新时间**: 2025-11-08  
**项目状态**: ✅ 数据库已就绪，等待环境变量配置  
**预计配置时间**: 5-10 分钟

