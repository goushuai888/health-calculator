# 👥 用户角色系统

## 角色类型

系统支持两种用户角色：

### 1. 普通用户 (USER) 👤
- 使用所有健康计算器
- 查看自己的历史记录
- 管理个人资料
- 默认角色

### 2. 管理员 (ADMIN) 👑
- **所有普通用户权限**
- 访问管理员面板
- 查看系统统计数据
- 管理所有用户
- 修改用户角色
- 启用/禁用用户账户
- 删除用户（除自己外）

## 数据库字段

### users 表新增字段

```prisma
model User {
  // ... 其他字段
  role        UserRole @default(USER)  // 用户角色
  isActive    Boolean  @default(true)  // 账户是否激活
  lastLoginAt DateTime?                // 最后登录时间
}

enum UserRole {
  ADMIN  // 管理员
  USER   // 普通用户
}
```

## 功能对比

| 功能 | 普通用户 | 管理员 |
|------|---------|-------|
| 注册/登录 | ✅ | ✅ |
| 使用计算器 | ✅ | ✅ |
| 查看历史记录 | ✅ 自己的 | ✅ 自己的 |
| 管理员面板 | ❌ | ✅ |
| 查看所有用户 | ❌ | ✅ |
| 修改用户角色 | ❌ | ✅ |
| 禁用/启用用户 | ❌ | ✅ |
| 删除用户 | ❌ | ✅ |
| 查看系统统计 | ❌ | ✅ |

## 如何设置第一个管理员

详细步骤请查看 [ADMIN_SETUP.md](./ADMIN_SETUP.md)

**快速方法：**

1. 注册账户
2. 在 Supabase SQL Editor 中执行：
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```
3. 重新登录

## API 权限控制

### 公开端点
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 需要登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 登出
- `POST /api/calculators/*` - 所有计算器

### 仅管理员
- `GET /api/admin/stats` - 系统统计
- `GET /api/admin/users` - 用户列表
- `GET /api/admin/users/[id]` - 用户详情
- `PATCH /api/admin/users/[id]` - 更新用户
- `DELETE /api/admin/users/[id]` - 删除用户

## 前端权限控制

### 页面级别

```typescript
// 管理员页面示例
const session = await getSession()

if (!session || session.role !== 'ADMIN') {
  redirect('/dashboard')
}
```

### 组件级别

```typescript
// Header 组件示例
{user.role === 'ADMIN' && (
  <Link href="/admin">👑 管理员面板</Link>
)}
```

## 安全特性

### 1. 会话管理
- JWT Token 包含角色信息
- 每次请求验证角色
- 7天会话有效期

### 2. 防止误操作
- ❌ 管理员不能修改自己的角色
- ❌ 管理员不能禁用自己的账户
- ❌ 管理员不能删除自己的账户

### 3. 账户保护
- 禁用的账户无法登录
- 登录时检查 `isActive` 状态
- 显示友好的错误消息

### 4. 操作确认
- 关键操作需要二次确认
- 删除用户需要两次确认

## 工作流程

### 用户注册
```
注册 → 创建 USER 角色 → 自动登录
```

### 用户登录
```
验证密码 → 检查 isActive → 更新 lastLoginAt → 创建会话（含角色）
```

### 管理员操作
```
验证会话 → 检查 role=ADMIN → 执行操作 → 记录日志
```

## 最佳实践

### 1. 管理员账户
- 使用强密码
- 不要与他人分享
- 定期检查管理员列表
- 限制管理员数量

### 2. 用户管理
- 谨慎授予管理员权限
- 删除前备份重要数据
- 禁用而不是立即删除可疑账户

### 3. 安全建议
- 定期审计用户活动
- 监控异常登录
- 保持系统更新

## 故障排查

### 问题：看不到管理员面板

**检查步骤：**
1. 确认数据库中 `role = 'ADMIN'`
2. 登出并重新登录
3. 清除浏览器缓存

### 问题：403 权限错误

**原因：**
- 不是管理员
- 会话过期
- 账户被禁用

**解决：**
1. 检查角色
2. 重新登录
3. 联系其他管理员

## 数据库查询示例

```sql
-- 查看所有管理员
SELECT * FROM users WHERE role = 'ADMIN';

-- 统计各角色用户数
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- 查看最近活跃的管理员
SELECT username, email, "lastLoginAt" 
FROM users 
WHERE role = 'ADMIN' 
ORDER BY "lastLoginAt" DESC;

-- 查看被禁用的用户
SELECT username, email, "createdAt" 
FROM users 
WHERE "isActive" = false;
```

## 扩展功能建议

### 未来可以添加的角色
- `MODERATOR` - 内容审核员
- `SUPPORT` - 客服人员
- `ANALYST` - 数据分析师

### 可能的权限细化
- 按模块分配权限
- 临时权限提升
- 权限审计日志
- 批量用户操作

---

**注意**：角色系统已完全集成到应用中，无需额外配置即可使用。

