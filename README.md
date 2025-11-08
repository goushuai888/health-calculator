# 🏥 健康计算器

一个功能全面的健康指标计算和管理平台，基于 Next.js 14、TypeScript 和 PostgreSQL 构建。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 🧮 健康计算器
- **BMI 计算器** - 体重指数计算和评估
- **BMR 计算器** - 基础代谢率计算
- **体脂率计算器** - 身体脂肪百分比估算
- **腰臀比计算器** - 体型健康风险评估
- **血压评估** - 血压健康状况分析
- **目标心率计算** - 运动心率区间计算
- **睡眠潜伏指数** - 睡眠质量评估
- **热量需求计算** - 每日热量摄入建议

### 👤 用户功能
- 用户注册和登录（支持用户名/邮箱登录）
- 个人健康数据历史记录
- 统一的时间线视图
- 响应式设计，支持移动端
- 实时数据同步

### 👑 管理功能
- 管理员面板
- 用户管理
- 数据统计
- 密码重置

### 🚀 性能优化
- React.memo 优化组件渲染
- 数据缓存和防抖
- 本地存储持久化
- 服务端渲染 (SSR)
- 自动代码分割

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **date-fns** - 日期处理

### 后端
- **Next.js API Routes** - 后端接口
- **Prisma ORM** - 数据库操作
- **PostgreSQL** - 数据库
- **JWT** - 身份认证
- **Zod** - 数据验证

### 部署
- **Vercel** / **EdgeOne Pages** / **Railway** / **Render**
- **Neon** / **Supabase** - 数据库托管

## 📦 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- PostgreSQL 数据库
- npm 或 yarn 或 pnpm

### 1. 克隆仓库

```bash
git clone https://github.com/goushuai888/health-calculator.git
cd health-calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入您的配置：

```env
# 数据库连接字符串
DATABASE_URL="postgresql://user:password@localhost:5432/health_calculator?sslmode=require"

# JWT 密钥（至少 32 位随机字符串）
JWT_SECRET="your-super-secret-jwt-key-change-this"

# 运行环境
NODE_ENV="development"
```

**生成 JWT 密钥：**

```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用 OpenSSL
openssl rand -hex 32
```

### 4. 启动数据库（使用 Docker）

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=health_calculator \
  -p 5432:5432 \
  postgres:15
```

### 5. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# （可选）填充测试数据
npm run prisma:seed
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📖 使用指南

### 注册和登录

1. 访问 `/register` 注册新账号
2. 使用用户名或邮箱登录
3. 首个注册的用户自动成为管理员

### 使用计算器

1. 登录后访问 `/calculators`
2. 选择所需的计算器
3. 输入相关数据
4. 查看计算结果和健康建议
5. 数据自动保存到历史记录

### 查看历史记录

1. 访问 `/history` 或 `/dashboard`
2. 查看所有健康记录的统一时间线
3. 记录按时间倒序排列
4. 支持查看详细数据和建议

### 管理员功能

1. 使用管理员账号登录
2. 访问 `/admin` 进入管理面板
3. 管理用户、查看统计数据
4. 重置用户密码

## 🚀 部署

详细的部署指南请参考 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### 快速部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/goushuai888/health-calculator)

1. 点击上方按钮
2. 连接 GitHub 仓库
3. 配置环境变量（DATABASE_URL、JWT_SECRET）
4. 点击部署

### 部署到其他平台

- [EdgeOne Pages](docs/DEPLOYMENT.md#部署到-edgeone-pages)
- [Railway](docs/DEPLOYMENT.md#部署到-railway)
- [Render](docs/DEPLOYMENT.md#部署到-render)

## 📁 项目结构

```
health-calculator/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── api/            # API 路由
│   │   ├── admin/          # 管理员页面
│   │   ├── calculators/    # 计算器页面
│   │   ├── dashboard/      # 仪表板
│   │   ├── history/        # 历史记录
│   │   ├── login/          # 登录页面
│   │   └── register/       # 注册页面
│   ├── components/         # React 组件
│   │   ├── ui/            # UI 组件
│   │   └── LocalTime.tsx  # 时间显示组件
│   ├── contexts/          # React Context
│   │   └── UserContext.tsx # 用户状态管理
│   ├── lib/               # 工具库
│   │   ├── auth.ts        # 认证逻辑
│   │   ├── calculators.ts # 计算器逻辑
│   │   ├── db.ts          # 数据库连接
│   │   └── validators.ts  # 数据验证
│   └── styles/            # 样式文件
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   └── migrations/        # 数据库迁移
├── public/                # 静态资源
├── docs/                  # 文档
│   └── DEPLOYMENT.md      # 部署指南
├── env.example            # 环境变量模板
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 测试

```bash
# 运行测试
npm run test

# 运行类型检查
npm run type-check

# 运行 Linter
npm run lint
```

## 📝 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# Prisma
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:migrate   # 运行数据库迁移（开发环境）
npm run prisma:migrate:deploy  # 运行数据库迁移（生产环境）
npm run prisma:seed      # 填充测试数据
npm run prisma:studio    # 打开数据库管理界面

# 代码质量
npm run lint             # 运行 ESLint
npm run type-check       # TypeScript 类型检查
```

## 🌐 浏览器支持

- Chrome（推荐）
- Firefox
- Safari
- Edge
- 移动浏览器（iOS Safari、Chrome Mobile）

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [date-fns](https://date-fns.org/) - 日期库
- [Vercel](https://vercel.com/) - 托管平台

## 📞 联系方式

- GitHub: [@goushuai888](https://github.com/goushuai888)
- 项目链接: [https://github.com/goushuai888/health-calculator](https://github.com/goushuai888/health-calculator)

## 🔄 更新日志

### v1.0.0 (2025-11-08)

✨ 初始版本发布

**功能**:
- 8 个健康计算器
- 用户认证和授权
- 历史记录管理
- 管理员面板
- 响应式设计

**优化**:
- React.memo 性能优化
- 数据缓存和防抖
- localStorage 持久化
- 时区正确处理
- 实时数据同步

---

Made with ❤️ by [goushuai888](https://github.com/goushuai888)
