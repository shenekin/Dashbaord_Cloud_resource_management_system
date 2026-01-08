# API Integration Summary - Gateway Service

This document summarizes all API integrations connected to the gateway-service and tracks implementation status.

## Base Configuration

**Gateway Service Base URL:** `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8001`)  
**Configuration File:** `next.config.js`  
**API Service File:** `src/services/api.ts`  
**Authentication:** All authenticated requests include JWT token via `Authorization: Bearer <token>` header

---

## 1. Authentication API ✅

**Service:** `auth-service` (via gateway)  
**Status:** ✅ Fully Implemented

### Endpoints:

| Function | Method | Endpoint | Status |
|----------|--------|----------|--------|
| `authApi.login()` | POST | `/auth/login` | ✅ Implemented |
| `authApi.refreshToken()` | POST | `/auth/refresh` | ✅ Implemented |
| `authApi.verifyToken()` | GET | `/auth/verify` | ✅ Implemented |
| `authApi.createUser()` | POST | `/users` | ✅ Implemented |
| `authApi.getUserById()` | GET | `/users/{user_id}` | ✅ Implemented |
| `authApi.getUsers()` | GET | `/users` | ✅ Implemented |
| `authApi.updateUser()` | PUT | `/users/{user_id}` | ✅ Implemented |
| `authApi.resetPassword()` | POST | `/users/{user_id}/reset-password` | ✅ Implemented |
| `authApi.deleteUser()` | DELETE | `/users/{user_id}` | ✅ Implemented |
| `authApi.createRole()` | POST | `/roles` | ✅ Implemented |
| `authApi.getRoleById()` | GET | `/roles/{role_id}` | ✅ Implemented |
| `authApi.getRoles()` | GET | `/roles` | ✅ Implemented |
| `authApi.updateRole()` | PUT | `/roles/{role_id}` | ✅ Implemented |
| `authApi.assignRole()` | POST | `/roles/assign` | ✅ Implemented |

**Implementation:** `src/services/api.ts` - `authApi` object

---

## 2. Credentials Management API ✅

**Service:** `project-service` (via gateway)  
**Status:** ✅ Fully Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `credentialsApi.getCredentials()` | GET | `/api/v1/credentials` | `NEXT_PUBLIC_CREDENTIALS_BASE` | ✅ Implemented |
| `credentialsApi.getCredential()` | GET | `/api/v1/credentials/{credential_id}` | `NEXT_PUBLIC_CREDENTIALS_BY_ID` | ✅ Implemented |
| `credentialsApi.createCredential()` | POST | `/api/v1/credentials` | `NEXT_PUBLIC_CREDENTIALS_BASE` | ✅ Implemented |
| `credentialsApi.updateCredential()` | PUT | `/api/v1/credentials/{credential_id}` | `NEXT_PUBLIC_CREDENTIALS_BY_ID` | ✅ Implemented |
| `credentialsApi.deleteCredential()` | DELETE | `/api/v1/credentials/{credential_id}` | `NEXT_PUBLIC_CREDENTIALS_BY_ID` | ✅ Implemented |

**Implementation:** `src/services/api.ts` - `credentialsApi` object

**Types:**
- `Credential` - Credential interface
- `CredentialResponse` - Paginated credential response

**Usage:**
- Used in ECS creation page for selecting credentials (AK/SK)
- Used in Credentials Management page for CRUD operations

---

## 3. Customer Management API ✅

**Service:** `project-service` (via gateway)  
**Status:** ✅ Fully Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `customersApi.getCustomers()` | GET | `/api/v1/customers` | `NEXT_PUBLIC_CUSTOMERS_BASE` | ✅ Implemented |
| `customersApi.getCustomer()` | GET | `/api/v1/customers/{customer_id}` | `NEXT_PUBLIC_CUSTOMERS_BY_ID` | ✅ Implemented |
| `customersApi.createCustomer()` | POST | `/api/v1/customers` | `NEXT_PUBLIC_CUSTOMERS_BASE` | ✅ Implemented |
| `customersApi.updateCustomer()` | PUT | `/api/v1/customers/{customer_id}` | `NEXT_PUBLIC_CUSTOMERS_BY_ID` | ✅ Implemented |
| `customersApi.deleteCustomer()` | DELETE | `/api/v1/customers/{customer_id}` | `NEXT_PUBLIC_CUSTOMERS_BY_ID` | ✅ Implemented |

