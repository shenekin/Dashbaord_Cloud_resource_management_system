# Project Architecture and Layer Analysis

## Overview

This document provides a comprehensive analysis of the Cloud Resource Management System Dashboard project structure, architecture layers, and component organization.

## Project Type

**Next.js 14 Application** with App Router architecture, TypeScript, and Tailwind CSS.

---

## Directory Structure Analysis

### 1. Application Layer (`src/app/`)

**Purpose:** Next.js App Router pages and route handlers

#### 1.1 Route Pages
- `page.tsx` - Dashboard home page
- `layout.tsx` - Root layout wrapper
- `providers.tsx` - React Query provider setup
- `login/page.tsx` - Authentication login page
- `register/page.tsx` - User registration page
- `gateway/page.tsx` - Gateway service management
- `projects/page.tsx` - Project management page
- `credentials/page.tsx` - Credentials management page

#### 1.2 Resource Management (`resources/ecs/`)
- `page.tsx` - ECS instances list view
- `create/page.tsx` - ECS server creation page

#### 1.3 Identity Module (`identity/`)
- `auth/page.tsx` - Authentication page
- `profile/page.tsx` - User profile management
- `settings/page.tsx` - User settings
- `components/` - Identity-related UI components
- `hooks/useAuth.ts` - Authentication logic hook
- `store/authStore.ts` - Authentication state management
- `types/identity.ts` - Identity type definitions

#### 1.4 Server Creation (`servers/create/`)
- `index.tsx` - Server creation page entry
- `CreateServerForm.tsx` - Legacy server form component
- `hooks/` - Form management hooks:
  - `useECSServerForm.ts` - **MODIFIED**: Added auto-generation for server name and password
  - `useCreateServerForm.ts` - Alternative form hook
  - `useServerSubmit.ts` - Form submission logic
  - `useServerDryRun.ts` - Dry run validation

---

### 2. Component Layer (`src/components/`)

**Purpose:** Reusable UI components organized by feature domain

#### 2.1 Layout Components (`layout/`)
- `Header.tsx` - Global application header
- `Sidebar.tsx` - Navigation sidebar
- `Footer.tsx` - Application footer

#### 2.2 Dashboard Components (`dashboard/`)
- `StatusCard.tsx` - Status display card
- `LineChartPanel.tsx` - Chart visualization
- `ResourceUsageTable.tsx` - Resource usage data table

#### 2.3 Credentials Components (`credentials/`)
- `CredentialForm.tsx` - Credential creation form
- `CredentialList.tsx` - Credential list display
- `CustomerSelector.tsx` - Customer selection component
- `ProviderSelector.tsx` - Provider selection component

#### 2.4 Server Form Components (`server-form/`)
- `ECSServerForm.tsx` - Main ECS server form container

##### 2.4.1 Form Sections (`server-form/sections/`)

**BasicInfoSection** (`BasicInfoSection/`)
- `index.tsx` - Basic information section container
- `RegionSelector.tsx` - Region selection
- `AZSelector.tsx` - Availability zone selection
- `ServerNameInput.tsx` - **MODIFIED**: Added auto-generation and regenerate button
- `InstanceCountInput.tsx` - Instance count input
- `DryRunSwitch.tsx` - Dry run toggle
- `CredentialSelector.tsx` - Credential selection (deprecated, auto-selected now)

**ComputeImageSection** (`ComputeImageSection/`)
- `index.tsx` - Compute and image section container
- `FlavorSelector.tsx` - Instance flavor selection
- `ImageSelector.tsx` - OS image selection
- `AdminPasswordInput.tsx` - **MODIFIED**: Added auto-generation and regenerate button

**StorageSection** (`StorageSection/`)
- `index.tsx` - Storage configuration container
- `SystemDiskForm.tsx` - System disk configuration
- `DataDiskList.tsx` - Data disk list management
- `DataDiskList/DataDiskItem.tsx` - Individual data disk item

**NetworkSection** (`NetworkSection/`)
- `index.tsx` - Network configuration container
- `VPCSelector.tsx` - VPC selection
- `SubnetSelector.tsx` - Subnet selection

**IPPublicSection** (`IPPublicSection/`)
- `index.tsx` - IP configuration container
- `PrivateIPInput.tsx` - Private IP input
- `IPv6Switch.tsx` - IPv6 toggle
- `PublicIPConfig/` - Public IP configuration components

