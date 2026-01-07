# Functions with API Integration Requirements

This document summarizes all functions in the frontend application that require backend API integration through the gateway-service. All API endpoints are configured in `next.config.js` as environment variables.

## Configuration Entry Point

**File:** `next.config.js`

All gateway-service API configuration is centralized in this file. All API service functions should read from these environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for gateway service (default: `http://localhost:8001`)
- Route paths: All endpoint paths are defined as environment variables

---

## 1. Authentication API Functions

**File:** `src/services/authApi.ts`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`authApi.login(credentials)`**
   - **Endpoint:** `POST /auth/login`
   - **Route Config:** `NEXT_PUBLIC_AUTH_LOGIN`
   - **Status:** ✅ Implemented
   - **Description:** User login with username/email and password

2. **`authApi.refreshToken(refreshToken)`**
   - **Endpoint:** `POST /auth/refresh`
   - **Route Config:** `NEXT_PUBLIC_AUTH_REFRESH`
   - **Status:** ✅ Implemented
   - **Description:** Refresh access token using refresh token

3. **`authApi.verifyToken()`**
   - **Endpoint:** `GET /auth/verify`
   - **Route Config:** `NEXT_PUBLIC_AUTH_VERIFY`
   - **Status:** ✅ Implemented
   - **Description:** Verify token validity and get user info

4. **`authApi.createUser(userData)`**
   - **Endpoint:** `POST /users`
   - **Route Config:** `NEXT_PUBLIC_USERS_BASE`
   - **Status:** ✅ Implemented
   - **Description:** Create new user account

5. **`authApi.getUserById(userId)`**
   - **Endpoint:** `GET /users/{user_id}`
   - **Route Config:** `NEXT_PUBLIC_USERS_BY_ID`
   - **Status:** ✅ Implemented
   - **Description:** Get user details by ID

6. **`authApi.getUsers(params)`**
   - **Endpoint:** `GET /users`
   - **Route Config:** `NEXT_PUBLIC_USERS_BASE`
   - **Status:** ✅ Implemented
   - **Description:** Get paginated list of users

7. **`authApi.updateUser(userId, userData)`**
   - **Endpoint:** `PUT /users/{user_id}`
   - **Route Config:** `NEXT_PUBLIC_USERS_BY_ID`
   - **Status:** ✅ Implemented
   - **Description:** Update user information

8. **`authApi.resetPassword(userId, oldPassword, newPassword)`**
   - **Endpoint:** `POST /users/{user_id}/reset-password`
   - **Route Config:** `NEXT_PUBLIC_USERS_RESET_PASSWORD`
   - **Status:** ✅ Implemented
   - **Description:** Reset user password

9. **`authApi.deleteUser(userId)`**
   - **Endpoint:** `DELETE /users/{user_id}`
   - **Route Config:** `NEXT_PUBLIC_USERS_BY_ID`
   - **Status:** ✅ Implemented
   - **Description:** Delete user (soft delete)

10. **`authApi.createRole(roleData)`**
    - **Endpoint:** `POST /roles`
    - **Route Config:** `NEXT_PUBLIC_ROLES_BASE`
    - **Status:** ✅ Implemented
    - **Description:** Create new role

11. **`authApi.getRoleById(roleId)`**
    - **Endpoint:** `GET /roles/{role_id}`
    - **Route Config:** `NEXT_PUBLIC_ROLES_BY_ID`
    - **Status:** ✅ Implemented
    - **Description:** Get role details by ID

12. **`authApi.getRoles(params)`**
    - **Endpoint:** `GET /roles`
    - **Route Config:** `NEXT_PUBLIC_ROLES_BASE`
    - **Status:** ✅ Implemented
    - **Description:** Get paginated list of roles

13. **`authApi.updateRole(roleId, roleData)`**
    - **Endpoint:** `PUT /roles/{role_id}`
    - **Route Config:** `NEXT_PUBLIC_ROLES_BY_ID`
    - **Status:** ✅ Implemented
    - **Description:** Update role information

