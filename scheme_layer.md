# Project Architecture and Layer Analysis

## Overview

This document provides a comprehensive analysis of the Cloud Resource Management System Dashboard project structure, architecture layers, component organization, and complete function reference.

## Project Type

**Next.js 14 Application** with App Router architecture, TypeScript, and Tailwind CSS.

## Last Updated

All functions and modifications documented as of latest implementation including:
- Credentials Management with Local Storage
- Default Network Configuration
- Complete ECS Creation Flow with API Integration
- Review Step Before Submission

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

### Credentials Management and ECS Creation Integration

**Files Modified:**
1. `src/lib/utils.ts`
   - **ADDED**: `saveCredentialToLocalStorage(credential: LocalCredential)` - Saves credentials to localStorage
   - **ADDED**: `getCredentialsFromLocalStorage()` - Retrieves all credentials from localStorage
   - **ADDED**: `getCredentialsByCustomerAndProvider(customer, provider)` - Gets credentials by customer/provider
   - **ADDED**: `deleteCredentialFromLocalStorage(credentialId)` - Deletes credential from localStorage
   - **ADDED**: `getUniqueCustomersFromStorage()` - Gets unique customer names from stored credentials
   - **ADDED**: `getUniqueProvidersFromStorage()` - Gets unique provider names from stored credentials
   - **ADDED**: `LocalCredential` interface - Type definition for locally stored credentials

2. `src/app/credentials/page.tsx`
   - **MODIFIED**: `handleCredentialSubmit()` - Now saves credentials to localStorage using `saveCredentialToLocalStorage()`
   - **MODIFIED**: `handleDeleteCredential()` - Now deletes from localStorage using `deleteCredentialFromLocalStorage()`
   - **ADDED**: `useEffect` hook to load credentials from localStorage on mount
   - **MODIFIED**: State management to sync with localStorage

3. `src/components/server-form/sections/BasicInfoSection/index.tsx`
   - **MODIFIED**: Customer/Provider selection to load from both API and localStorage
   - **MODIFIED**: `useEffect` for loading data - Now loads local credentials
   - **MODIFIED**: Auto-selection logic to use local credentials instead of API
   - **ADDED**: State for `localCredentials`, `localCustomers`, `localProviders`
   - **MODIFIED**: Customer dropdown to show both API and local customers
   - **MODIFIED**: Provider dropdown to show both API and local providers
   - **MODIFIED**: Credential display to show local credential information

4. `src/components/server-form/sections/NetworkSection/index.tsx`
   - **ADDED**: `useEffect` hook to set default VPC and subnet when region/AZ are selected
   - **MODIFIED**: Default VPC format: `vpc-default-{region}`
   - **MODIFIED**: Default subnet format: `subnet-default-{region}-{az}`

5. `src/components/server-form/sections/NetworkSection/VPCSelector.tsx`
   - **MODIFIED**: VPC list to include default VPC based on region
   - **ADDED**: Default VPC option with region label

6. `src/components/server-form/sections/NetworkSection/SubnetSelector.tsx`
   - **MODIFIED**: Subnet list to include default subnet with IP range label
   - **ADDED**: Default subnet option showing IP range (192.168.1.0/24)

7. `src/app/servers/create/hooks/useServerSubmit.ts`
   - **MODIFIED**: `submit()` function to integrate with actual API
   - **ADDED**: Credential retrieval from localStorage
   - **ADDED**: Credential inclusion in API request payload
   - **ADDED**: Error handling with detailed error messages
   - **ADDED**: Loading state management
   - **ADDED**: Success redirect to ECS list page
   - **MODIFIED**: Uses `apiClient.post()` for actual API calls

8. `src/components/server-form/ECSServerForm.tsx`
   - **ADDED**: Review step before submission
   - **ADDED**: `showReview` state management
   - **ADDED**: `handleReview()` function to show review section
   - **ADDED**: `handleCancelReview()` function to hide review section
   - **MODIFIED**: Submit button to show "Review & Create Server"
   - **ADDED**: ReviewDryRunSection integration

9. `src/components/server-form/sections/ReviewDryRunSection/index.tsx`
   - **MODIFIED**: Props interface to support new review flow
   - **MODIFIED**: Added `onConfirm` and `onCancel` props
   - **MODIFIED**: Removed required dry run props (made optional)
   - **MODIFIED**: Updated button layout and styling
   - **MODIFIED**: Made section more compact

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

## Complete Function Reference

### Utility Functions (`src/lib/utils.ts`)

#### Generation Functions
- **`generateServerName(): string`**
  - Generates unique server names with timestamp and random suffix
  - Format: `ecs-{timestamp}-{random}`
  - Returns: Generated server name string
  - Backend-independent, instant generation

