# Cloud Resource Management System - Dashboard

Dashboard frontend application developed based on `ai_prompt_v2` specification.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx             # Dashboard home page
│   ├── providers.tsx        # TanStack Query Provider
│   ├── gateway/             # Gateway service module
│   ├── identity/            # User & permission module
│   ├── projects/            # Project management module
│   └── resources/           # Resource management module
│       └── ecs/             # ECS management
├── components/              # Components
│   ├── layout/              # Layout components
│   │   ├── Header.tsx       # Global header
│   │   ├── Sidebar.tsx      # Sidebar navigation
│   │   └── Footer.tsx       # Footer
│   └── dashboard/           # Dashboard components
│       ├── StatusCard.tsx   # Status card
│       ├── LineChartPanel.tsx # Line chart panel
│       └── ResourceUsageTable.tsx # Resource usage table
├── store/                   # Zustand state management
│   ├── useAuthStore.ts      # Authentication state
│   └── useUIStore.ts        # UI state
├── services/                # API services
│   └── api.ts               # API client and endpoints
├── hooks/                   # React Hooks
│   └── useDashboard.ts      # Dashboard data hooks
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
├── lib/                     # Utility library
│   └── utils.ts             # Utility functions
└── styles/                  # Styles
    └── globals.css           # Global styles
```

## Dashboard Feature Modules

### 1. Status Summary Cards
- System Health
- Active Alerts
- Pending Approvals

### 2. Core Metrics
- API Gateway Overview - Line chart
- User & Role Management

### 3. Resource Status
- ECS Instance Status
- Project Resource Usage - Table

### 4. Automation & Cost
- Active Alarms List
- Task Automation
- Cost Overview

### 5. Bottom Info
- Audit Logs
- Recent Notifications

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


Dashboard `/dashboard/*` ：

- `/dashboard/system/health` - 
- `/dashboard/alerts/active` - 
- `/dashboard/approvals/pending` - 
- `/dashboard/gateway/metrics` - 
- `/dashboard/users/stats` - 
- `/dashboard/resources/ecs/status` - 
- `/dashboard/projects/usage` - 
- `/dashboard/alerts/list` - 
- `/dashboard/automation/tasks` -
- `/dashboard/cost/overview` -
- `/dashboard/audit/logs` - 
- `/dashboard/notifications/recent` 

## Features

- ✅ Responsive Layout (Header + Sidebar + Main Content)
- ✅ Real-time Data Updates (TanStack Query auto-polling)
- ✅ State Management (Zustand)
- ✅ Type Safety (TypeScript)
- ✅ Modern UI (Tailwind CSS)
- ✅ Chart Visualization (Recharts)
- ✅ Data Tables (TanStack Table)

## Development

### Code Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

### Build

```bash
npm run build
npm start
```

## License

Copyright © 2026 Cloud Resource Management System. All rights reserved.

# Login and register reset password are working fine with auth-service. Merged page with login and register.