14. **`authApi.assignRole(userId, roleId)`**
    - **Endpoint:** `POST /roles/assign`
    - **Route Config:** `NEXT_PUBLIC_ROLES_ASSIGN`
    - **Status:** ✅ Implemented
    - **Description:** Assign role to user

---

## 2. Generic API Client

**File:** `src/services/api.ts`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`apiClient.get<T>(url, params)`**
   - **Status:** ✅ Implemented
   - **Description:** Generic GET request with authentication

2. **`apiClient.post<T>(url, data)`**
   - **Status:** ✅ Implemented
   - **Description:** Generic POST request with authentication

3. **`apiClient.put<T>(url, data)`**
   - **Status:** ✅ Implemented
   - **Description:** Generic PUT request with authentication

4. **`apiClient.delete<T>(url)`**
   - **Status:** ✅ Implemented
   - **Description:** Generic DELETE request with authentication

---

## 3. ECS Server Creation Functions

**File:** `src/app/servers/create/hooks/useServerSubmit.ts`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`useServerSubmit().submit(formData)`**
   - **Endpoint:** `POST /ecs`
   - **Route Config:** `NEXT_PUBLIC_ECS_CREATE`
   - **Status:** ⚠️ TODO - Placeholder implementation exists
   - **Description:** Submit ECS server creation form
   - **Current Implementation:** Placeholder with setTimeout
   - **Required:** Replace with actual API call to gateway-service
   - **Data Mapping:** Uses `serverFormToApi(formData)` from `src/mappers/serverFormToApi.ts`

---

## 4. ECS Server List Functions

**File:** `src/app/resources/ecs/page.tsx`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **Get ECS Instances List**
   - **Endpoint:** `GET /ecs`
   - **Route Config:** `NEXT_PUBLIC_ECS_BASE`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Fetch list of ECS instances
   - **Required:** Implement API call to fetch ECS instances

2. **Get ECS Instance by ID**
   - **Endpoint:** `GET /ecs/{ecs_id}`
   - **Route Config:** `NEXT_PUBLIC_ECS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Fetch single ECS instance details

3. **Update ECS Instance**
   - **Endpoint:** `PUT /ecs/{ecs_id}`
   - **Route Config:** `NEXT_PUBLIC_ECS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Update ECS instance configuration

4. **Delete ECS Instance**
   - **Endpoint:** `DELETE /ecs/{ecs_id}`
   - **Route Config:** `NEXT_PUBLIC_ECS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Delete ECS instance

---

## 5. Credentials Management Functions

**File:** `src/app/credentials/page.tsx` (to be created: `src/services/credentialsApi.ts`)

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getCredentials(filters?)`**
   - **Endpoint:** `GET /api/v1/credentials`
   - **Route Config:** `NEXT_PUBLIC_CREDENTIALS_BASE`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Get all credentials (with optional customer/provider filters)
   - **Required:** Replace localStorage with API call

2. **`getCredential(id)`**
   - **Endpoint:** `GET /api/v1/credentials/{credential_id}`
   - **Route Config:** `NEXT_PUBLIC_CREDENTIALS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get credential by ID

3. **`createCredential(data)`**
   - **Endpoint:** `POST /api/v1/credentials`
   - **Route Config:** `NEXT_PUBLIC_CREDENTIALS_BASE`
   - **Status:** ⚠️ TODO - Currently uses local state
   - **Description:** Create new credential
   - **Required:** Replace local state handler with API call

4. **`updateCredential(id, data)`**
   - **Endpoint:** `PUT /api/v1/credentials/{credential_id}`
   - **Route Config:** `NEXT_PUBLIC_CREDENTIALS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Update existing credential

5. **`deleteCredential(id)`**
   - **Endpoint:** `DELETE /api/v1/credentials/{credential_id}`
   - **Route Config:** `NEXT_PUBLIC_CREDENTIALS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses local state
   - **Description:** Delete credential
   - **Required:** Replace local state handler with API call

---

## 6. Customer Management Functions

**File:** `src/components/credentials/CustomerSelector.tsx` (to be created: `src/services/credentialsApi.ts`)

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getCustomers()`**
   - **Endpoint:** `GET /api/v1/customers`
   - **Route Config:** `NEXT_PUBLIC_CUSTOMERS_BASE`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Get list of all customers
   - **Required:** Replace localStorage with API call

