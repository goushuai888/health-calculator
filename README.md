# 🏥 健康计算器 - 全方位健康管理平台

基于 **Next.js 14** + **Neon PostgreSQL** + **Prisma** 构建的现代化健康计算器应用，提供多种健康指标计算和数据追踪功能。

## 🌐 在线演示

**正式网址**: https://health-calculator.edgeone.app

✨ 无需注册，立即体验所有计算器功能！

## ✨ 功能特性

### 🎁 访客模式
- **无需注册登录即可使用所有计算器**
- 立即获得计算结果和健康建议
- 注册后自动保存历史记录
- 友好的转化提示

### 🔐 用户认证
- 用户名 + 密码登录
- 基于 JWT 的会话管理
- 安全的密码加密（bcrypt）
- 管理员权限控制

### 📊 健康计算器（8 个）
- **BMI 计算器** - 身体质量指数评估
- **BMR 计算器** - 基础代谢率计算
- **体脂率计算器** - 身体脂肪百分比估算
- **腰臀比计算器** - 中心性肥胖风险评估
- **血压评估** - 血压水平分类
- **目标心率** - 运动心率区间计算
- **运动负荷指数** - 运动强度评估
- **热量需求** - 每日热量摄入建议

### 📈 数据管理
- 自动保存计算历史（登录用户）
- 统一时间线历史记录查看
- 个性化健康建议
- 便捷的侧边栏导航

### 👑 管理员功能
- 用户管理（查看、编辑、删除）
- 系统统计数据
- 用户权限控制

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
- **Neon PostgreSQL** (无服务器数据库)
- **Zod** (数据验证)

### 认证
- **jose** (JWT 处理)
- **bcryptjs** (密码加密)
- 自定义会话管理

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/goushuai888/health-calculator.git
cd jiankang
```

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
# Neon Database URL（连接池模式）
DATABASE_URL="postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require"

# JWT Secret（生成一个随机字符串）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**如何获取 Neon DATABASE_URL：**

1. 前往 [Neon Console](https://console.neon.tech)
2. 创建新项目
3. 复制 Connection String (带 pooler)
4. 粘贴到 `.env` 文件

**生成安全的 JWT_SECRET：**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

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
pnpm dev
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
│   │   │   ├── calculators/  # 计算器 API
│   │   │   └── admin/        # 管理员 API
│   │   ├── calculators/      # 计算器页面
│   │   ├── admin/            # 管理员面板
│   │   ├── dashboard/        # 用户仪表板
│   │   ├── history/          # 历史记录
│   │   ├── login/            # 登录页
│   │   ├── register/         # 注册页
│   │   └── page.tsx          # 首页
│   ├── components/           # React 组件
│   │   ├── ui/              # UI 组件库
│   │   ├── Header.tsx       # 导航栏
│   │   ├── CalculatorSidebar.tsx  # 侧边栏
│   │   └── CalculatorLayout.tsx   # 布局组件
│   ├── contexts/            # React Context
│   │   └── UserContext.tsx # 全局用户状态
│   └── lib/                # 工具库
│       ├── auth.ts         # 认证逻辑
│       ├── calculators.ts  # 计算器核心逻辑
│       ├── db.ts           # Prisma Client
│       ├── password.ts     # 密码处理
│       └── validators.ts   # 数据验证
├── docs/                   # 文档
│   └── archive/           # 归档文档
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🗄️ 数据库模型

主要数据表：

- `users` - 用户信息（用户名、邮箱、密码、角色）
- `user_profiles` - 用户个人资料
- `bmi_records` - BMI 计算记录
- `bmr_records` - BMR 计算记录
- `body_fat_records` - 体脂率记录
- `waist_hip_records` - 腰臀比记录
- `blood_pressure_records` - 血压记录
- `target_heart_rate_records` - 目标心率记录
- `sli_records` - 运动负荷指数记录
- `calorie_records` - 热量需求记录

## 🔐 认证系统

- **注册流程**：邮箱 + 用户名 + 密码
- **登录方式**：用户名 + 密码
- **密码加密**：bcrypt (salt rounds: 10)
- **会话管理**：JWT Token (HttpOnly Cookie)
- **会话有效期**：7 天
- **权限控制**：USER / ADMIN 角色

## 👑 初始化管理员

注册第一个用户后，使用以下方式设置为管理员：

### 方法 1: Prisma Studio
```bash
npx prisma studio
```
在浏览器中打开 `users` 表，将用户的 `role` 字段改为 `ADMIN`。

### 方法 2: SQL 命令
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your-username';
```

## 🚀 部署

### EdgeOne Pages 部署（当前使用）

1. 推送代码到 GitHub
2. 在 EdgeOne Pages 导入项目
3. 配置环境变量：
   - `DATABASE_URL`（Neon 连接池 URL）
   - `JWT_SECRET`（128 位随机密钥）
   - `NEXT_PUBLIC_APP_URL`（生产域名）
4. 部署

### Vercel 部署

1. 在 [Vercel](https://vercel.com) 导入项目
2. 配置环境变量（同上）
3. 部署

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
- `POST /api/calculators/sli` - 运动负荷指数计算
- `POST /api/calculators/calorie` - 热量需求计算

每个 API 支持：
- **访客模式**：无需登录，只返回计算结果
- **登录模式**：自动保存历史记录，返回 `recordId`

### 管理员 API
- `GET /api/admin/users` - 获取用户列表
- `PUT /api/admin/users/:id` - 更新用户信息
- `DELETE /api/admin/users/:id` - 删除用户

## 📚 开发指南

### 添加新的计算器

1. 在 `prisma/schema.prisma` 添加新的数据模型
2. 运行 `npx prisma db push` 更新数据库
3. 在 `src/lib/calculators.ts` 添加计算逻辑
4. 在 `src/lib/validators.ts` 添加验证规则
5. 创建 API 路由 `src/app/api/calculators/[name]/route.ts`
6. 创建前端页面 `src/app/calculators/[name]/page.tsx`
7. 在侧边栏添加导航链接

### 代码规范

- 使用 TypeScript 严格模式
- 使用 Prisma 进行数据库操作
- 使用 Zod 进行数据验证
- 使用 Tailwind CSS 编写样式
- 遵循 Next.js 14 App Router 最佳实践

## 🐛 常见问题

### 1. Prisma Client 错误

```bash
# 重新生成 Prisma Client
npx prisma generate
```

### 2. 数据库连接失败

检查 `DATABASE_URL` 是否正确：
- 使用 Neon 连接池 URL（带 `pooler`）
- 包含 `?sslmode=require`
- 密码正确
- 网络连接正常

### 3. JWT Secret 未设置

确保 `.env` 文件中设置了安全的 `JWT_SECRET`：

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. 登录状态异常

确保 `JWT_SECRET` 在本地和生产环境完全一致。

## 🌟 项目特色

- ✅ **完全免费使用**（访客模式）
- ✅ **现代化 UI 设计**（Tailwind CSS）
- ✅ **响应式布局**（支持手机、平板、桌面）
- ✅ **快速性能**（Next.js 14 + Edge Runtime）
- ✅ **类型安全**（TypeScript + Prisma）
- ✅ **数据隐私**（自托管，数据安全）
- ✅ **易于扩展**（模块化架构）

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: https://github.com/goushuai888/health-calculator
- Issues: https://github.com/goushuai888/health-calculator/issues

---

**免责声明**：本工具仅供参考，计算结果不能替代专业医疗建议。如有健康问题，请咨询专业医生。