**Implementation:** `src/services/api.ts` - `customersApi` object

**Types:**
- `Customer` - Customer interface
- `CustomerResponse` - Paginated customer response

**Usage:**
- Used in Credentials Management page for customer selection
- Used in ECS creation page for customer selection

---

## 4. Vendor/Provider Management API ✅

**Service:** `project-service` (via gateway)  
**Status:** ✅ Fully Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `vendorsApi.getVendors()` | GET | `/api/v1/vendors` | `NEXT_PUBLIC_VENDORS_BASE` | ✅ Implemented |
| `vendorsApi.getVendor()` | GET | `/api/v1/vendors/{vendor_id}` | `NEXT_PUBLIC_VENDORS_BY_ID` | ✅ Implemented |
| `vendorsApi.createVendor()` | POST | `/api/v1/vendors` | `NEXT_PUBLIC_VENDORS_BASE` | ✅ Implemented |
| `vendorsApi.updateVendor()` | PUT | `/api/v1/vendors/{vendor_id}` | `NEXT_PUBLIC_VENDORS_BY_ID` | ✅ Implemented |
| `vendorsApi.deleteVendor()` | DELETE | `/api/v1/vendors/{vendor_id}` | `NEXT_PUBLIC_VENDORS_BY_ID` | ✅ Implemented |

**Implementation:** `src/services/api.ts` - `vendorsApi` object

**Types:**
- `Vendor` - Vendor/Provider interface
- `VendorResponse` - Paginated vendor response

**Usage:**
- Used in Credentials Management page for provider selection
- Used in ECS creation page for provider selection

**Note:** Gateway route currently only allows GET for `/api/v1/vendors/**`. POST, PUT, DELETE methods may need to be added to gateway configuration if not already present.

---

## 5. Project Management API ⚠️

**Service:** `project-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getProjects()` | GET | `/api/v1/projects` | `NEXT_PUBLIC_PROJECTS_BASE` | ⚠️ TODO |
| `getProject()` | GET | `/api/v1/projects/{project_id}` | `NEXT_PUBLIC_PROJECTS_BY_ID` | ⚠️ TODO |
| `createProject()` | POST | `/api/v1/projects` | `NEXT_PUBLIC_PROJECTS_BASE` | ⚠️ TODO |
| `updateProject()` | PUT | `/api/v1/projects/{project_id}` | `NEXT_PUBLIC_PROJECTS_BY_ID` | ⚠️ TODO |
| `deleteProject()` | DELETE | `/api/v1/projects/{project_id}` | `NEXT_PUBLIC_PROJECTS_BY_ID` | ⚠️ TODO |

**Current Status:** Currently uses static/default data in `ProjectContext`

**Next Steps:**
- Add `projectsApi` object to `src/services/api.ts`
- Replace static data in `src/contexts/ProjectContext.tsx` with API calls

---

## 6. ECS Management API ⚠️

**Service:** `ecs-service` (via gateway)  
**Status:** ⚠️ Partially Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `createECSServer()` | POST | `/ecs` | `NEXT_PUBLIC_ECS_CREATE` | ⚠️ TODO - Placeholder |
| `getECSInstances()` | GET | `/ecs` | `NEXT_PUBLIC_ECS_BASE` | ⚠️ TODO |
| `getECSInstance()` | GET | `/ecs/{ecs_id}` | `NEXT_PUBLIC_ECS_BY_ID` | ⚠️ TODO |
| `updateECSInstance()` | PUT | `/ecs/{ecs_id}` | `NEXT_PUBLIC_ECS_BY_ID` | ⚠️ TODO |
| `deleteECSInstance()` | DELETE | `/ecs/{ecs_id}` | `NEXT_PUBLIC_ECS_BY_ID` | ⚠️ TODO |
| `dryRunECS()` | POST | `/ecs/dry-run` | `NEXT_PUBLIC_ECS_BASE` | ⚠️ TODO |

