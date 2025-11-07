# 🔐 登录方式变更：使用用户名登录

## 📝 变更说明

系统登录方式已从**邮箱登录**改为**用户名登录**。

### 变更原因
- 用户名登录更简洁、更易记
- 提升用户体验
- 减少输入错误（不需要输入 @ 符号）

## ✅ 已完成的修改

### 1. 后端 API 修改
**文件**: `src/app/api/auth/login/route.ts`

**修改内容**:
```typescript
// 之前：根据邮箱查询
where: { email: validatedData.email }

// 现在：根据用户名查询
where: { username: validatedData.username }
```

**错误消息更新**:
- ❌ "邮箱或密码错误"
- ✅ "用户名或密码错误"

### 2. 验证规则修改
**文件**: `src/lib/validators.ts`

**修改内容**:
```typescript
// 之前：登录验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

// 现在：登录验证
export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})
```

**额外修复**:
同时修复了 BMR 和卡路里计算器的验证规则，将 `activityLevel` 从数字改为正确的枚举类型：
```typescript
activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive'])
```

### 3. 登录页面修改
**文件**: `src/app/login/page.tsx`

**修改内容**:
```tsx
// 之前：邮箱输入
const [email, setEmail] = useState('')
<Input
  type="email"
  label="邮箱地址"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// 现在：用户名输入
const [username, setUsername] = useState('')
<Input
  type="text"
  label="用户名"
  placeholder="请输入用户名"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

## 🎯 用户体验变化

### 登录流程

**之前**:
```
输入邮箱 (例如: user@example.com)
    ↓
输入密码
    ↓
点击登录
```

**现在**:
```
输入用户名 (例如: user123)
    ↓
输入密码
    ↓
点击登录
```

### 优势
- ✅ 更简洁：用户名通常比邮箱短
- ✅ 更易记：用户名通常比邮箱容易记忆
- ✅ 更快捷：输入用户名比邮箱更快
- ✅ 减少错误：不需要输入 @ 和域名

## 📊 数据结构

### 用户表结构
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique      // 仍然保留，用于注册验证
  username  String   @unique      // 用于登录
  password  String
  // ...其他字段
}
```

**说明**:
- 邮箱仍然保留，用于注册时的唯一性验证
- 用户名用于登录，同样具有唯一性约束
- 用户仍需在注册时提供邮箱

## 🔒 安全性

登录安全性**不受影响**：
- ✅ 密码仍然使用 bcrypt 加密
- ✅ JWT 会话管理保持不变
- ✅ 用户名具有唯一性约束
- ✅ 输入验证完整

## 🧪 测试建议

### 1. 测试正常登录
```
用户名: testuser
密码: 正确密码
预期结果: 成功登录并跳转到仪表板
```

### 2. 测试错误用户名
```
用户名: nonexistuser
密码: 任意密码
预期结果: "用户名或密码错误"
```

### 3. 测试错误密码
```
用户名: testuser
密码: 错误密码
预期结果: "用户名或密码错误"
```

### 4. 测试被禁用账户
```
用户名: disableduser
密码: 正确密码
预期结果: "账户已被禁用，请联系管理员"
```

## 📱 UI 变化

### 登录页面
```
┌─────────────────────────────────┐
│         欢迎回来                 │
│      登录您的账户                │
├─────────────────────────────────┤
│ 用户名                           │
│ [请输入用户名____________]       │
│                                 │
│ 密码                            │
│ [••••••••____________]          │
│                                 │
│      [    登录    ]             │
│                                 │
│   还没有账户？立即注册           │
│        ← 返回首页               │
└─────────────────────────────────┘
```

## 💡 注册流程

**注册流程保持不变**，仍需提供：
1. ✅ 邮箱地址
2. ✅ 用户名
3. ✅ 密码

用户可以使用**用户名**登录，但注册时仍需提供**邮箱**作为联系方式。

## 🚀 兼容性

### 后端
- ✅ 数据库结构无需变更
- ✅ 现有用户数据兼容
- ✅ API 接口已更新

### 前端
- ✅ 登录页面已更新
- ✅ 表单验证已更新
- ✅ 错误提示已更新

## 📚 相关文档

- 用户认证系统：`README.md`
- 用户角色管理：`ROLES.md`
- 访客模式：`GUEST_MODE.md`

## 🔄 回滚方案

如需回滚到邮箱登录，只需：
1. 修改 `src/app/api/auth/login/route.ts` - 将 `username` 改回 `email`
2. 修改 `src/lib/validators.ts` - 将 loginSchema 的 username 改回 email
3. 修改 `src/app/login/page.tsx` - 将用户名输入改回邮箱输入

## ⚡ 性能影响

**无性能影响**：
- 查询方式从 `email` 改为 `username`
- 两个字段都有唯一索引
- 查询性能相同

## 🎉 总结

登录方式已成功从邮箱改为用户名：
- ✅ 后端 API 已更新
- ✅ 验证规则已更新
- ✅ 登录页面已更新
- ✅ 错误提示已更新
- ✅ 无语法错误
- ✅ 向后兼容

用户现在可以使用**用户名和密码**登录系统！

---

**变更日期**: 2024-11-07  
**版本**: v1.3.0  
**状态**: ✅ 完成

