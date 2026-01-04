# Cloud Resource Management System - Dashboard

基于 `ai_prompt_v2` 规范开发的 Dashboard 前端应用。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据获取**: TanStack Query (React Query)
- **表格**: TanStack Table
- **图表**: Recharts
- **表单**: React Hook Form
- **图标**: Lucide React

## 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根布局
│   ├── page.tsx             # Dashboard 主页
│   ├── providers.tsx        # TanStack Query Provider
│   ├── gateway/             # Gateway 服务模块
│   ├── identity/            # 用户权限模块
│   ├── projects/            # 项目管理模块
│   └── resources/           # 资源管理模块
│       └── ecs/             # ECS 管理
├── components/              # 组件
│   ├── layout/              # 布局组件
│   │   ├── Header.tsx       # 全局头部
│   │   ├── Sidebar.tsx      # 侧边栏导航
│   │   └── Footer.tsx       # 页脚
│   └── dashboard/           # Dashboard 组件
│       ├── StatusCard.tsx   # 状态卡片
│       ├── LineChartPanel.tsx # 折线图面板
│       └── ResourceUsageTable.tsx # 资源使用表格
├── store/                   # Zustand 状态管理
│   ├── useAuthStore.ts      # 认证状态
│   └── useUIStore.ts        # UI 状态
├── services/                # API 服务
│   └── api.ts               # API 客户端和端点
├── hooks/                   # React Hooks
│   └── useDashboard.ts      # Dashboard 数据 hooks
├── types/                   # TypeScript 类型
│   └── index.ts             # 类型定义
├── lib/                     # 工具库
│   └── utils.ts             # 工具函数
└── styles/                  # 样式
    └── globals.css           # 全局样式
```

## Dashboard 功能模块

### 1. Status Summary Cards（状态摘要卡片）
- System Health（系统健康）
- Active Alerts（活跃告警）
- Pending Approvals（待审批）

### 2. Core Metrics（核心指标）
- API Gateway Overview（网关概览）- 折线图
- User & Role Management（用户角色管理）

### 3. Resource Status（资源状态）
- ECS Instance Status（ECS 实例状态）
- Project Resource Usage（项目资源使用）- 表格

### 4. Automation & Cost（自动化与成本）
- Active Alarms（活跃告警列表）
- Task Automation（任务自动化）
- Cost Overview（成本概览）

### 5. Bottom Info（底部信息）
- Audit Logs（审计日志）
- Recent Notifications（最近通知）

## 开始使用

### 安装依赖

```bash
npm install
```

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## API 端点

Dashboard 使用聚合 API 端点，所有数据通过 `/dashboard/*` 路径获取：

- `/dashboard/system/health` - 系统健康状态
- `/dashboard/alerts/active` - 活跃告警数量
- `/dashboard/approvals/pending` - 待审批数量
- `/dashboard/gateway/metrics` - 网关指标
- `/dashboard/users/stats` - 用户统计
- `/dashboard/resources/ecs/status` - ECS 状态
- `/dashboard/projects/usage` - 项目资源使用
- `/dashboard/alerts/list` - 告警列表
- `/dashboard/automation/tasks` - 自动化任务
- `/dashboard/cost/overview` - 成本概览
- `/dashboard/audit/logs` - 审计日志
- `/dashboard/notifications/recent` - 最近通知

## 特性

- ✅ 响应式布局（Header + Sidebar + Main Content）
- ✅ 实时数据更新（TanStack Query 自动轮询）
- ✅ 状态管理（Zustand）
- ✅ 类型安全（TypeScript）
- ✅ 现代化 UI（Tailwind CSS）
- ✅ 图表可视化（Recharts）
- ✅ 数据表格（TanStack Table）

## 开发

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run type-check
```

### 构建

```bash
npm run build
npm start
```

## 许可证

Copyright © 2026 Cloud Resource Management System. All rights reserved.

# login and register resetpassword are working fined with auth-service merge page with login and register and login