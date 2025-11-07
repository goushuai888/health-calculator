# 🚀 部署指南

## 准备工作

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 点击 "New Project"
3. 填写项目信息：
   - Name: jiankang-calculator
   - Database Password: (设置一个强密码并保存)
   - Region: 选择最近的区域
4. 等待项目创建完成（约 2 分钟）

### 2. 获取数据库连接字符串

1. 进入项目仪表板
2. 点击左侧 **Settings** → **Database**
3. 找到 **Connection String** 部分
4. 选择 **URI** 标签
5. 复制连接字符串，格式类似：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. 将 `[YOUR-PASSWORD]` 替换为您设置的数据库密码

### 3. 生成 JWT Secret

使用以下命令生成安全的随机字符串：

```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用 OpenSSL
openssl rand -hex 32
```

## 方式一：Vercel 部署（推荐）

### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后推送
git remote add origin https://github.com/yourusername/jiankang.git
git branch -M main
git push -u origin main
```

### 步骤 2: 导入到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. 配置项目：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (默认)

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=your-generated-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 步骤 4: 部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 访问生成的 URL

### 步骤 5: 初始化数据库

部署完成后，在本地运行以下命令初始化生产数据库：

```bash
# 使用生产数据库 URL
DATABASE_URL="your-production-database-url" npx prisma db push
```

或者在 Vercel 项目设置中添加构建命令：

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build"
  }
}
```

## 方式二：手动部署到服务器

### 要求

- Node.js 18+ 
- PM2 或其他进程管理器
- Nginx（可选，用于反向代理）

### 步骤 1: 准备服务器

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 克隆项目
git clone https://github.com/yourusername/jiankang.git
cd jiankang
```

### 步骤 2: 配置环境

```bash
# 创建 .env 文件
cp .env.example .env
nano .env
```

填写环境变量：

```env
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 步骤 3: 安装依赖和构建

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma generate
npx prisma db push

# 构建项目
npm run build
```

### 步骤 4: 启动应用

```bash
# 使用 PM2 启动
pm2 start npm --name "jiankang" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 步骤 5: 配置 Nginx（可选）

创建 Nginx 配置文件：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/jiankang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 步骤 6: 配置 SSL（使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 方式三：Docker 部署

### 创建 Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

### 部署

```bash
docker-compose up -d
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | Supabase 数据库连接字符串 | `postgresql://...` |
| `JWT_SECRET` | JWT 密钥（至少 32 字符） | `abc123...` |
| `NEXT_PUBLIC_APP_URL` | 应用访问 URL | `https://yourdomain.com` |

## 数据库迁移

### 初始化生产数据库

```bash
# 推送 schema 到数据库
npx prisma db push

# 或使用迁移（推荐用于生产环境）
npx prisma migrate deploy
```

### 更新数据库结构

当您修改 `prisma/schema.prisma` 后：

```bash
# 开发环境
npx prisma db push

# 生产环境（创建迁移）
npx prisma migrate dev --name your_migration_name
npx prisma migrate deploy
```

## 监控和维护

### 查看日志

**Vercel:**
- 在 Vercel 仪表板查看实时日志
- 设置错误警报

**PM2:**
```bash
pm2 logs jiankang
pm2 monit
```

### 性能优化

1. 启用 Next.js 缓存
2. 使用 CDN 加速静态资源
3. 配置数据库连接池
4. 启用 Gzip 压缩

### 备份数据库

定期备份 Supabase 数据：

1. 在 Supabase 仪表板中设置自动备份
2. 或使用 pg_dump 手动备份：

```bash
pg_dump $DATABASE_URL > backup.sql
```

## 故障排查

### 构建失败

```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

### 数据库连接失败

1. 检查 DATABASE_URL 是否正确
2. 确认 Supabase 项目正在运行
3. 检查网络连接和防火墙设置

### 会话问题

确保 JWT_SECRET 在所有实例中一致。

## 更新部署

### Vercel

推送到 GitHub 主分支会自动触发部署。

### 手动部署

```bash
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart jiankang
```

## 安全建议

1. **不要**在代码中硬编码敏感信息
2. **使用**强密码和随机 JWT Secret
3. **启用** HTTPS
4. **定期**更新依赖包
5. **限制** API 请求频率（可选择添加 rate limiting）
6. **监控**异常登录和可疑活动

## 性能指标

- **首次加载**: < 3 秒
- **交互时间**: < 1 秒
- **API 响应**: < 500ms
- **Lighthouse 分数**: 90+

---

如有部署问题，请查看项目 Issues 或创建新 Issue。

