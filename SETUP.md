# 🛠️ 本地开发设置指南

本指南将帮助您快速在本地设置和运行健康计算器项目。

## 📋 前置要求

确保您的开发环境已安装以下工具：

- **Node.js** 18.0.0 或更高版本
- **npm** / **yarn** / **pnpm** 包管理器
- **Git**
- **Supabase 账号** （免费）

### 检查 Node.js 版本

```bash
node --version  # 应该显示 v18.0.0 或更高
npm --version
```

如果需要安装或更新 Node.js：
- 访问 [nodejs.org](https://nodejs.org/)
- 或使用 [nvm](https://github.com/nvm-sh/nvm) 进行版本管理

## 🚀 快速开始

### 第 1 步：克隆项目

```bash
# 克隆仓库
git clone <your-repository-url>
cd jiankang

# 或者如果您刚创建项目
# 项目已在当前目录
```

### 第 2 步：安装依赖

```bash
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

安装过程中会自动运行 `prisma generate`。

### 第 3 步：设置 Supabase 数据库

#### 3.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）
4. 点击 "New Project"
5. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: `jiankang-calculator`
   - **Database Password**: 设置强密码（**请务必保存**）
   - **Region**: 选择最近的地区（如 Northeast Asia (Tokyo)）
   - **Pricing Plan**: Free（免费计划足够使用）

6. 点击 "Create new project" 并等待约 2 分钟

#### 3.2 获取数据库连接 URL

1. 项目创建完成后，点击左侧菜单 **Settings** ⚙️
2. 选择 **Database** 标签
3. 找到 **Connection string** 部分
4. 选择 **URI** 模式
5. 复制连接字符串，类似：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```
6. **重要**: 将 `[YOUR-PASSWORD]` 替换为您在步骤 5 中设置的密码

### 第 4 步：配置环境变量

#### 4.1 创建 .env 文件

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件
# macOS/Linux
nano .env

# Windows
notepad .env
```

#### 4.2 填写环境变量

在 `.env` 文件中填写以下内容：

```env
# Supabase 数据库 URL（从第 3 步获取）
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"

# JWT 密钥（生成一个随机字符串）
JWT_SECRET="change-this-to-a-random-secret-at-least-32-characters-long"

# 应用 URL（本地开发）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4.3 生成安全的 JWT Secret

使用以下方法之一生成随机密钥：

**方法 1: 使用 Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**方法 2: 使用 OpenSSL**
```bash
openssl rand -hex 32
```

**方法 3: 在线生成**
- 访问 [randomkeygen.com](https://randomkeygen.com/)
- 复制 "CodeIgniter Encryption Keys" 中的任意一个

将生成的密钥粘贴到 `.env` 文件的 `JWT_SECRET` 中。

### 第 5 步：初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push
```

您应该看到类似的输出：
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

#### （可选）查看数据库

打开 Prisma Studio 可视化工具：

```bash
npx prisma studio
```

这将在浏览器中打开 `http://localhost:5555`，您可以查看和编辑数据库表。

### 第 6 步：启动开发服务器

```bash
npm run dev

# 或使用其他包管理器
yarn dev
pnpm dev
```

您应该看到：
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### 第 7 步：访问应用

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

🎉 **恭喜！** 应用现在应该正在运行了。

## 📖 使用指南

### 注册账户

1. 点击右上角 "注册" 按钮
2. 填写邮箱、用户名和密码
3. 点击 "注册"
4. 您将自动登录并跳转到仪表板

### 使用计算器

1. 从首页或导航栏选择计算器
2. 输入您的数据
3. 点击计算按钮
4. 查看结果和健康建议

### 查看历史记录

1. 登录后，点击导航栏的 "历史记录"
2. 查看您的所有计算历史
3. 追踪健康数据变化趋势

## 🔧 开发工具

### 可用的命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器（需先构建）
npm start

# 代码检查
npm run lint

# Prisma 相关命令
npx prisma studio        # 打开数据库可视化工具
npx prisma generate      # 生成 Prisma Client
npx prisma db push       # 同步数据库结构
npx prisma db pull       # 从数据库拉取结构
npx prisma format        # 格式化 schema 文件
```

### 推荐的 VS Code 扩展

安装以下扩展以获得更好的开发体验：

- **Prisma** (by Prisma) - Prisma schema 语法高亮
- **Tailwind CSS IntelliSense** - Tailwind 类名自动补全
- **ES7+ React/Redux/React-Native snippets** - React 代码片段
- **TypeScript Vue Plugin (Volar)** - TypeScript 支持
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

### 调试技巧

#### 查看 Prisma 查询日志

在 `src/lib/db.ts` 中已配置日志：

```typescript
new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})
```

开发环境下，所有数据库查询会在控制台输出。

#### 查看 API 请求

在浏览器开发者工具的 Network 标签中查看所有 API 请求和响应。

## 🐛 常见问题

### 问题 1: 安装依赖失败

**错误信息：**
```
npm ERR! code ERESOLVE
```

**解决方案：**
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 数据库连接失败

**错误信息：**
```
PrismaClientInitializationError: Can't reach database server
```

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确
2. 确认密码没有特殊字符（或已正确转义）
3. 确保 Supabase 项目正在运行
4. 检查网络连接

### 问题 3: Prisma Client 未生成

**错误信息：**
```
Cannot find module '@prisma/client'
```

**解决方案：**
```bash
npx prisma generate
```

### 问题 4: 端口 3000 已被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**
```bash
# 方法 1: 更改端口
PORT=3001 npm run dev

# 方法 2: 查找并关闭占用端口的进程
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 问题 5: JWT Secret 未设置警告

**解决方案：**
确保 `.env` 文件存在且包含 `JWT_SECRET`。

### 问题 6: 样式不生效

**解决方案：**
```bash
# 重启开发服务器
# Ctrl+C 停止
npm run dev
```

## 📚 学习资源

### 官方文档

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Supabase 文档](https://supabase.com/docs)

### 项目相关

- [Prisma Schema 参考](/prisma/schema.prisma)
- [API 路由说明](/src/app/api)
- [计算器逻辑](/src/lib/calculators.ts)

## 🤝 贡献指南

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的注释

### 提交规范

使用语义化提交信息：

```bash
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建工具或辅助工具的变动
```

### 创建 Pull Request

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 获取帮助

如果遇到问题：

1. 查看本文档的 **常见问题** 部分
2. 查看 [GitHub Issues](your-repo-url/issues)
3. 创建新的 Issue 描述问题

---

祝您开发愉快！ 🚀

