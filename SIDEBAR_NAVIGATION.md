# 📋 侧边栏导航功能

## ✨ 功能说明

为所有计算器页面添加了**侧边栏导航菜单**，方便用户快速切换不同的健康计算器。

## 🎯 主要特性

### 1. 桌面端体验
- ✅ 固定在左侧的侧边栏
- ✅ 256px 宽度，舒适的阅读和点击区域
- ✅ 当前页面高亮显示
- ✅ 图标 + 名称 + 描述的清晰展示
- ✅ 平滑的过渡动画

### 2. 移动端体验
- ✅ 悬浮按钮（右下角）触发
- ✅ 全屏抽屉式菜单
- ✅ 半透明遮罩背景
- ✅ 点击任意位置或选项后自动关闭
- ✅ 平滑的滑入/滑出动画

### 3. 视觉设计
- 🎨 每个计算器都有独特的 Emoji 图标
- 🎨 当前活跃项带蓝色高亮和指示点
- 🎨 悬停效果提升交互体验
- 🎨 清晰的层次结构和边界

## 📁 文件结构

### 新增组件

#### 1. `src/components/CalculatorSidebar.tsx`
侧边栏导航组件，包含：
- 所有 8 个计算器的链接
- 响应式布局（桌面/移动）
- 当前页面高亮逻辑
- 移动端菜单切换

```tsx
const calculators = [
  { id: 'bmi', name: 'BMI 计算器', icon: '📊', href: '/calculators/bmi' },
  { id: 'bmr', name: 'BMR 计算器', icon: '🔥', href: '/calculators/bmr' },
  // ... 其他计算器
]
```

#### 2. `src/components/CalculatorLayout.tsx`
计算器页面布局组件，包含：
- Header（顶部导航）
- CalculatorSidebar（侧边栏）
- Main 内容区域

### 修改的文件
所有 8 个计算器页面都已更新：
- ✅ `/calculators/bmi/page.tsx`
- ✅ `/calculators/bmr/page.tsx`
- ✅ `/calculators/body-fat/page.tsx`
- ✅ `/calculators/waist-hip/page.tsx`
- ✅ `/calculators/blood-pressure/page.tsx`
- ✅ `/calculators/target-heart-rate/page.tsx`
- ✅ `/calculators/sli/page.tsx`
- ✅ `/calculators/calorie/page.tsx`

## 🎨 UI 结构

### 桌面端布局
```
┌─────────────────────────────────────────┐
│           Header (顶部导航)              │
├──────────┬──────────────────────────────┤
│          │                              │
│ 侧边栏    │      主内容区域               │
│ (256px)  │                              │
│          │   ┌──────────────────┐       │
│ 📊 BMI   │   │   页面标题       │       │
│ 🔥 BMR   │   │   页面描述       │       │
│ 💪 体脂率 │   ├──────────────────┤       │
│ 📏 腰臀比 │   │   表单卡片       │       │
│ ❤️ 血压   │   │                  │       │
│ 💓 心率   │   ├──────────────────┤       │
│ 🏃 SLI   │   │   结果卡片       │       │
│ 🍽️ 卡路里│   │                  │       │
│          │   └──────────────────┘       │
└──────────┴──────────────────────────────┘
```

### 移动端布局
```
正常状态:
┌─────────────────────┐
│   Header (顶部)     │
├─────────────────────┤
│                     │
│   主内容区域         │
│                     │
│                     │
│              [📋]  │ ← 悬浮按钮
└─────────────────────┘

菜单打开:
┌─────────────────────┐
│   Header (顶部)     │
├─────┬───────────────┤
│侧边栏│  半透明遮罩   │
│     │               │
│📊BMI│        [✕]    │
│🔥BMR│               │
│💪...│               │
│     │               │
└─────┴───────────────┘
```

## 📋 计算器列表

| 图标 | 名称 | 描述 | 路径 |
|------|------|------|------|
| 📊 | BMI 计算器 | 身体质量指数 | `/calculators/bmi` |
| 🔥 | BMR 计算器 | 基础代谢率 | `/calculators/bmr` |
| 💪 | 体脂率 | 体脂百分比 | `/calculators/body-fat` |
| 📏 | 腰臀比 | 脂肪分布 | `/calculators/waist-hip` |
| ❤️ | 血压评估 | 心血管健康 | `/calculators/blood-pressure` |
| 💓 | 目标心率 | 运动心率区间 | `/calculators/target-heart-rate` |
| 🏃 | 心脏负荷 | SLI 指数 | `/calculators/sli` |
| 🍽️ | 卡路里需求 | 每日热量 | `/calculators/calorie` |