**Current Status:**
- Form submission hook exists but uses placeholder
- Mapper function `serverFormToApi()` is implemented
- Credential selection integrated

**Next Steps:**
- Add `ecsApi` object to `src/services/api.ts`
- Replace placeholder in `src/app/servers/create/hooks/useServerSubmit.ts` with actual API call
- Implement ECS list, get, update, delete functions

---

## 7. Region & Availability Zone API ⚠️

**Service:** `project-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getRegions()` | GET | `/api/v1/regions` | `NEXT_PUBLIC_REGIONS_BASE` | ⚠️ TODO |
| `getAvailabilityZones()` | GET | `/api/v1/regions/{region}/availability-zones` | `NEXT_PUBLIC_REGIONS_AVAILABILITY_ZONES` | ⚠️ TODO |

**Current Status:** Currently loads from `ProjectContext.project.regionScope`

**Next Steps:**
- Add `regionsApi` object to `src/services/api.ts`
- Update `RegionSelector` and `AZSelector` components to use API calls

---

## 8. Network Configuration API ⚠️

**Service:** `project-service` or `network-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getVPCs()` | GET | `/api/v1/vpcs` | (to be configured) | ⚠️ TODO |
| `getSubnets()` | GET | `/api/v1/subnets` | (to be configured) | ⚠️ TODO |

**Next Steps:**
- Add routes to `next.config.js`
- Add routes to `gateway-service/config/routes.yaml`
- Add `networkApi` object to `src/services/api.ts`
- Update `VPCSelector` and `SubnetSelector` components

---

## 9. Compute Configuration API ⚠️

**Service:** `project-service` or `compute-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getFlavors()` | GET | `/api/v1/flavors` | (to be configured) | ⚠️ TODO |
| `getImages()` | GET | `/api/v1/images` | (to be configured) | ⚠️ TODO |

**Next Steps:**
- Add routes to `next.config.js`
- Add routes to `gateway-service/config/routes.yaml`
- Add `computeApi` object to `src/services/api.ts`
- Update `FlavorSelector` and `ImageSelector` components

---

## 10. Permissions API ⚠️

**Service:** `project-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getPermissions()` | GET | `/api/v1/permissions` | `NEXT_PUBLIC_PERMISSIONS_BASE` | ⚠️ TODO |
| `createPermission()` | POST | `/api/v1/permissions` | `NEXT_PUBLIC_PERMISSIONS_BASE` | ⚠️ TODO |
| `updatePermission()` | PUT | `/api/v1/permissions/{permission_id}` | (to be configured) | ⚠️ TODO |
| `deletePermission()` | DELETE | `/api/v1/permissions/{permission_id}` | (to be configured) | ⚠️ TODO |

**Next Steps:**
- Add `permissionsApi` object to `src/services/api.ts`

---

## 11. Audit Logs API ⚠️

**Service:** `project-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getAuditLogs()` | GET | `/api/v1/audit` | `NEXT_PUBLIC_AUDIT_BASE` | ⚠️ TODO |

**Next Steps:**
- Add `auditApi` object to `src/services/api.ts`

---

## 12. Dashboard API ⚠️

**Service:** `dashboard-service` (via gateway)  
**Status:** ⚠️ TODO - Not Implemented

### Endpoints:

| Function | Method | Endpoint | Route Config | Status |
|----------|--------|----------|--------------|--------|
| `getDashboardData()` | GET | `/dashboard` | `NEXT_PUBLIC_DASHBOARD_BASE` | ⚠️ TODO |