2. **`createCustomer(name)`**
   - **Endpoint:** `POST /api/v1/customers`
   - **Route Config:** `NEXT_PUBLIC_CUSTOMERS_BASE`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Create new customer
   - **Required:** Replace localStorage with API call

3. **`updateCustomer(id, name)`**
   - **Endpoint:** `PUT /api/v1/customers/{customer_id}`
   - **Route Config:** `NEXT_PUBLIC_CUSTOMERS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Update customer name
   - **Required:** Replace localStorage with API call

4. **`deleteCustomer(id)`**
   - **Endpoint:** `DELETE /api/v1/customers/{customer_id}`
   - **Route Config:** `NEXT_PUBLIC_CUSTOMERS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Delete customer
   - **Required:** Replace localStorage with API call

---

## 7. Provider Management Functions

**File:** `src/components/credentials/ProviderSelector.tsx` (to be created: `src/services/credentialsApi.ts`)

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getProviders()`**
   - **Endpoint:** `GET /api/v1/vendors`
   - **Route Config:** `NEXT_PUBLIC_VENDORS_BASE`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Get list of all cloud providers/vendors
   - **Required:** Replace localStorage with API call

2. **`createProvider(name)`**
   - **Endpoint:** `POST /api/v1/vendors` (or `/api/v1/providers` if exists)
   - **Route Config:** `NEXT_PUBLIC_VENDORS_BASE`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Create new provider
   - **Required:** Replace localStorage with API call

3. **`updateProvider(id, name)`**
   - **Endpoint:** `PUT /api/v1/vendors/{vendor_id}`
   - **Route Config:** `NEXT_PUBLIC_VENDORS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Update provider name
   - **Required:** Replace localStorage with API call

4. **`deleteProvider(id)`**
   - **Endpoint:** `DELETE /api/v1/vendors/{vendor_id}`
   - **Route Config:** `NEXT_PUBLIC_VENDORS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses localStorage
   - **Description:** Delete provider
   - **Required:** Replace localStorage with API call

---

## 8. Project Management Functions

**File:** `src/contexts/ProjectContext.tsx` (to be created: `src/services/projectApi.ts`)

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getProject(projectId)`**
   - **Endpoint:** `GET /api/v1/projects/{project_id}`
   - **Route Config:** `NEXT_PUBLIC_PROJECTS_BY_ID`
   - **Status:** ⚠️ TODO - Currently uses static/default data
   - **Description:** Get project details including region scope and quota
   - **Required:** Replace static data with API call

2. **`getProjects(params?)`**
   - **Endpoint:** `GET /api/v1/projects`
   - **Route Config:** `NEXT_PUBLIC_PROJECTS_BASE`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get list of projects

3. **`updateProject(projectId, data)`**
   - **Endpoint:** `PUT /api/v1/projects/{project_id}`
   - **Route Config:** `NEXT_PUBLIC_PROJECTS_BY_ID`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Update project configuration

---

## 9. Region & Availability Zone Functions

**Files:** 
- `src/components/server-form/sections/BasicInfoSection/RegionSelector.tsx`
- `src/components/server-form/sections/BasicInfoSection/AZSelector.tsx`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getRegions()`**
   - **Endpoint:** `GET /api/v1/regions`
   - **Route Config:** `NEXT_PUBLIC_REGIONS_BASE`
   - **Status:** ⚠️ TODO - Currently uses ProjectContext.project.regionScope
   - **Description:** Get list of available regions
   - **Note:** Currently loaded from project context, may need direct API call

2. **`getAvailabilityZones(region)`**
   - **Endpoint:** `GET /api/v1/regions/{region}/availability-zones`
   - **Route Config:** `NEXT_PUBLIC_REGIONS_AVAILABILITY_ZONES`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get availability zones for a specific region
   - **Required:** Implement API call when region is selected

---

## 10. Network Configuration Functions

**Files:**
- `src/components/server-form/sections/NetworkSection/VPCSelector.tsx`
- `src/components/server-form/sections/NetworkSection/SubnetSelector.tsx`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getVPCs(region, availabilityZone)`**
   - **Endpoint:** `GET /api/v1/vpcs` (to be configured in gateway)
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get VPCs for a specific region and availability zone
   - **Required:** Implement API call with region/AZ filters