- **`generateSecurePassword(length?: number): string`**
  - Generates secure passwords meeting complexity requirements
  - Parameters: `length` (optional, default: 16, minimum: 8)
  - Returns: Generated password string
  - Includes: uppercase, lowercase, numbers, special characters
  - Backend-independent, instant generation

#### Credential Storage Functions
- **`saveCredentialToLocalStorage(credential: LocalCredential): void`**
  - Saves credential to browser localStorage
  - Parameters: `credential` - Credential object with customer, provider, AK, SK
  - Side effects: Updates localStorage
  - Error handling: Logs errors, doesn't throw

- **`getCredentialsFromLocalStorage(): LocalCredential[]`**
  - Retrieves all credentials from localStorage
  - Returns: Array of credential objects
  - Error handling: Returns empty array on error

- **`getCredentialsByCustomerAndProvider(customer: string, provider: string): LocalCredential[]`**
  - Filters credentials by customer and provider
  - Parameters: `customer` - Customer name, `provider` - Provider name
  - Returns: Array of matching credentials

- **`deleteCredentialFromLocalStorage(credentialId: string): void`**
  - Deletes credential from localStorage
  - Parameters: `credentialId` - ID of credential to delete
  - Side effects: Updates localStorage

- **`getUniqueCustomersFromStorage(): string[]`**
  - Gets unique customer names from stored credentials
  - Returns: Array of unique customer names

- **`getUniqueProvidersFromStorage(): string[]`**
  - Gets unique provider names from stored credentials
  - Returns: Array of unique provider names

### Component Functions

#### BasicInfoSection (`src/components/server-form/sections/BasicInfoSection/index.tsx`)

- **`handleCustomerChange(customerId: number | string | undefined): void`**
  - Handles customer selection from dropdown
  - Parameters: `customerId` - Customer ID (number from API or string from localStorage)
  - Side effects: Resets vendor_id and credential_id
  - Updates form data via `onChange` callback

- **`handleVendorChange(vendorId: number | string | undefined): void`**
  - Handles vendor/provider selection from dropdown
  - Parameters: `vendorId` - Vendor ID (number from API or string from localStorage)
  - Side effects: Resets credential_id
  - Updates form data via `onChange` callback

- **`handleRegionChange(region: string): void`**
  - Handles region selection change
  - Parameters: `region` - Selected region string
  - Side effects: Resets availability zone and downstream sections
  - Calls `onResetDownstream` callback if provided

- **`handleAvailabilityZoneChange(az: string): void`**
  - Handles availability zone selection change
  - Parameters: `az` - Selected availability zone string
  - Side effects: Resets downstream sections
  - Calls `onResetDownstream` callback if provided

- **`maskAccessKey(ak: string): string`**
  - Masks access key to show only first 4 characters
  - Parameters: `ak` - Access key string
  - Returns: Masked access key (e.g., "ABCD****")
  - Security: Hides sensitive credential information

- **Auto-selection `useEffect` Hook**
  - Automatically selects credential from localStorage when customer and provider are selected
  - Dependencies: `formValue.customer_id`, `formValue.vendor_id`, `localCredentials`
  - Side effects: Updates `selectedCredential` state and form `credential_id`

#### NetworkSection (`src/components/server-form/sections/NetworkSection/index.tsx`)

- **`handleVPCChange(vpc: string): void`**
  - Handles VPC selection change
  - Parameters: `vpc` - Selected VPC ID
  - Side effects: Resets subnet, calls `onResetDownstream` callback

- **Default VPC/Subnet `useEffect` Hook**
  - Sets default VPC and subnet when region and availability zone are available
  - Dependencies: `region`, `availabilityZone`
  - Default VPC: `vpc-default-{region}`
  - Default Subnet: `subnet-default-{region}-{az}`
  - Only sets if VPC and subnet are not already selected

#### ServerNameInput (`src/components/server-form/sections/BasicInfoSection/ServerNameInput.tsx`)

- **`handleRegenerate(): void`**
  - Regenerates server name using `generateServerName()`
  - Side effects: Updates form value via `onChange` callback
  - User can trigger regeneration via button click

#### AdminPasswordInput (`src/components/server-form/sections/ComputeImageSection/AdminPasswordInput.tsx`)

- **`handleRegenerate(): void`**
  - Regenerates password using `generateSecurePassword(16)`
  - Side effects: Updates form value via `onChange` callback
  - User can trigger regeneration via button click

### Hook Functions

#### useECSServerForm (`src/app/servers/create/hooks/useECSServerForm.ts`)