## 💻 技术实现

### 1. 使用 Next.js usePathname
```tsx
import { usePathname } from 'next/navigation'

const pathname = usePathname()
const isActive = pathname === calc.href
```

### 2. 响应式设计（Tailwind CSS）
```tsx
className="lg:hidden"  // 移动端显示，桌面端隐藏
className="hidden lg:block"  // 桌面端显示，移动端隐藏
className="lg:sticky"  // 桌面端固定定位
```

### 3. 状态管理
```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
```

### 4. 动画效果
```tsx
className="transition-transform duration-300"
className={isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
```

## 🎯 用户体验提升

### 之前
用户需要：
1. 返回计算器列表页
2. 找到想要的计算器
3. 点击进入

**3 步操作，2 次页面跳转**

### 现在
用户只需要：
1. 打开侧边栏（移动端）
2. 点击想要的计算器

**2 步操作，1 次页面跳转**

### 优势
- ⚡ **更快速**：减少操作步骤
- 🎯 **更直观**：所有选项一目了然
- 💡 **更智能**：高亮当前位置
- 📱 **更友好**：移动端优化

## 🔧 自定义配置

### 添加新计算器

在 `src/components/CalculatorSidebar.tsx` 中添加：

```tsx
const calculators = [
  // ... 现有计算器
  {
    id: 'new-calculator',
    name: '新计算器',
    icon: '🆕',
    href: '/calculators/new-calculator',
    description: '描述信息',
  },
]
```

### 修改侧边栏宽度

```tsx
// 在 CalculatorSidebar.tsx 中修改
className="w-64"  // 改为其他宽度，如 w-72
```

### 修改移动端按钮位置

```tsx
// 在 CalculatorSidebar.tsx 中修改
className="fixed bottom-4 right-4"  // 改为其他位置
```

## 📱 响应式断点

- **移动端**: < 1024px（lg 断点以下）
  - 侧边栏默认隐藏
  - 悬浮按钮显示
  - 抽屉式菜单

- **桌面端**: ≥ 1024px（lg 断点及以上）
  - 侧边栏固定显示
  - 悬浮按钮隐藏
  - 静态侧边栏

## 🎨 颜色方案

### 当前活跃项
- 背景：`bg-primary-50`（浅蓝色）
- 边框：`border-primary-200`（蓝色）
- 文字：`text-primary-700`（深蓝色）
- 指示点：`bg-primary-600`（主蓝色）

### 悬停状态
- 背景：`hover:bg-gray-50`（浅灰色）

### 移动端按钮
- 背景：`bg-primary-600`（主蓝色）
- 悬停：`hover:bg-primary-700`（深蓝色）

## ♿ 可访问性

- ✅ 语义化 HTML（`<nav>`, `<aside>`, `<ul>`, `<li>`）
- ✅ ARIA 标签（`aria-label`）
- ✅ 键盘导航友好
- ✅ 焦点状态清晰
- ✅ 屏幕阅读器支持

## 🚀 性能优化

- ✅ Client Component 只在需要交互的地方使用
- ✅ Next.js Link 预加载
- ✅ CSS Transitions 而非 JavaScript 动画
- ✅ 条件渲染减少 DOM 节点

## 🐛 已知限制

暂无已知问题。

## 📝 未来改进建议

- [ ] 添加键盘快捷键（Ctrl+K 打开菜单）
- [ ] 添加搜索功能
- [ ] 添加收藏/常用功能
- [ ] 添加最近使用记录
- [ ] 支持自定义排序
- [ ] 添加折叠/展开功能

## ✅ 测试清单

- [x] 桌面端侧边栏正常显示
- [x] 移动端悬浮按钮正常显示
- [x] 当前页面高亮正确
- [x] 点击切换页面正常
- [x] 移动端菜单打开/关闭正常
- [x] 响应式布局正常
- [x] 所有链接可用
- [x] 无 TypeScript 错误
- [x] 无 Linter 错误

---

**创建日期**: 2024-11-07  
**版本**: v1.4.0  
**状态**: ✅ 完成并测试