**Next Steps:**
- Add `dashboardApi` object to `src/services/api.ts`
- Update dashboard page to use API calls

---

## Implementation Summary

### ✅ Fully Implemented (24 functions):
- **Authentication API:** 14 functions
- **Credentials API:** 5 functions
- **Customer API:** 5 functions
- **Vendor/Provider API:** 5 functions

### ⚠️ TODO / Not Implemented (30+ functions):
- **Project API:** 5 functions
- **ECS API:** 6 functions
- **Region/AZ API:** 2 functions
- **Network API:** 2 functions
- **Compute API:** 2 functions
- **Permissions API:** 4 functions
- **Audit API:** 1 function
- **Dashboard API:** 1 function

---

## Next Steps

### Priority 1: Complete Core Functionality
1. **ECS API Integration**
   - Implement `ecsApi` in `src/services/api.ts`
   - Replace placeholder in `useServerSubmit.ts` with actual API call
   - Implement ECS list, get, update, delete functions

2. **Project API Integration**
   - Implement `projectsApi` in `src/services/api.ts`
   - Update `ProjectContext.tsx` to use API calls instead of static data

### Priority 2: Complete Form Dependencies
3. **Region & Availability Zone API**
   - Implement `regionsApi` in `src/services/api.ts`
   - Update `RegionSelector` and `AZSelector` components

4. **Network API**
   - Add routes to `next.config.js` and gateway config
   - Implement `networkApi` in `src/services/api.ts`
   - Update `VPCSelector` and `SubnetSelector` components

5. **Compute API**
   - Add routes to `next.config.js` and gateway config
   - Implement `computeApi` in `src/services/api.ts`
   - Update `FlavorSelector` and `ImageSelector` components

### Priority 3: Additional Features
6. **Permissions API**
   - Implement `permissionsApi` in `src/services/api.ts`

7. **Audit API**
   - Implement `auditApi` in `src/services/api.ts`

8. **Dashboard API**
   - Implement `dashboardApi` in `src/services/api.ts`
   - Update dashboard page

---

## Gateway Service Configuration

**Gateway Routes File:** `gateway-service/config/routes.yaml`

### Current Routes:
- ✅ `/api/v1/customers/**` → `project-service` (GET, POST, PUT, DELETE, PATCH)
- ✅ `/api/v1/credentials/**` → `project-service` (GET, POST, PUT, DELETE, PATCH)
- ⚠️ `/api/v1/vendors/**` → `project-service` (GET only - may need POST, PUT, DELETE)
- ✅ `/api/v1/projects/**` → `project-service` (GET, POST, PUT, DELETE, PATCH)
- ✅ `/ecs` → `ecs-service` (GET, POST)
- ✅ `/ecs/{ecs_id}` → `ecs-service` (GET, PUT, DELETE)
- ✅ `/auth/**` → `auth-service`
- ⚠️ `/api/v1/regions/**` → (to be configured)
- ⚠️ `/api/v1/vpcs/**` → (to be configured)
- ⚠️ `/api/v1/subnets/**` → (to be configured)
- ⚠️ `/api/v1/flavors/**` → (to be configured)
- ⚠️ `/api/v1/images/**` → (to be configured)
- ✅ `/api/v1/permissions/**` → `project-service` (GET, POST, PUT, DELETE)
- ✅ `/api/v1/audit/**` → `project-service` (GET)
- ✅ `/dashboard` → `dashboard-service`

---

## Notes

1. **Single API File:** All API functions are consolidated in `src/services/api.ts`
2. **Environment Variables:** All endpoints use environment variables from `next.config.js`
3. **Authentication:** All authenticated endpoints automatically include JWT token via `apiClient`
4. **Error Handling:** Consistent error handling across all API calls
5. **Type Safety:** All API functions have TypeScript interfaces defined

---

**Last Updated:** 2024-01-04  
**Maintained By:** Frontend Team

