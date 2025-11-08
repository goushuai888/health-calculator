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
- 用户管理（查看、编辑、删除、重置密码）
- 系统统计数据
- 用户权限控制
- 用户状态管理（启用/禁用）

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
│   └── schema.prisma              # 数据库模型定义
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                  # 后端 API 路由
│   │   │   ├── auth/             # 用户认证（注册/登录/登出）
│   │   │   ├── admin/            # 管理员功能（用户管理/统计）
│   │   │   └── calculators/      # 8个健康计算器 API
│   │   ├── calculators/          # 计算器前端页面
│   │   ├── admin/                # 管理员控制面板
│   │   ├── dashboard/            # 用户仪表板
│   │   ├── history/              # 计算历史记录
│   │   ├── login/                # 登录页面
│   │   ├── register/             # 注册页面
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 首页
│   ├── components/               # React 组件
│   │   ├── ui/                   # 基础 UI 组件（Button/Card/Input）
│   │   ├── Header.tsx            # 顶部导航栏
│   │   ├── CalculatorSidebar.tsx # 计算器侧边栏
│   │   └── CalculatorLayout.tsx  # 计算器页面布局
│   ├── contexts/                 # React Context
│   │   └── UserContext.tsx       # 全局用户状态管理
│   ├── lib/                      # 核心工具库
│   │   ├── auth.ts               # JWT 认证逻辑
│   │   ├── db.ts                 # Prisma Client 实例
│   │   ├── password.ts           # 密码加密处理
│   │   └── validators.ts         # Zod 数据验证
│   └── utils/                    # 业务工具函数
│       └── calculators.ts        # 8个计算器核心算法
├── .env                          # 环境变量（不提交）
├── .gitignore                    # Git 忽略配置
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.js            # Tailwind CSS 配置
├── next.config.js                # Next.js 配置
└── README.md                     # 项目文档
```

## 🗄️ 数据库模型

### 用户相关
- **users** - 用户账户（用户名、邮箱、密码哈希、角色、状态）
- **user_profiles** - 用户个人资料（性别、生日、身高、体重）

### 健康记录（8类）
- **bmi_records** - BMI（身体质量指数）计算记录
- **bmr_records** - BMR（基础代谢率）计算记录
- **body_fat_records** - 体脂率估算记录
- **waist_hip_records** - 腰臀比评估记录
- **blood_pressure_records** - 血压评估记录
- **target_heart_rate_records** - 目标心率区间记录
- **sli_records** - 运动负荷指数记录
- **calorie_records** - 每日热量需求记录

> 每条记录自动关联用户ID、创建时间，支持统一时间线展示

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
- `GET /api/admin/stats` - 系统统计数据
- `GET /api/admin/users` - 获取用户列表（分页/筛选）
- `GET /api/admin/users/:id` - 获取单个用户详情
- `PATCH /api/admin/users/:id` - 更新用户信息（角色/状态）
- `DELETE /api/admin/users/:id` - 删除用户
- `POST /api/admin/users/:id/reset-password` - 重置用户密码

## 📚 开发指南

### 添加新的计算器

1. **定义数据模型**
   - 在 `prisma/schema.prisma` 添加新的 Record 模型
   - 运行 `npx prisma db push` 同步到数据库

2. **实现计算逻辑**
   - 在 `src/utils/calculators.ts` 添加计算函数
   - 在 `src/lib/validators.ts` 添加 Zod 验证 schema

3. **创建后端 API**
   - 创建 `src/app/api/calculators/[name]/route.ts`
   - 支持访客模式（无需登录）和登录模式（保存历史）

4. **创建前端页面**
   - 创建 `src/app/calculators/[name]/page.tsx`
   - 使用 `CalculatorLayout` 布局组件
   - 实现表单和结果展示

5. **添加导航**
   - 在 `src/components/CalculatorSidebar.tsx` 添加链接
   - 在首页 `src/app/page.tsx` 添加卡片

### 技术规范

| 规范 | 要求 |
|------|------|
| **类型检查** | TypeScript 严格模式，无 `any` 类型 |
| **数据库** | 使用 Prisma ORM，禁止原生 SQL |
| **验证** | 使用 Zod 进行输入验证 |
| **样式** | Tailwind CSS + 响应式设计 |
| **路由** | Next.js 14 App Router |
| **安全** | JWT 认证 + RBAC 权限控制 |

### 关键设计原则

1. **访客优先** - 所有计算器无需登录即可使用
2. **类型安全** - 全栈 TypeScript + Prisma 类型
3. **性能优化** - 边缘函数 + 连接池 + 静态生成
4. **安全第一** - 密码加密 + JWT + HTTPS
5. **用户体验** - 响应式 + 加载状态 + 错误处理

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

### 核心优势
- ✅ **访客模式** - 无需注册，立即使用所有计算器
- ✅ **历史追踪** - 登录后自动保存，统一时间线展示
- ✅ **管理后台** - 完整的用户管理和系统统计
- ✅ **现代架构** - Next.js 14 App Router + Edge Runtime
- ✅ **类型安全** - 全栈 TypeScript + Prisma ORM
- ✅ **响应式设计** - 完美支持手机/平板/桌面
- ✅ **安全可靠** - bcrypt + JWT + SSL
- ✅ **易于部署** - 支持 Vercel / EdgeOne Pages
- ✅ **数据隐私** - 自托管，数据完全掌控
- ✅ **模块化** - 清晰的代码结构，易于维护扩展

### 技术亮点
| 特性 | 技术方案 |
|------|---------|
| **前端** | React 18 + TypeScript + Tailwind CSS |
| **后端** | Next.js 14 API Routes |
| **数据库** | Neon PostgreSQL（无服务器） |
| **ORM** | Prisma（类型安全） |
| **认证** | JWT + HttpOnly Cookie |
| **部署** | Edge Functions + CDN |

## 📊 项目统计

| 指标 | 数值 |
|------|------|
| **计算器数量** | 8 个 |
| **API 端点** | 19 个 |
| **数据库表** | 10 张 |
| **代码语言** | TypeScript 100% |
| **UI 组件** | 响应式设计 |
| **支持设备** | 手机/平板/桌面 |

## 🔄 版本历史

当前版本：**v1.0.1**

主要更新：
- ✨ 访客模式（无需登录即可使用）
- 👑 管理员功能（用户管理 + 密码重置）
- 📊 统一时间线历史记录
- 🔐 用户名登录方式
- ⚡ 全局状态管理优化
- 🗄️ 数据库从 Supabase 迁移到 Neon

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📧 联系方式

- **项目地址**：https://github.com/goushuai888/health-calculator
- **在线演示**：https://health-calculator.edgeone.app
- **问题反馈**：https://github.com/goushuai888/health-calculator/issues

---

## ⚠️ 免责声明

本健康计算器工具仅供参考和教育用途。计算结果基于常见的健康评估公式，**不能替代专业医疗建议、诊断或治疗**。

如有任何健康问题或疑虑，请咨询专业医生或医疗机构。

---

**Made with ❤️ using Next.js 14 + Neon PostgreSQL**
