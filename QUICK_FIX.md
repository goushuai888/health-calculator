# 🚨 500 错误快速修复指南

## 问题原因

登录接口返回 500 错误，原因是 **EdgeOne Pages 环境变量未配置**。

## ✅ 快速修复步骤

### 1. 访问健康检查接口

在浏览器中访问：
```
https://health-calculator.edgeone.app/api/health
```

这会显示哪些环境变量缺失。

### 2. 配置环境变量（EdgeOne Pages 控制台）

登录 EdgeOne Pages 控制台，找到项目设置 → 环境变量，添加以下配置：

#### ⚠️ 必需环境变量

```bash
# 1. 数据库连接（从 Supabase 获取）
DATABASE_URL="postgresql://postgres.项目ID:密码@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. 直连 URL（从 Supabase 获取）
DIRECT_URL="postgresql://postgres.项目ID:密码@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# 3. JWT 密钥（生成一个随机密钥）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 4. 应用 URL
NEXT_PUBLIC_APP_URL="https://health-calculator.edgeone.app"
```

### 3. 获取 Supabase 数据库连接字符串

#### 方法 1：Supabase 控制台
1. 登录 https://supabase.com
2. 选择项目：**jiankang**
3. 点击左侧 **Settings** → **Database**
4. 找到 **Connection String** 部分
5. 复制 **Connection Pooling** 字符串（用于 DATABASE_URL）
6. 复制 **Direct Connection** 字符串（用于 DIRECT_URL）

#### 方法 2：格式说明

```bash
# Connection Pooling (pgBouncer)
DATABASE_URL="postgresql://postgres.[项目REF]:[密码]@aws-0-[区域].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection
DIRECT_URL="postgresql://postgres.[项目REF]:[密码]@aws-0-[区域].pooler.supabase.com:5432/postgres"
```

**替换以下内容**：
- `[项目REF]`: Supabase 项目的引用 ID
- `[密码]`: 您的数据库密码（创建项目时设置的）
- `[区域]`: 您的项目区域（如 `ap-northeast-1`）

### 4. 生成 JWT 密钥

使用以下命令生成安全的随机密钥：

```bash
# macOS / Linux
openssl rand -base64 32

# 或者使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

示例输出：
```
Xn3kP9mQ7vR2sW6tY8zB4cD5eF7gH1jK3lM9nP0qR2s=
```

### 5. 在 EdgeOne Pages 配置环境变量

#### 步骤：
1. 登录 **EdgeOne Pages 控制台**
2. 选择项目 **health-calculator**
3. 进入 **设置** → **环境变量**
4. 点击 **添加环境变量**
5. 逐个添加上述 4 个变量
6. 保存配置

### 6. 重新部署

配置环境变量后，需要重新部署：

#### 方法 1：自动部署（推荐）
```bash
# 提交一个小更新触发重新部署
git commit --allow-empty -m "chore: 触发重新部署"
git push
```

#### 方法 2：手动部署
在 EdgeOne Pages 控制台点击 **重新部署** 按钮

### 7. 验证修复

部署完成后：

1. **检查健康状态**：
   ```
   https://health-calculator.edgeone.app/api/health
   ```
   应该返回：
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

2. **测试登录**：
   - 访问 https://health-calculator.edgeone.app/login
   - 尝试登录（先注册一个账户）

## 📋 环境变量清单

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `DATABASE_URL` | ✅ 是 | Prisma 数据库连接（连接池） | `postgresql://...?pgbouncer=true` |
| `DIRECT_URL` | ✅ 是 | Prisma 直连（用于迁移） | `postgresql://...` |
| `JWT_SECRET` | ✅ 是 | JWT 签名密钥 | `随机生成的 base64 字符串` |
| `NEXT_PUBLIC_APP_URL` | ✅ 是 | 应用完整 URL | `https://health-calculator.edgeone.app` |

## 🔍 常见问题

### Q1: 找不到 Supabase 数据库密码？

**方案 1：重置密码**
1. Supabase 控制台 → Settings → Database
2. 点击 **Reset Database Password**
3. 生成新密码并保存
4. 更新环境变量中的连接字符串

**方案 2：使用 Service Role Key**
1. Supabase 控制台 → Settings → API
2. 找到 `service_role` key
3. 使用此 key 连接（不推荐生产环境）

### Q2: 环境变量配置后仍然 500 错误？

1. 确认已重新部署
2. 检查环境变量是否有拼写错误
3. 访问 `/api/health` 查看具体错误
4. 查看 EdgeOne Pages 部署日志

### Q3: 数据库连接失败？

可能原因：
- Supabase 项目已暂停（免费套餐 7 天不活动会暂停）
- 数据库密码错误
- 连接字符串格式错误
- Supabase 服务故障

**解决方案**：
1. 登录 Supabase 检查项目状态
2. 验证数据库密码
3. 测试本地连接：
   ```bash
   psql "你的DATABASE_URL"
   ```

### Q4: JWT_SECRET 未生效？

确保：
- 密钥已正确复制（无多余空格）
- 已重新部署应用
- 使用双引号包裹值（如果有特殊字符）

## 🎯 初始化数据库

配置环境变量后，还需要初始化数据库：

### 方法 1：使用 Prisma Studio（推荐）

```bash
# 本地连接到生产数据库
DATABASE_URL="你的生产数据库URL" pnpm prisma studio
```

在 Prisma Studio 中可以：
- 查看表结构
- 创建测试用户
- 修改用户角色

### 方法 2：运行迁移

```bash
# 将本地迁移应用到生产数据库
DATABASE_URL="你的生产数据库URL" pnpm prisma migrate deploy
```

### 方法 3：SQL 命令

连接到数据库后执行：

```sql
-- 检查表是否存在
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 如果没有表，需要运行迁移
```

## ✅ 验证清单

配置完成后，请逐项验证：

- [ ] 环境变量已全部配置
- [ ] 应用已重新部署
- [ ] `/api/health` 返回 healthy
- [ ] 数据库表已创建
- [ ] 可以成功注册新用户
- [ ] 可以成功登录
- [ ] 可以使用计算器
- [ ] 历史记录正常保存

## 📞 需要帮助？

如果问题仍未解决：

1. **查看日志**：EdgeOne Pages 控制台 → 部署日志 → 运行时日志
2. **健康检查**：访问 `/api/health` 查看具体错误
3. **测试数据库**：使用 `psql` 测试数据库连接
4. **GitHub Issues**：在仓库提交 issue

## 🔗 相关文档

- `DEPLOYMENT_CONFIG.md` - 详细部署配置
- `SETUP.md` - 本地开发环境设置
- `ADMIN_SETUP.md` - 管理员账户创建

---

**预计修复时间**: 5-10 分钟  
**最后更新**: 2025-11-08