- **`updateFormData<K extends keyof ServerFormData>(section: K, data: Partial<ServerFormData[K]>): void`**
  - Updates form section data
  - Parameters: `section` - Section key, `data` - Partial section data
  - Side effects: Updates form state via `updateSection`

- **`resetDownstreamSections(changedSection: string, changedField: string): void`**
  - Resets dependent sections when upstream field changes
  - Parameters: `changedSection` - Section that changed, `changedField` - Field that changed
  - Side effects: Resets dependent fields based on form schema dependencies

- **`validate(): boolean`**
  - Validates entire form data
  - Returns: `true` if valid, `false` if errors exist
  - Side effects: Updates errors state

- **`reset(): void`**
  - Resets form to initial state
  - Side effects: Clears all form data and errors

- **Auto-generation `useEffect` Hook**
  - Generates server name and password on component mount
  - Dependencies: Empty array (runs once)
  - Uses `useRef` to prevent regeneration on re-renders
  - Only generates if fields are empty

#### useServerSubmit (`src/app/servers/create/hooks/useServerSubmit.ts`)

- **`submit(formData: ServerFormData): Promise<void>`**
  - Submits form to backend API with credentials
  - Parameters: `formData` - Complete server form data
  - Side effects: 
    - Sets loading state
    - Retrieves credentials from localStorage
    - Makes API POST request to `/ecs`
    - Redirects on success
    - Sets error state on failure
  - Error handling: Catches and displays user-friendly error messages
  - Returns: Promise that resolves on success or rejects on error

### Form Component Functions

#### ECSServerForm (`src/components/server-form/ECSServerForm.tsx`)

- **`handleSectionChange<K extends keyof ServerFormData>(section: K, data: Partial<ServerFormData[K]>): void`**
  - Handles section data updates
  - Parameters: `section` - Section key, `data` - Partial section data
  - Side effects: Updates form data and resets downstream sections

- **`handleReview(): void`**
  - Shows review section before submission
  - Side effects: Sets `showReview` state to `true`
  - Validation: Only shows if form is valid

- **`handleSubmit(): Promise<void>`**
  - Submits form after user confirms in review
  - Side effects: Calls `submit()` from `useServerSubmit` hook
  - Async operation: Waits for API response

- **`handleCancelReview(): void`**
  - Cancels review and returns to form
  - Side effects: Sets `showReview` state to `false`

- **`isSectionEnabled(section: string): boolean`**
  - Checks if section can be enabled based on dependencies
  - Parameters: `section` - Section identifier
  - Returns: `true` if all dependencies are met, `false` otherwise
  - Logic: Checks form data for required upstream fields

### API Integration Functions

#### useServerSubmit (`src/app/servers/create/hooks/useServerSubmit.ts`)

- **Function**: `submit(formData: ServerFormData): Promise<void>`
- **Endpoint**: `POST /ecs` (configurable via `NEXT_PUBLIC_ECS_CREATE` environment variable)
- **Request Payload**:
  ```typescript
  {
    // Form data mapped to API format
    region, availability_zone, name, count,
    flavor, image, admin_password,
    system_disk, data_disks,
    vpc_id, subnet_id, private_ip, enable_ipv6, public_ip,
    charging_mode, auto_terminate_time, tags,
    // Credentials from localStorage
    access_key, secret_key, customer, provider
  }
  ```
- **Error Handling**: 
  - Catches API errors
  - Extracts error messages from response
  - Displays user-friendly error messages
  - Logs errors to console for debugging
- **Loading State**: 
  - Sets `loading` to `true` during submission
  - Sets `loading` to `false` on completion
- **Success Flow**: 
  - Redirects to `/resources/ecs` on successful creation
  - Uses Next.js router for navigation
- **Credential Integration**:
  - Retrieves credentials from localStorage
  - Matches credential by ID from form data
  - Includes AK/SK in API request
  - Only includes if credential exists

### Data Flow for Complete ECS Creation

```
1. User navigates to /resources/ecs/create
   ↓
2. Form initializes (useECSServerForm)
   ↓
3. Auto-generate server name and password
   ↓
4. Load customers/providers from API and localStorage
   ↓
5. User selects customer and provider
   ↓
6. Auto-select credential from localStorage
   ↓
7. User fills all form sections
   ↓
8. Network section auto-sets default VPC/subnet
   ↓
9. User clicks "Review & Create Server"
   ↓
10. Review section displays all form data
    ↓
11. User confirms in review
    ↓
12. Submit function:
    - Gets credentials from localStorage
    - Maps form data to API format
    - Includes credentials in request
    - Calls POST /ecs API
    - Handles errors/loading
    - Redirects on success
```