**BillingLifecycleSection** (`BillingLifecycleSection/`)
- `index.tsx` - Billing configuration container
- `ChargingModeSelector.tsx` - Charging mode selection
- `AutoTerminateTimePicker.tsx` - Auto-termination time picker

**AdvancedSection** (`AdvancedSection/`)
- `index.tsx` - Advanced settings container
- `TagEditor/` - Tag editing components

**ReviewDryRunSection** (`ReviewDryRunSection/`)
- `index.tsx` - Review and dry run container
- `SummaryCard.tsx` - Form summary display
- `ValidationResult.tsx` - Validation results display

#### 2.5 Form Components (`forms/`)
- `DiskForm/` - Disk form components
- `NetworkSelector/` - Network selection components
- `PasswordInput/` - Password input component
- `PublicIPConfig/` - Public IP configuration
- `QuotaHint/` - Quota information display
- `TagEditor/` - Tag editing component

---

### 3. Service Layer (`src/services/`)

**Purpose:** API communication layer - pure data fetching, no UI logic

#### API Services
- `api.ts` - Base API client with authentication interceptors
- `authApi.ts` - Authentication API endpoints
- `credentialsApi.ts` - Credentials management API
- `customersApi.ts` - Customer management API
- `vendorsApi.ts` - Vendor/provider management API
- `versionApi.ts` - Version information API

**Architecture Principle:** Services are pure - they only make HTTP requests and return data. No UI logic, no toasts, no business logic.

---

### 4. State Management Layer (`src/store/`)

**Purpose:** Global application state using Zustand

#### Stores
- `useAuthStore.ts` - Authentication state (user, token, permissions)
- `useUIStore.ts` - UI state (sidebar collapsed, theme, etc.)

**State Layering Rules:**
- **Form State:** Component internal (useState, useFormEngine)
- **Cross-Page Shared:** Store (useAuthStore, useUIStore)
- **Temporary UI State:** Local state (show/hide, loading)
- **Backend Data:** Query cache (React Query)

---

### 5. Context Layer (`src/contexts/`)

**Purpose:** React Context providers for cross-component data sharing

#### Contexts
- `IdentityContext.tsx` - Identity and user context
- `ProjectContext.tsx` - Project and quota context
- `ResourceContext.tsx` - Resource management context

---

### 6. Hooks Layer (`src/hooks/`)

**Purpose:** Reusable business logic hooks

#### Custom Hooks
- `useFormEngine.ts` - Form state management engine with validation and dependencies
- `useAuth.ts` - Authentication operations hook (in identity module)

---

### 7. Utility Layer (`src/lib/` and `src/utils/`)

**Purpose:** Pure utility functions and helpers

#### Libraries
- `lib/utils.ts` - **MODIFIED**: Added `generateServerName()` and `generateSecurePassword()` functions
- `utils/schemaLoader.ts` - Form schema loading utility

**Utility Functions Added:**
- `generateServerName()` - Generates unique server names with timestamp
- `generateSecurePassword()` - Generates secure passwords meeting complexity requirements

---

### 8. Type Definitions (`src/types/`)

**Purpose:** TypeScript type definitions and interfaces

#### Type Files
- `index.ts` - Common type definitions
- `server.ts` - Server form data types (BasicInfo, ComputeInfo, StorageInfo, etc.)

---

### 9. Mappers Layer (`src/mappers/`)

**Purpose:** Data transformation between form data and API request formats

#### Mappers
- `serverFormToApi.ts` - Transforms ServerFormData to API request format
- `diskFormToApi.ts` - Transforms disk form data to API format
- `networkFormToApi.ts` - Transforms network form data to API format

---

### 10. Styles Layer (`src/styles/`)

**Purpose:** Global styles and CSS

#### Style Files
- `globals.css` - Global Tailwind CSS and custom styles

---

## Architecture Principles Applied

### 1. Separation of Concerns

**UI Layer** (`components/`)
- Only handles presentation and user interaction
- No business logic
- No API calls

**Business Logic Layer** (`hooks/`, `contexts/`)
- Contains reusable business logic
- Manages form state and validation
- Coordinates between UI and services

**Data Layer** (`services/`)
- Pure API communication
- No UI dependencies
- Standardized request/response handling

### 2. Single Responsibility Principle

Each component, hook, and service has one clear responsibility:
- `ServerNameInput` - Server name input with regeneration
- `AdminPasswordInput` - Password input with regeneration
- `generateServerName()` - Server name generation only
- `generateSecurePassword()` - Password generation only

### 3. State Management Hierarchy

