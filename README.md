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

---

## Auto-Generation Feature: Server Name and Login Password

### Overview

The ECS server creation form now includes automatic generation of **Server Name** and **Administrator Password** when the page loads. Users can modify these generated values or regenerate new ones using the regenerate buttons.

### Features

- ✅ **Backend-Independent**: Generation happens instantly without API calls
- ✅ **Auto-Generated on Page Load**: Values are generated when the form initializes
- ✅ **User Modifiable**: Users can edit the generated values
- ✅ **Regeneratable**: Users can generate new values using regenerate buttons
- ✅ **Secure Password Generation**: Passwords meet complexity requirements (uppercase, lowercase, number, special character)
- ✅ **Unique Server Names**: Names include timestamp and random suffix for uniqueness

### Implementation Details

#### 1. Generation Utilities

**File:** `src/lib/utils.ts`

**Functions Added:**
- `generateServerName()`: Generates unique server names in format `ecs-{timestamp}-{random}`
  - Example: `ecs-20240115123456-a3f2`
  - Uses ISO timestamp and random alphanumeric suffix
  
- `generateSecurePassword(length?: number)`: Generates secure passwords meeting complexity requirements
  - Default length: 16 characters
  - Minimum length: 8 characters
  - Includes: uppercase, lowercase, numbers, special characters
  - Shuffled to avoid predictable patterns

**Location in Code:**
```typescript
// src/lib/utils.ts
export function generateServerName(): string
export function generateSecurePassword(length: number = 16): string
```

#### 2. Server Name Input Component

**File:** `src/components/server-form/sections/BasicInfoSection/ServerNameInput.tsx`

**Modifications:**
- Added "Regenerate" button next to the label
- Integrated `generateServerName()` function
- Button triggers regeneration on click
- Generated name is immediately available for user editing

**Location in UI:**
- **Section**: Basic Information
- **Field**: Server Name
- **Button**: "Regenerate" (top-right of field label)

#### 3. Administrator Password Input Component

**File:** `src/components/server-form/sections/ComputeImageSection/AdminPasswordInput.tsx`

**Modifications:**
- Added "Regenerate" button next to the label
- Integrated `generateSecurePassword()` function
- Button triggers regeneration on click
- Generated password is immediately available for user editing
- Maintains existing Show/Hide password functionality

**Location in UI:**
- **Section**: Compute & Image
- **Field**: Administrator Password
- **Button**: "Regenerate" (top-right of field label)

#### 4. Form Hook Auto-Generation

**File:** `src/app/servers/create/hooks/useECSServerForm.ts`

**Modifications:**
- Added `useEffect` hook that runs once on component mount
- Auto-generates server name if field is empty
- Auto-generates password if field is empty
- Uses `useRef` to prevent regeneration on re-renders
- Only generates on initial mount, not on subsequent updates

**Initialization Flow:**
1. Form hook mounts
2. `useEffect` checks if server name is empty
3. If empty, generates server name using `generateServerName()`
4. Checks if password is empty
5. If empty, generates password using `generateSecurePassword(16)`
6. Updates form fields with generated values
7. Form re-renders with pre-filled values

**Location in Code:**
```typescript
// src/app/servers/create/hooks/useECSServerForm.ts
useEffect(() => {
  // Auto-generation logic
}, []);
```

### User Experience

1. **Page Load**: User navigates to ECS Create page (`/resources/ecs/create`)
2. **Auto-Generation**: Server name and password are automatically generated and displayed
3. **User Options**:
   - **Edit**: User can modify the generated values directly in the input fields
   - **Regenerate**: User can click "Regenerate" button to generate new values
4. **Form Submission**: Generated or modified values are submitted with the form

### Security Considerations

- ✅ **Password Security**: 
  - Passwords exist only in memory (never stored)
  - Never logged to console
  - Never included in URLs
  - Never stored in localStorage or sessionStorage
  - Used exclusively for CreateECS API call

- ✅ **Server Name Security**:
  - No sensitive information in generated names
  - Unique timestamp-based generation
  - User can customize for their naming conventions

### Code Quality

- ✅ **No New Files**: All modifications in existing files
- ✅ **No Function Modifications**: Only additions, no changes to existing functions
- ✅ **Self-Explanatory Naming**: Function names clearly describe purpose
- ✅ **Single Responsibility**: Each function has one clear purpose
- ✅ **Pure Functions**: Generation functions have no side effects
- ✅ **English Comments**: All documentation in English
- ✅ **Type Safety**: Full TypeScript type definitions

### Testing

**Manual Testing Steps:**
1. Navigate to `/resources/ecs/create`
2. Verify server name is auto-generated in Basic Information section
3. Verify password is auto-generated in Compute & Image section
4. Test "Regenerate" button for server name
5. Test "Regenerate" button for password
6. Test manual editing of generated values
7. Verify form submission includes generated/modified values

**Expected Behavior:**
- Server name format: `ecs-{timestamp}-{random}`
- Password length: 16 characters
- Password contains: uppercase, lowercase, number, special character
- Regenerate buttons work instantly
- User can edit generated values
- Form validation works with generated values

### Related Documentation

- **Project Architecture**: See `scheme_layer.md` for detailed project structure
- **API Integration**: See `functions-with-api.md` for API documentation
- **Component Details**: See component files for inline documentation

---

## Recent Updates

### Auto-Generation Feature (Latest)
- ✅ Server name auto-generation on page load
- ✅ Password auto-generation on page load
- ✅ Regenerate buttons for both fields
- ✅ Backend-independent instant generation
- ✅ User modification and regeneration support