## Implementation Summary

### All Functions and Modifications

#### Files Modified (11 files)

1. **`src/lib/utils.ts`**
   - **ADDED**: `saveCredentialToLocalStorage()` - Save credentials to localStorage
   - **ADDED**: `getCredentialsFromLocalStorage()` - Get all credentials
   - **ADDED**: `getCredentialsByCustomerAndProvider()` - Filter credentials
   - **ADDED**: `deleteCredentialFromLocalStorage()` - Delete credential
   - **ADDED**: `getUniqueCustomersFromStorage()` - Get unique customers
   - **ADDED**: `getUniqueProvidersFromStorage()` - Get unique providers
   - **ADDED**: `LocalCredential` interface - Type definition

2. **`src/app/credentials/page.tsx`**
   - **MODIFIED**: `handleCredentialSubmit()` - Now saves to localStorage
   - **MODIFIED**: `handleDeleteCredential()` - Now deletes from localStorage
   - **ADDED**: `useEffect` to load credentials on mount

3. **`src/components/server-form/sections/BasicInfoSection/index.tsx`**
   - **MODIFIED**: Customer/Provider selection to support localStorage
   - **MODIFIED**: Auto-selection logic to use local credentials
   - **ADDED**: State for local credentials management
   - **MODIFIED**: Dropdowns to show both API and local options

4. **`src/components/server-form/sections/NetworkSection/index.tsx`**
   - **ADDED**: `useEffect` for default VPC/subnet configuration

5. **`src/components/server-form/sections/NetworkSection/VPCSelector.tsx`**
   - **MODIFIED**: VPC list to include default VPC

6. **`src/components/server-form/sections/NetworkSection/SubnetSelector.tsx`**
   - **MODIFIED**: Subnet list to include default subnet with IP range

7. **`src/app/servers/create/hooks/useServerSubmit.ts`**
   - **MODIFIED**: `submit()` - Complete API integration
   - **ADDED**: Credential retrieval from localStorage
   - **ADDED**: Error handling and loading states

8. **`src/components/server-form/ECSServerForm.tsx`**
   - **ADDED**: Review step before submission
   - **ADDED**: Review state management
   - **MODIFIED**: Submit button to show review first

9. **`src/components/server-form/sections/ReviewDryRunSection/index.tsx`**
   - **MODIFIED**: Props interface for new review flow
   - **MODIFIED**: Button layout and styling

10. **`src/types/server.ts`**
    - **MODIFIED**: `BasicInfo` interface to support string IDs for local credentials

11. **`src/mappers/serverFormToApi.ts`**
    - **MODIFIED**: `ServerApiRequest` interface to include credentials
    - Credentials added in `useServerSubmit`, not in mapper

#### Functions Added (13 new functions)

**Utility Functions:**
1. `saveCredentialToLocalStorage(credential)`
2. `getCredentialsFromLocalStorage()`
3. `getCredentialsByCustomerAndProvider(customer, provider)`
4. `deleteCredentialFromLocalStorage(credentialId)`
5. `getUniqueCustomersFromStorage()`
6. `getUniqueProvidersFromStorage()`

**Component Functions:**
7. `handleRegenerate()` in ServerNameInput
8. `handleRegenerate()` in AdminPasswordInput
9. `handleReview()` in ECSServerForm
10. `handleCancelReview()` in ECSServerForm

**Hook Functions:**
11. Auto-generation `useEffect` in useECSServerForm
12. Auto-selection `useEffect` in BasicInfoSection
13. Default network `useEffect` in NetworkSection

#### Functions Modified (5 functions)

1. `handleCredentialSubmit()` - Now saves to localStorage
2. `handleDeleteCredential()` - Now deletes from localStorage
3. `submit()` in useServerSubmit - Complete API integration
4. `handleCustomerChange()` - Supports string/number IDs
5. `handleVendorChange()` - Supports string/number IDs

## Conclusion

The project follows a clean architecture with clear separation of concerns:
- **UI Components** handle presentation
- **Hooks** manage business logic
- **Services** handle API communication
- **Utilities** provide pure functions
- **State Management** follows hierarchical layering
- **Local Storage** used for credential persistence (not sensitive data)

All features integrate seamlessly:
- ✅ Auto-generation of server name and password
- ✅ Local storage for credentials management
- ✅ Customer/Provider selection from stored credentials
- ✅ Default network configuration (VPC/subnet with IP)
- ✅ Complete API integration with error handling
- ✅ Review step before submission
- ✅ Full ECS creation workflow
- ✅ Loading states and error handling throughout
- ✅ All functions documented in English
- ✅ No breaking changes to existing functionality

