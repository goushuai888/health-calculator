# EdgeOne Pages 部署指南

## 📋 项目信息

- **GitHub 仓库**: `goushuai888/health-calculator`
- **分支**: `main`
- **框架**: Next.js 14
- **数据库**: Neon PostgreSQL

---

## 🚀 部署步骤

### 1. 访问 EdgeOne Pages 控制台

🔗 **控制台地址**: https://console.cloud.tencent.com/edgeone/pages

### 2. 创建新项目

点击「**新建项目**」或「**Create Project**」按钮

### 3. 连接 GitHub 仓库

| 配置项 | 值 |
|--------|-----|
| Git Provider | GitHub |
| 账号/组织 | `goushuai888` |
| 仓库 | `health-calculator` |
| 分支 | `main` |

### 4. 构建配置

| 配置项 | 值 |
|--------|-----|
| 框架预设 | Next.js |
| 构建命令 | `npm run build` |
| 输出目录 | `.next` |
| 安装命令 | `npm install` |
| Node 版本 | 18.x |

### 5. 环境变量配置 ⚠️ 重要

在「环境变量」选项卡添加以下配置：

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET=5d70fbf2385bceaecbac8fbcb051743f75daf456bb8a42afd50536f300418bdd
NODE_ENV=production
```

> **注意**:
> - `DATABASE_URL` 需要从 Neon 控制台复制你的生产数据库连接
> - `JWT_SECRET` 已为你生成，直接使用即可
> - 建议为生产环境创建独立的数据库

### 6. 点击部署

EdgeOne Pages 会自动：
- ✅ 克隆 GitHub 仓库
- ✅ 安装依赖
- ✅ 运行构建
- ✅ 部署到全球 CDN
- ✅ 配置 HTTPS

⏱️ **预计部署时间**: 3-5 分钟

---

## 📦 部署后配置

### 1. 数据库迁移

部署成功后，修改构建命令以包含数据库迁移：

```bash
npm run build && npx prisma migrate deploy
```

在 EdgeOne Pages 控制台的「构建配置」中更新此命令。

### 2. 创建管理员账号

1. 访问部署后的网站
2. 注册第一个账号（使用你的邮箱）
3. 在 Neon 数据库控制台执行以下 SQL：

```sql
UPDATE users SET role = 'ADMIN' WHERE email = '你的邮箱@example.com';
```

### 3. 功能测试清单

- [ ] 用户注册
- [ ] 用户登录
- [ ] BMI 计算
- [ ] BMR 计算
- [ ] 体脂率计算
- [ ] 腰臀比计算
- [ ] 血压评估
- [ ] 目标心率计算
- [ ] SLI 计算
- [ ] 卡路里计算
- [ ] 历史记录查看
- [ ] 管理员后台访问
- [ ] 用户管理
- [ ] 密码重置

---

## 🎁 部署完成后你将获得

✅ 免费的 HTTPS 域名（`.edgeone.app`）  
✅ 全球 CDN 加速  
✅ 自动部署（每次 `git push`）  
✅ 预览环境（PR 自动部署）  
✅ 部署历史和一键回滚  
✅ 实时构建日志  
✅ 环境变量管理  

---

## 🔄 持续部署

完成首次部署后，每次你推送代码到 GitHub：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

EdgeOne Pages 会自动检测更改并重新部署！

---

## 🆘 常见问题

### Q: 部署失败怎么办？

1. 检查构建日志（在 EdgeOne Pages 控制台查看）
2. 确认环境变量配置正确
3. 确认 Node 版本兼容（推荐 18.x）
4. 检查数据库连接是否有效

### Q: 如何查看部署日志？

在 EdgeOne Pages 控制台，点击具体的部署记录，可以查看详细的构建日志。

### Q: 如何回滚到之前的版本？

在「部署历史」中选择之前的成功部署，点击「回滚」按钮。

### Q: 如何绑定自定义域名？

在 EdgeOne Pages 控制台的「域名管理」中添加你的域名，并按照提示配置 DNS 记录。

---

## 📚 相关资源

- [EdgeOne Pages 文档](https://cloud.tencent.com/document/product/1145)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Neon 数据库文档](https://neon.tech/docs)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)

---

## 📞 获取帮助

如果在部署过程中遇到问题，可以：

1. 查看 EdgeOne Pages 控制台的部署日志
2. 检查项目的 `README.md` 文件
3. 查看 `env.example` 了解环境变量配置

---

**🎉 祝部署顺利！**

