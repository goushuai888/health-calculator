# 🔐 管理员设置指南

本文档说明如何设置第一个管理员账户。

## 方法一：通过 SQL 直接设置（推荐）

### 1. 先注册一个普通账户

在应用中注册您的账户：http://localhost:3000/register

### 2. 使用 Supabase SQL Editor 升级为管理员

1. 登录 [Supabase](https://supabase.com)
2. 选择您的 `jiankang` 项目
3. 点击左侧菜单的 **SQL Editor**
4. 创建新查询并执行以下 SQL（将邮箱替换为您的邮箱）：

```sql
-- 将指定邮箱的用户升级为管理员
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

5. 点击 **Run** 执行
6. 刷新应用并重新登录，您现在是管理员了！

### 3. 验证管理员权限

登录后，您应该能看到：
- 导航栏中的 **👑 管理员面板** 链接
- 用户名旁边有 👑 图标

## 方法二：使用 Prisma Studio

### 1. 打开 Prisma Studio

```bash
cd /Users/shuai/wwwroot/jiankang
pnpm prisma studio
```

### 2. 编辑用户

1. 访问 http://localhost:5555
2. 点击 **User** 表
3. 找到您的用户
4. 将 `role` 字段从 `USER` 改为 `ADMIN`
5. 点击 **Save 1 change**

### 3. 重新登录

刷新应用并重新登录以获取新的会话。

## 管理员功能

作为管理员，您可以：

### 📊 系统统计
- 查看总用户数
- 查看活跃用户数
- 查看管理员数量
- 查看总记录数
- 查看今日新增用户

### 👥 用户管理
- **查看所有用户**：包括邮箱、角色、状态等
- **启用/禁用用户**：控制用户是否可以登录
- **升级/降级用户**：将普通用户升级为管理员或反向操作
- **删除用户**：永久删除用户及其所有数据

### 🔒 安全限制
- 管理员不能修改自己的角色
- 管理员不能禁用自己的账户
- 管理员不能删除自己的账户

## 快速 SQL 命令参考

```sql
-- 查看所有管理员
SELECT email, username, role, "isActive", "createdAt" 
FROM users 
WHERE role = 'ADMIN';

-- 查看所有用户及其角色
SELECT email, username, role, "isActive" 
FROM users 
ORDER BY "createdAt" DESC;

-- 将用户升级为管理员
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'user@example.com';

-- 将管理员降级为普通用户
UPDATE users 
SET role = 'USER' 
WHERE email = 'admin@example.com';

-- 禁用用户
UPDATE users 
SET "isActive" = false 
WHERE email = 'user@example.com';

-- 启用用户
UPDATE users 
SET "isActive" = true 
WHERE email = 'user@example.com';

-- 统计用户数量
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'ADMIN') as admin_count,
  COUNT(*) FILTER (WHERE role = 'USER') as user_count,
  COUNT(*) FILTER (WHERE "isActive" = true) as active_users,
  COUNT(*) FILTER (WHERE "isActive" = false) as inactive_users
FROM users;
```

## 数据库结构

users 表字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 用户唯一标识 |
| `email` | String | 邮箱（唯一） |
| `username` | String | 用户名（唯一） |
| `password` | String | 密码（bcrypt 加密） |
| `role` | Enum | 角色：`ADMIN` 或 `USER` |
| `isActive` | Boolean | 账户是否激活 |
| `lastLoginAt` | DateTime | 最后登录时间 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

## 故障排查

### 问题1：看不到管理员面板

**原因**：可能是会话没有更新

**解决**：
1. 登出
2. 重新登录
3. 检查导航栏

### 问题2：403 权限错误

**原因**：用户不是管理员

**解决**：
1. 确认数据库中 `role` 字段为 `ADMIN`
2. 重新登录

### 问题3：无法修改某些用户

**原因**：系统阻止管理员修改自己

**解决**：
- 这是安全功能，使用其他管理员账户操作
- 或直接在数据库中修改

## 安全建议

1. **限制管理员数量**：只授予可信任的人管理员权限
2. **定期检查**：定期查看管理员列表
3. **记录操作**：重要操作前确认
4. **使用强密码**：管理员账户使用强密码
5. **不要分享**：不要与他人分享管理员账户

## API 端点

管理员专用 API：

- `GET /api/admin/stats` - 获取系统统计
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/users/[id]` - 获取用户详情
- `PATCH /api/admin/users/[id]` - 更新用户信息
- `DELETE /api/admin/users/[id]` - 删除用户

所有 API 都需要管理员权限，否则返回 403。

---

**重要提示**：管理员权限非常强大，请谨慎使用！