2. **`getSubnets(vpcId)`**
   - **Endpoint:** `GET /api/v1/subnets` (to be configured in gateway)
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get subnets for a specific VPC
   - **Required:** Implement API call with VPC ID filter

---

## 11. Compute Configuration Functions

**Files:**
- `src/components/server-form/sections/ComputeImageSection/FlavorSelector.tsx`
- `src/components/server-form/sections/ComputeImageSection/ImageSelector.tsx`

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getFlavors(region, availabilityZone)`**
   - **Endpoint:** `GET /api/v1/flavors` (to be configured in gateway)
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get available instance flavors/flavors for region/AZ
   - **Required:** Implement API call with region/AZ filters

2. **`getImages(region)`**
   - **Endpoint:** `GET /api/v1/images` (to be configured in gateway)
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get available OS images for a region
   - **Required:** Implement API call with region filter

---

## 12. Dashboard Functions

**File:** `src/app/page.tsx` (or dashboard component)

**Base URL:** Uses `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`

### Functions:

1. **`getDashboardData()`**
   - **Endpoint:** `GET /dashboard`
   - **Route Config:** `NEXT_PUBLIC_DASHBOARD_BASE`
   - **Status:** ⚠️ TODO - Not implemented
   - **Description:** Get dashboard statistics and overview data
   - **Required:** Implement API call to fetch dashboard data

---

## Summary Statistics

### Implementation Status:

- ✅ **Fully Implemented:** 14 functions (Auth API - all functions)
- ⚠️ **Partially Implemented / TODO:** 35+ functions
  - ECS Server Creation: 1 function (placeholder)
  - ECS Server Management: 4 functions
  - Credentials Management: 5 functions
  - Customer Management: 4 functions
  - Provider Management: 4 functions
  - Project Management: 3 functions
  - Region/AZ: 2 functions
  - Network: 2 functions
  - Compute: 2 functions
  - Dashboard: 1 function

### Key Points:

1. **Configuration:** All API endpoints are configured in `next.config.js`
2. **Base URL:** All services use `NEXT_PUBLIC_API_BASE_URL` from `next.config.js`
3. **Authentication:** All API calls should include JWT token from `localStorage.getItem('auth-token')`
4. **Gateway Routes:** All routes are configured in `gateway-service/config/routes.yaml`
5. **No Function Modifications:** Existing functions should NOT be modified - only API integration points need to be connected

---

## Next Steps for Backend Integration:

1. **Verify Gateway Routes:** Ensure all routes in `gateway-service/config/routes.yaml` match the endpoints listed above
2. **Create API Service Files:** 
   - `src/services/credentialsApi.ts` (for credentials, customers, providers)
   - `src/services/projectApi.ts` (for projects)
   - `src/services/ecsApi.ts` (for ECS operations)
   - `src/services/networkApi.ts` (for VPCs, subnets)
   - `src/services/computeApi.ts` (for flavors, images)
3. **Update Components:** Replace localStorage/static data with API calls (without modifying existing function logic)
4. **Error Handling:** Implement consistent error handling across all API calls
5. **Loading States:** Add loading indicators for async operations

---

## Notes:

- All API functions should read configuration from `next.config.js` environment variables
- Do NOT hardcode API endpoints - always use environment variables
- All API calls should go through the gateway-service (port 8001 by default)
- Authentication tokens are stored in localStorage with keys defined in `next.config.js`
- Gateway service routes are configured in `gateway-service/config/routes.yaml`

