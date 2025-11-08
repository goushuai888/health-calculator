# 📦 部署指南

本文档详细说明如何将健康计算器应用部署到各种平台。

## 📋 目录

- [前置要求](#前置要求)
- [环境变量配置](#环境变量配置)
- [部署到 Vercel](#部署到-vercel)
- [部署到 EdgeOne Pages](#部署到-edgeone-pages)
- [部署到 Railway](#部署到-railway)
- [部署到 Render](#部署到-render)
- [本地开发](#本地开发)
- [常见问题](#常见问题)

---

## 前置要求

在开始部署之前，您需要：

1. **代码仓库**
   - GitHub、GitLab 或 Bitbucket 账号
   - 项目代码已推送到仓库

2. **数据库**
   - PostgreSQL 数据库（推荐使用 Neon 或 Supabase 的免费层）
   - 数据库连接字符串 (DATABASE_URL)

3. **环境变量**
   - `DATABASE_URL`: 数据库连接字符串
   - `JWT_SECRET`: JWT 密钥（至少 32 位随机字符串）

---

## 环境变量配置

### 1. 复制环境变量模板

```bash
cp .env.example .env.local
```

### 2. 编辑 `.env.local` 文件

```bash
# 数据库连接字符串（必需）
DATABASE_URL="postgresql://用户名:密码@主机:端口/数据库名?sslmode=require"

# JWT 密钥（必需）
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# 运行环境
NODE_ENV="production"
```

### 3. 生成 JWT 密钥

选择以下任一方法生成随机密钥：

**方法 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**方法 2: OpenSSL**
```bash
openssl rand -hex 32
```

**方法 3: 在线生成器**
访问 [https://www.random.org/strings/](https://www.random.org/strings/)

---

## 部署到 Vercel

Vercel 是部署 Next.js 应用的最佳平台，提供免费层和自动化部署。

### 步骤 1: 准备数据库

推荐使用 **Neon** (免费 PostgreSQL):

1. 访问 [https://neon.tech](https://neon.tech)
2. 创建新项目
3. 复制连接字符串

### 步骤 2: 部署到 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 导入您的 GitHub 仓库
4. 配置环境变量：
   - `DATABASE_URL`: 粘贴 Neon 连接字符串
   - `JWT_SECRET`: 粘贴生成的密钥
   - `NODE_ENV`: `production`
5. 点击 **"Deploy"**

### 步骤 3: 初始化数据库

部署成功后，需要运行数据库迁移：

**方法 1: 使用 Vercel CLI**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 拉取环境变量
vercel env pull .env.local

# 运行迁移
npm run prisma:migrate:deploy
```

**方法 2: 在本地运行**
```bash
# 设置 DATABASE_URL
export DATABASE_URL="your-neon-connection-string"

# 运行迁移
npm run prisma:migrate:deploy
```

### 步骤 4: 验证部署

访问 Vercel 提供的 URL，测试应用是否正常运行。

---

## 部署到 EdgeOne Pages

EdgeOne Pages 是腾讯云的静态网站托管服务，支持 Next.js。

### 步骤 1: 准备数据库

推荐使用 **Neon** 或 **Supabase**:

**Neon:**
1. 访问 [https://neon.tech](https://neon.tech)
2. 创建项目并复制连接字符串

**Supabase:**
1. 访问 [https://supabase.com](https://supabase.com)
2. 创建项目
3. 进入 Settings > Database
4. 复制 Connection String (URI)

### 步骤 2: 连接仓库

1. 登录 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone)
2. 创建新站点
3. 连接您的 GitHub 仓库
4. 选择分支（通常是 `main`）

### 步骤 3: 配置构建设置

- **框架预设**: Next.js
- **构建命令**: `npm run build`
- **输出目录**: `.next`
- **Node.js 版本**: 18.x 或 20.x

### 步骤 4: 配置环境变量

在 EdgeOne Pages 控制台添加环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | Neon 或 Supabase 连接字符串 |
| `JWT_SECRET` | `your-secret-key` | 生成的 JWT 密钥 |
| `NODE_ENV` | `production` | 生产环境 |

### 步骤 5: 部署并初始化数据库

1. 点击 **"部署"**
2. 等待构建完成
3. 使用本地环境运行数据库迁移：

```bash
export DATABASE_URL="your-database-url"
npm run prisma:migrate:deploy
```

---

## 部署到 Railway

Railway 提供数据库和应用托管，简化部署流程。

### 步骤 1: 创建项目

1. 访问 [https://railway.app](https://railway.app)
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 选择您的仓库

### 步骤 2: 添加 PostgreSQL

1. 在项目中点击 **"New"**
2. 选择 **"Database" > "PostgreSQL"**
3. Railway 会自动创建数据库并设置 `DATABASE_URL`

### 步骤 3: 配置环境变量

在项目设置中添加：

- `JWT_SECRET`: 生成的 JWT 密钥
- `NODE_ENV`: `production`

> **注意**: `DATABASE_URL` 已由 Railway 自动配置

### 步骤 4: 部署

Railway 会自动触发部署。部署完成后：

1. 打开 Railway CLI 或使用 Web 终端
2. 运行数据库迁移：

```bash
railway run npm run prisma:migrate:deploy
```

---

## 部署到 Render

Render 提供免费的 Web 服务和 PostgreSQL 数据库。

### 步骤 1: 创建数据库

1. 访问 [https://render.com](https://render.com)
2. 点击 **"New +"** > **"PostgreSQL"**
3. 填写数据库信息
4. 复制 **Internal Database URL**

### 步骤 2: 创建 Web 服务

1. 点击 **"New +"** > **"Web Service"**
2. 连接您的 GitHub 仓库
3. 配置设置：
   - **Name**: health-calculator
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 步骤 3: 配置环境变量

添加环境变量：

- `DATABASE_URL`: 粘贴数据库连接字符串
- `JWT_SECRET`: 生成的密钥
- `NODE_ENV`: `production`

### 步骤 4: 部署并初始化

1. 点击 **"Create Web Service"**
2. 等待构建完成
3. 在 Render Shell 中运行：

```bash
npm run prisma:migrate:deploy
```

---

## 本地开发

### 步骤 1: 克隆仓库

```bash
git clone https://github.com/goushuai888/health-calculator.git
cd health-calculator
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/health_calculator"
JWT_SECRET="your-local-dev-secret-key"
NODE_ENV="development"
```

### 步骤 4: 启动本地数据库 (Docker)

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=health_calculator \
  -p 5432:5432 \
  postgres:15
```

### 步骤 5: 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行迁移
npm run prisma:migrate

# (可选) 填充测试数据
npm run prisma:seed
```

### 步骤 6: 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 常见问题

### Q1: 数据库连接失败

**错误信息**: `Error: P1001: Can't reach database server`

**解决方案**:
1. 检查 `DATABASE_URL` 是否正确
2. 确认数据库服务正在运行
3. 检查防火墙和网络连接
4. 确保连接字符串包含 `?sslmode=require`（对于云数据库）

### Q2: JWT 密钥错误

**错误信息**: `JWT_SECRET is not defined`

**解决方案**:
1. 确保在环境变量中设置了 `JWT_SECRET`
2. 重新部署应用
3. 检查环境变量是否在正确的环境中（生产/开发）

### Q3: 数据库迁移失败

**错误信息**: `Migration failed`

**解决方案**:
```bash
# 重置数据库（⚠️ 会删除所有数据）
npm run prisma:reset

# 重新运行迁移
npm run prisma:migrate:deploy
```

### Q4: 构建失败

**错误信息**: `Build failed`

**解决方案**:
1. 检查 Node.js 版本（需要 18.x 或更高）
2. 清理缓存：
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```
3. 检查环境变量是否正确设置

### Q5: 无法登录

**原因**: 数据库中没有用户

**解决方案**:
1. 访问 `/register` 注册新用户
2. 或运行 seed 脚本创建测试用户：
   ```bash
   npm run prisma:seed
   ```

### Q6: 性能问题

**症状**: 页面加载缓慢

**优化建议**:
1. 确保数据库在同一区域
2. 启用数据库连接池
3. 检查 Vercel/Railway 的计划限制
4. 使用 CDN 加速静态资源

---

## 📞 获取帮助

如果遇到问题：

1. 检查 [GitHub Issues](https://github.com/goushuai888/health-calculator/issues)
2. 查看平台文档：
   - [Vercel Docs](https://vercel.com/docs)
   - [Railway Docs](https://docs.railway.app)
   - [Render Docs](https://render.com/docs)
3. 提交新的 Issue

---

## 🎉 部署成功！

恭喜您成功部署健康计算器应用！

**下一步**:
- 注册管理员账号
- 配置应用设置
- 邀请用户使用

祝您使用愉快！ 🚀

