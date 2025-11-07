# 🚀 部署配置说明

## 📋 正式环境信息

### 部署平台
- **平台**: EdgeOne Pages (腾讯云边缘加速平台)
- **正式域名**: https://health-calculator.edgeone.app
- **GitHub 仓库**: https://github.com/goushuai888/health-calculator

## 🔧 环境变量配置

在 EdgeOne Pages 控制台中配置以下环境变量：

### 1. 数据库连接（必需）

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**获取方式**：
- 登录 Supabase 控制台
- 进入项目设置 → Database
- 复制 Connection String

### 2. JWT 密钥（必需）

```bash
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**生成方式**：
```bash
# 使用 openssl 生成随机密钥
openssl rand -base64 32
```

### 3. 应用 URL（必需）

```bash
NEXT_PUBLIC_APP_URL="https://health-calculator.edgeone.app"
```

**注意**：必须是完整的 URL，包括协议（https://）

## 🔄 数据库迁移

部署前确保数据库已初始化：

```bash
# 本地运行迁移
pnpm prisma migrate deploy

# 或者使用 Prisma Studio 验证
pnpm prisma studio
```

## 🎯 构建命令

EdgeOne Pages 自动检测 Next.js 项目，默认使用：

```bash
# 安装依赖
pnpm install

# 构建命令
pnpm run build

# 输出目录
.next
```

## ✅ 部署清单

在部署到生产环境前，请确认：

- [ ] 数据库连接字符串已配置
- [ ] JWT_SECRET 已设置为安全的随机值
- [ ] NEXT_PUBLIC_APP_URL 设置为正式域名
- [ ] Prisma 数据库迁移已执行
- [ ] 创建了第一个管理员用户（参考 ADMIN_SETUP.md）

## 🔐 创建管理员用户

部署后，需要手动创建管理员用户：

```bash
# 连接到 Supabase 数据库
psql $DATABASE_URL

# 执行 SQL
UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
```

或者使用 Prisma Studio：

```bash
pnpm prisma studio
```

然后在 User 表中找到用户，将 `role` 字段改为 `ADMIN`。

## 📊 性能优化建议

### 1. 启用边缘缓存

在 EdgeOne 控制台配置：
- 静态资源缓存：`/_next/static/*`
- 图片优化：`/_next/image/*`

### 2. 压缩设置

Next.js 已内置：
- Gzip 压缩
- 代码分割
- 图片优化

### 3. 数据库连接池

已使用 Prisma 的连接池功能：
- `connection_limit=10`（开发环境）
- `connection_limit=100`（生产环境）

## 🌐 自定义域名（可选）

如果要使用自己的域名：

1. 在 EdgeOne Pages 控制台添加自定义域名
2. 配置 DNS 记录（CNAME）
3. 等待 SSL 证书自动配置
4. 更新 `NEXT_PUBLIC_APP_URL` 环境变量

## 🔍 监控和日志

### 访问日志

在 EdgeOne Pages 控制台查看：
- 部署日志
- 运行时日志
- 访问统计

### 错误追踪

建议集成：
- Sentry（错误监控）
- Vercel Analytics（性能分析）

## 🚨 故障排查

### 构建失败

1. 检查 TypeScript 类型错误
2. 确认所有依赖已安装
3. 查看构建日志

### 数据库连接失败

1. 验证 DATABASE_URL 格式正确
2. 确认 Supabase 项目未暂停
3. 检查 IP 白名单设置

### 404 错误

1. 确认路由配置正确
2. 检查 `next.config.js` 配置
3. 清除 CDN 缓存

## 📱 移动端优化

应用已完全响应式设计：
- 移动端导航菜单
- 触摸友好的交互
- 自适应表格布局

## 🔄 CI/CD 流程

当前配置：

```
git push → GitHub → EdgeOne Pages Webhook → 自动构建 → 自动部署
```

### 推荐工作流

1. **开发分支**：`dev`
2. **预发布分支**：`staging`
3. **生产分支**：`main`

## 📝 部署历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2025-11-08 | v1.0.0 | 首次部署 |
| - | - | 8种健康计算器 |
| - | - | 用户认证系统 |
| - | - | 管理员面板 |

## 🎉 访问应用

**正式网址**: https://health-calculator.edgeone.app

### 功能页面

- 首页：https://health-calculator.edgeone.app
- 计算器列表：https://health-calculator.edgeone.app/calculators
- 登录：https://health-calculator.edgeone.app/login
- 注册：https://health-calculator.edgeone.app/register
- 用户面板：https://health-calculator.edgeone.app/dashboard
- 管理员面板：https://health-calculator.edgeone.app/admin

## 💡 技巧和最佳实践

### 环境变量优先级

```
1. EdgeOne Pages 环境变量（生产）
2. .env.local（本地开发）
3. .env（默认值）
```

### 安全建议

- ✅ 使用强随机 JWT_SECRET
- ✅ 定期更新依赖包
- ✅ 启用 HTTPS
- ✅ 设置 CORS 策略
- ✅ 限制 API 请求频率

### 性能优化

- ✅ 使用 Next.js 图片优化
- ✅ 启用静态生成（SSG）
- ✅ 实现边缘缓存
- ✅ 优化数据库查询
- ✅ 使用连接池

---

**更新日期**: 2025-11-08  
**维护者**: goushuai888  
**状态**: ✅ 已部署并运行