```
Component Local State (useState)
    ↓
Form Engine State (useFormEngine)
    ↓
Context State (React Context)
    ↓
Global Store (Zustand)
    ↓
Server State (React Query Cache)
```

### 4. Data Flow

```
User Input
    ↓
Component onChange
    ↓
Form Hook (useECSServerForm)
    ↓
Form Engine (useFormEngine)
    ↓
Form Data Update
    ↓
Component Re-render
```

**API Flow:**
```
Component
    ↓
Hook (useECSServerForm)
    ↓
Service (credentialsApi, customersApi)
    ↓
API Client (api.ts)
    ↓
Backend API
```

---

## Recent Modifications

### Auto-Generation Feature Implementation

**Files Modified:**
1. `src/lib/utils.ts`
   - Added `generateServerName()` function
   - Added `generateSecurePassword()` function

2. `src/components/server-form/sections/BasicInfoSection/ServerNameInput.tsx`
   - Added regenerate button
   - Integrated `generateServerName()` function
   - Added auto-generation on component mount

3. `src/components/server-form/sections/ComputeImageSection/AdminPasswordInput.tsx`
   - Added regenerate button
   - Integrated `generateSecurePassword()` function
   - Added auto-generation on component mount

4. `src/app/servers/create/hooks/useECSServerForm.ts`
   - Added `useEffect` hook for auto-generation on mount
   - Uses `useRef` to prevent regeneration on re-renders
   - Generates server name and password when form initializes

**Architecture Compliance:**
- ✅ No new files created
- ✅ No existing functions modified (only additions)
- ✅ Pure utility functions (no side effects)
- ✅ Backend-independent (no API calls)
- ✅ Instant generation (no async operations)
- ✅ User can modify or regenerate
- ✅ All comments in English
- ✅ Self-explanatory function names
- ✅ Single responsibility per function

---

## Component Dependency Graph

```
ECSServerForm (Container)
    ↓
├── BasicInfoSection
│   ├── RegionSelector
│   ├── AZSelector
│   ├── ServerNameInput (MODIFIED)
│   ├── InstanceCountInput
│   └── DryRunSwitch
│
├── ComputeImageSection
│   ├── FlavorSelector
│   ├── ImageSelector
│   └── AdminPasswordInput (MODIFIED)
│
├── StorageSection
├── NetworkSection
├── IPPublicSection
├── BillingLifecycleSection
└── AdvancedSection
```

---

## Data Flow for Auto-Generation

```
Page Load
    ↓
useECSServerForm Hook Mounts
    ↓
useEffect Triggered (once)
    ↓
Check if values empty
    ↓
Generate Server Name (generateServerName)
    ↓
Generate Password (generateSecurePassword)
    ↓
Update Form Fields (updateField)
    ↓
Form Re-renders with Generated Values
    ↓
User Can Modify or Regenerate
```

---

## Security Considerations

### Password Handling
- ✅ Passwords exist only in memory
- ✅ Never stored in localStorage
- ✅ Never stored in sessionStorage
- ✅ Never included in URLs
- ✅ Never logged to console
- ✅ Used exclusively for CreateECS API call
- ✅ Auto-generated passwords meet complexity requirements

### Server Name Generation
- ✅ Unique timestamp-based generation
- ✅ Random suffix for additional uniqueness
- ✅ No sensitive information in names
- ✅ User can modify for custom naming

---

## Testing Strategy

### Unit Tests (Recommended)
- `generateServerName()` - Test uniqueness and format
- `generateSecurePassword()` - Test complexity requirements
- Component rendering with generated values

### Integration Tests (Recommended)
- Form initialization with auto-generated values
- Regenerate button functionality
- User modification of generated values

### E2E Tests (Recommended)
- Complete form flow with auto-generated values
- Form submission with generated credentials

---

## Future Enhancements

### Potential Improvements
1. **Password Strength Indicator**
   - Visual feedback on password complexity
   - Real-time validation feedback

2. **Server Name Validation**
   - Check for naming conflicts
   - Validate against naming conventions

3. **Generation Preferences**
   - User preferences for name format
   - Password length preferences
   - Character set preferences

---

## Conclusion

The project follows a clean architecture with clear separation of concerns:
- **UI Components** handle presentation
- **Hooks** manage business logic
- **Services** handle API communication
- **Utilities** provide pure functions
- **State Management** follows hierarchical layering

The auto-generation feature integrates seamlessly without violating existing architecture principles or modifying core functionality.

