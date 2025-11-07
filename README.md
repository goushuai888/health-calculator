# 🏥 健康计算器 - 全方位健康管理平台

基于 **Next.js 14** + **Supabase** + **Prisma** 构建的现代化健康计算器应用，提供多种健康指标计算和数据追踪功能。

## ✨ 功能特性

### 🎁 访客模式（新功能！）
- **无需注册登录即可使用所有计算器**
- 立即获得计算结果和健康建议
- 注册后自动保存历史记录
- 友好的转化提示

### 🔐 用户认证
- 自定义用户认证系统（非 Supabase Auth）
- 基于 JWT 的会话管理
- 安全的密码加密（bcrypt）

### 📊 健康计算器
- **BMI 计算器** - 身体质量指数评估
- **BMR 计算器** - 基础代谢率计算
- **体脂率计算器** - 身体脂肪百分比估算
- **腰臀比计算器** - 中心性肥胖风险评估
- **血压评估** - 血压水平分类
- **目标心率** - 运动心率区间计算
- **心脏负荷指数** - 运动强度评估
- **卡路里需求** - 每日热量摄入建议

### 📈 数据管理
- 自动保存计算历史
- 历史记录查看和追踪
- 个性化健康建议
- 数据可视化展示

## 🛠 技术栈

### 前端
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **date-fns** (日期处理)

### 后端
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** (Supabase)
- **Zod** (数据验证)

### 认证
- **jose** (JWT 处理)
- **bcryptjs** (密码加密)
- 自定义会话管理

## 📦 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd jiankang
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 3. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
# Supabase Database URL
DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"

# JWT Secret (生成一个随机字符串)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**如何获取 Supabase DATABASE_URL：**

1. 前往 [Supabase](https://supabase.com)
2. 创建新项目或选择现有项目
3. 进入 **Settings** → **Database**
4. 找到 **Connection String** → **URI**
5. 复制连接字符串并替换为您的密码

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# (可选) 打开 Prisma Studio 查看数据
npx prisma studio
```

### 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
jiankang/
├── prisma/
│   └── schema.prisma          # Prisma 数据库模型
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API 路由
│   │   │   ├── auth/         # 认证 API
│   │   │   └── calculators/  # 计算器 API
│   │   ├── calculators/      # 计算器页面
│   │   ├── dashboard/        # 仪表板
│   │   ├── history/          # 历史记录
│   │   ├── login/            # 登录页
│   │   ├── register/         # 注册页
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首页
│   │   └── globals.css       # 全局样式
│   ├── components/           # React 组件
│   │   ├── ui/              # UI 组件库
│   │   └── Header.tsx       # 导航栏
│   └── lib/                 # 工具库
│       ├── auth.ts          # 认证逻辑
│       ├── calculators.ts   # 计算器核心逻辑
│       ├── db.ts            # Prisma Client
│       ├── password.ts      # 密码处理
│       └── validators.ts    # 数据验证
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🗄️ 数据库模型

主要数据表：

- `users` - 用户信息
- `user_profiles` - 用户个人资料
- `bmi_records` - BMI 计算记录
- `bmr_records` - BMR 计算记录
- `body_fat_records` - 体脂率记录
- `waist_hip_records` - 腰臀比记录
- `blood_pressure_records` - 血压记录
- `target_heart_rate_records` - 目标心率记录
- `sli_records` - 心脏负荷指数记录
- `calorie_records` - 卡路里记录

## 🔐 认证系统

本项目使用自定义认证系统，不依赖 Supabase Auth：

- **注册流程**：邮箱 + 用户名 + 密码
- **密码加密**：bcrypt (salt rounds: 10)
- **会话管理**：JWT Token (HttpOnly Cookie)
- **会话有效期**：7 天
- **自动刷新**：每次请求自动延长会话

## 🚀 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. 部署

### 手动部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🧪 API 端点

### 认证 API

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 计算器 API

- `POST /api/calculators/bmi` - BMI 计算
- `POST /api/calculators/bmr` - BMR 计算
- `POST /api/calculators/body-fat` - 体脂率计算
- `POST /api/calculators/waist-hip` - 腰臀比计算
- `POST /api/calculators/blood-pressure` - 血压评估
- `POST /api/calculators/target-heart-rate` - 目标心率计算
- `POST /api/calculators/sli` - 心脏负荷指数计算
- `POST /api/calculators/calorie` - 卡路里需求计算

每个计算器 API 都支持 GET 请求来获取历史记录。

## 📚 开发指南

### 添加新的计算器

1. 在 `prisma/schema.prisma` 添加新的数据模型
2. 运行 `npx prisma db push` 更新数据库
3. 在 `src/lib/calculators.ts` 添加计算逻辑
4. 在 `src/lib/validators.ts` 添加验证规则
5. 创建 API 路由 `src/app/api/calculators/[name]/route.ts`
6. 创建前端页面 `src/app/calculators/[name]/page.tsx`

### 代码规范

- 使用 TypeScript 严格模式
- 使用 Prisma 进行数据库操作
- 使用 Zod 进行数据验证
- 使用 Tailwind CSS 编写样式
- 遵循 Next.js 13+ App Router 最佳实践

## 🐛 常见问题

### 1. Prisma Client 错误

```bash
# 重新生成 Prisma Client
npx prisma generate
```

### 2. 数据库连接失败

检查 `DATABASE_URL` 是否正确，确保：
- 密码正确
- Supabase 项目正在运行
- 网络连接正常

### 3. JWT Secret 未设置

确保 `.env` 文件中设置了 `JWT_SECRET`。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过 Issue 联系。

---

**免责声明**：本工具仅供参考，计算结果不能替代专业医疗建议。如有健康问题，请咨询专业医生。

