# Credentials Management - Backend Integration Documentation

## Overview

This document describes the Credentials Management feature and the required backend API integration for connecting the frontend to the gateway-api service. The Credentials Management system allows users to manage cloud provider credentials (Access Key / Secret Key) for different customers and providers.

## Current Frontend Implementation

### Components Structure

1. **CustomerSelector** (`src/components/credentials/CustomerSelector.tsx`)
   - Manages customer selection, addition, editing, and removal
   - Currently uses `localStorage` for persistence
   - Default customer: "Ekin"

2. **ProviderSelector** (`src/components/credentials/ProviderSelector.tsx`)
   - Manages cloud provider selection, addition, editing, and removal
   - Currently uses `localStorage` for persistence
   - Default provider: "Huawei"

3. **CredentialForm** (`src/components/credentials/CredentialForm.tsx`)
   - Form for entering Access Key (AK) and Secret Key (SK)
   - Includes validation and show/hide toggle for secret key

4. **CredentialList** (`src/components/credentials/CredentialList.tsx`)
   - Displays list of saved credentials with masked values
   - Supports copy-to-clipboard and delete functionality

5. **CredentialsPage** (`src/app/credentials/page.tsx`)
   - Main page that integrates all components
   - Manages state for selected customer, provider, and credentials list

### Data Structures

#### Credential Interface

```typescript
export interface Credential {
  id: string;                    // Unique identifier (e.g., "cred-1234567890")
  customer: string;              // Customer name (e.g., "Ekin")
  provider: string;              // Cloud provider name (e.g., "Huawei")
  accessKey: string;             // Access Key (AK) - plain text
  secretKey: string;             // Secret Key (SK) - plain text
  createdAt: string;             // ISO 8601 timestamp (e.g., "2024-01-15T10:30:00.000Z")
  updatedAt: string;             // ISO 8601 timestamp (e.g., "2024-01-15T10:30:00.000Z")
}
```

#### Customer Data

- Type: `string[]`
- Storage: Currently `localStorage` with key `credentials_customers`
- Default: `['Ekin']`

#### Provider Data

- Type: `string[]`
- Storage: Currently `localStorage` with key `credentials_providers`
- Default: `['Huawei']`

## Gateway API Route Configuration

The gateway service already has a route configured for credentials:

```yaml
- path: /api/v1/credentials/**
  service: project-service
  methods: [GET, POST, PUT, DELETE, PATCH]
  auth_required: true
  rate_limit: 100
  timeout: 30
  strip_prefix: false
```

**Route Details:**
- Base Path: `/api/v1/credentials`
- Target Service: `project-service`
- Authentication: Required (`auth_required: true`)
- Rate Limit: 100 requests
- Timeout: 30 seconds

## Required Backend API Endpoints

### 1. Get All Credentials

**Endpoint:** `GET /api/v1/credentials`

**Description:** Retrieve all credentials for the authenticated user/tenant.

**Query Parameters (Optional):**
- `customer` (string): Filter by customer name
- `provider` (string): Filter by provider name
- `page` (integer): Page number for pagination (default: 1)
- `page_size` (integer): Number of items per page (default: 20)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "cred-1234567890",
      "customer": "Ekin",
      "provider": "Huawei",
      "access_key": "AKIAIOSFODNN7EXAMPLE",
      "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

**Response Fields:**
- `items` (array): List of credential objects
- `total` (integer): Total number of credentials
- `page` (integer): Current page number
- `page_size` (integer): Items per page
- `total_pages` (integer): Total number of pages

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `500 Internal Server Error`: Server error

---

### 2. Get Credential by ID

**Endpoint:** `GET /api/v1/credentials/{credential_id}`

**Description:** Retrieve a specific credential by its ID.

**Path Parameters:**
- `credential_id` (string): Unique identifier of the credential

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "cred-1234567890",
  "customer": "Ekin",
  "provider": "Huawei",
  "access_key": "AKIAIOSFODNN7EXAMPLE",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Credential not found
- `500 Internal Server Error`: Server error

---

### 3. Create Credential

**Endpoint:** `POST /api/v1/credentials`

**Description:** Create a new credential for a customer and provider.

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer": "Ekin",
  "provider": "Huawei",
  "access_key": "AKIAIOSFODNN7EXAMPLE",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}
```

**Request Fields:**
- `customer` (string, required): Customer name
- `provider` (string, required): Cloud provider name
- `access_key` (string, required): Access Key (AK)
- `secret_key` (string, required): Secret Key (SK)

**Response (201 Created):**
```json
{
  "id": "cred-1234567890",
  "customer": "Ekin",
  "provider": "Huawei",
  "access_key": "AKIAIOSFODNN7EXAMPLE",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data (missing required fields, validation errors)
- `401 Unauthorized`: Missing or invalid authentication token
- `409 Conflict`: Credential already exists for this customer/provider combination
- `500 Internal Server Error`: Server error

**Validation Rules:**
- `customer`: Required, non-empty string, max 100 characters
- `provider`: Required, non-empty string, max 100 characters
- `access_key`: Required, non-empty string, max 500 characters
- `secret_key`: Required, non-empty string, max 500 characters

---

### 4. Update Credential

**Endpoint:** `PUT /api/v1/credentials/{credential_id}`

**Description:** Update an existing credential.

**Path Parameters:**
- `credential_id` (string): Unique identifier of the credential

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer": "Ekin",
  "provider": "Huawei",
  "access_key": "AKIAIOSFODNN7EXAMPLE_UPDATED",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY_UPDATED"
}
```

**Request Fields:**
- `customer` (string, optional): Customer name
- `provider` (string, optional): Cloud provider name
- `access_key` (string, optional): Access Key (AK)
- `secret_key` (string, optional): Secret Key (SK)

**Response (200 OK):**
```json
{
  "id": "cred-1234567890",
  "customer": "Ekin",
  "provider": "Huawei",
  "access_key": "AKIAIOSFODNN7EXAMPLE_UPDATED",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY_UPDATED",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T11:45:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Credential not found
- `500 Internal Server Error`: Server error

---

### 5. Delete Credential

**Endpoint:** `DELETE /api/v1/credentials/{credential_id}`

**Description:** Delete a credential by its ID.

**Path Parameters:**
- `credential_id` (string): Unique identifier of the credential

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (204 No Content):**
- Empty response body

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Credential not found
- `500 Internal Server Error`: Server error

---

### 6. Get Customers List

**Endpoint:** `GET /api/v1/customers`

**Description:** Retrieve list of all customers available for credential management.

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "customer-1",
      "name": "Ekin",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

**Note:** This endpoint may already exist in the project-service. If not, it should be created to support customer management.

---

### 7. Create Customer

**Endpoint:** `POST /api/v1/customers`

**Description:** Create a new customer.

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "NewCustomer"
}
```

**Response (201 Created):**
```json
{
  "id": "customer-2",
  "name": "NewCustomer",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

---

### 8. Update Customer

**Endpoint:** `PUT /api/v1/customers/{customer_id}`

**Description:** Update an existing customer.

**Request Body:**
```json
{
  "name": "UpdatedCustomer"
}
```

---

### 9. Delete Customer

**Endpoint:** `DELETE /api/v1/customers/{customer_id}`

**Description:** Delete a customer (should check if credentials exist for this customer).

---

### 10. Get Providers List

**Endpoint:** `GET /api/v1/vendors` or `GET /api/v1/providers`

**Description:** Retrieve list of all cloud providers.

**Note:** The gateway already has a route for `/api/v1/vendors` that routes to `project-service`. This endpoint may already exist.

**Request Headers:**
```
Authorization: Bearer <access_token> (optional, based on route config)
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "provider-1",
      "name": "Huawei",
      "type": "cloud_provider",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## Data Mapping

### Frontend to Backend

| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| `id` | `id` | Generated by backend on creation |
| `customer` | `customer` | String value |
| `provider` | `provider` | String value |
| `accessKey` | `access_key` | Snake case in backend |
| `secretKey` | `secret_key` | Snake case in backend |
| `createdAt` | `created_at` | ISO 8601 timestamp |
| `updatedAt` | `updated_at` | ISO 8601 timestamp |

### Backend to Frontend

| Backend Field | Frontend Field | Notes |
|---------------|----------------|-------|
| `id` | `id` | Direct mapping |
| `customer` | `customer` | Direct mapping |
| `provider` | `provider` | Direct mapping |
| `access_key` | `accessKey` | Convert to camelCase |
| `secret_key` | `secretKey` | Convert to camelCase |
| `created_at` | `createdAt` | ISO 8601 timestamp |
| `updated_at` | `updatedAt` | ISO 8601 timestamp |

## Security Considerations

### 1. Secret Key Encryption
- **Requirement:** Secret keys MUST be encrypted at rest in the database
- **Recommendation:** Use AES-256 encryption or similar industry-standard encryption
- **Key Management:** Store encryption keys securely (e.g., using a key management service)

### 2. Access Control
- **Requirement:** Users should only access credentials they own or have permission to view
- **Implementation:** Backend should filter credentials based on user_id/tenant_id from JWT token
- **Authorization:** Implement proper RBAC checks if multi-tenant support is required

### 3. API Security
- **Authentication:** All endpoints require valid JWT access token (except public endpoints)
- **HTTPS:** All API calls should use HTTPS in production
- **Rate Limiting:** Gateway already configured with rate limits (100 requests per endpoint)

### 4. Data Masking
- **Frontend:** Credentials are masked in the UI (showing only first 4 and last 4 characters)
- **Backend:** Consider masking in API responses if full keys are not needed for certain operations

### 5. Audit Logging
- **Requirement:** Log all credential creation, update, and deletion operations
- **Information to Log:**
  - User ID
  - Action (CREATE, UPDATE, DELETE)
  - Credential ID
  - Customer/Provider
  - Timestamp
  - IP Address

## Frontend Integration Points

### Current Implementation Status

1. **CustomerSelector Component**
   - **Current:** Uses `localStorage` for persistence
   - **Backend Integration Needed:**
     - Replace `localStorage` with API calls to `/api/v1/customers`
     - Implement CRUD operations (GET, POST, PUT, DELETE)

2. **ProviderSelector Component**
   - **Current:** Uses `localStorage` for persistence
   - **Backend Integration Needed:**
     - Replace `localStorage` with API calls to `/api/v1/vendors` or `/api/v1/providers`
     - Implement CRUD operations (GET, POST, PUT, DELETE)

3. **CredentialForm Component**
   - **Current:** Submits to local state handler
   - **Backend Integration Needed:**
     - Replace local state handler with API call to `POST /api/v1/credentials`
     - Add error handling and success notifications

4. **CredentialList Component**
   - **Current:** Displays credentials from local state
   - **Backend Integration Needed:**
     - Replace local state with API call to `GET /api/v1/credentials`
     - Implement filtering by customer and provider
     - Replace local delete with API call to `DELETE /api/v1/credentials/{id}`

5. **CredentialsPage Component**
   - **Current:** Manages all state locally
   - **Backend Integration Needed:**
     - Implement data fetching on component mount
     - Implement real-time updates after CRUD operations
     - Add loading states and error handling

### API Service Implementation Pattern

Based on the existing `authApi.ts` pattern, create a new service file:

**File:** `src/services/credentialsApi.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

class CredentialsApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token interceptor
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  // Implement GET, POST, PUT, DELETE methods
}

export const credentialsApi = {
  // List all credentials
  getCredentials: async (filters?: { customer?: string; provider?: string }) => {
    // Implementation
  },
  
  // Get credential by ID
  getCredential: async (id: string) => {
    // Implementation
  },
  
  // Create credential
  createCredential: async (data: {
    customer: string;
    provider: string;
    access_key: string;
    secret_key: string;
  }) => {
    // Implementation
  },
  
  // Update credential
  updateCredential: async (id: string, data: Partial<{
    customer: string;
    provider: string;
    access_key: string;
    secret_key: string;
  }>) => {
    // Implementation
  },
  
  // Delete credential
  deleteCredential: async (id: string) => {
    // Implementation
  },
  
  // Customer management
  getCustomers: async () => {
    // Implementation
  },
  
  createCustomer: async (name: string) => {
    // Implementation
  },
  
  updateCustomer: async (id: string, name: string) => {
    // Implementation
  },
  
  deleteCustomer: async (id: string) => {
    // Implementation
  },
  
  // Provider management
  getProviders: async () => {
    // Implementation
  },
  
  createProvider: async (name: string) => {
    // Implementation
  },
  
  updateProvider: async (id: string, name: string) => {
    // Implementation
  },
  
  deleteProvider: async (id: string) => {
    // Implementation
  },
};
```

## Error Handling

### Standard Error Response Format

All error responses should follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `CONFLICT`: Resource conflict (e.g., duplicate credential)
- `INTERNAL_ERROR`: Server error

## Testing Requirements

### Unit Tests
- Test credential CRUD operations
- Test customer/provider management
- Test validation rules
- Test error handling

### Integration Tests
- Test API endpoints with gateway
- Test authentication/authorization
- Test data persistence
- Test encryption/decryption

### Security Tests
- Test access control
- Test encryption at rest
- Test API rate limiting
- Test audit logging

## Database Schema Recommendations

### Credentials Table

```sql
CREATE TABLE credentials (
    id VARCHAR(255) PRIMARY KEY,
    customer VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    access_key_encrypted TEXT NOT NULL,
    secret_key_encrypted TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    tenant_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_provider (customer, provider),
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id),
    UNIQUE KEY unique_customer_provider_user (customer, provider, user_id)
);
```

### Customers Table (if not exists)

```sql
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    tenant_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id)
);
```

### Providers Table (if not exists)

```sql
CREATE TABLE providers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) DEFAULT 'cloud_provider',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Migration Plan

### Phase 1: Backend API Development
1. Implement credential CRUD endpoints in `project-service`
2. Implement customer management endpoints (if not exists)
3. Implement provider management endpoints (if not exists)
4. Add encryption for secret keys
5. Add audit logging
6. Write unit and integration tests

### Phase 2: Frontend Integration
1. Create `credentialsApi.ts` service file
2. Update `CustomerSelector` to use API instead of localStorage
3. Update `ProviderSelector` to use API instead of localStorage
4. Update `CredentialForm` to submit to API
5. Update `CredentialList` to fetch from API
6. Update `CredentialsPage` to manage API state
7. Add loading states and error handling
8. Add success/error notifications

### Phase 3: Testing & Deployment
1. End-to-end testing
2. Security audit
3. Performance testing
4. Deploy to staging
5. User acceptance testing
6. Deploy to production

## Notes

1. **Gateway Route:** The route `/api/v1/credentials/**` is already configured in `gateway-service/config/routes.yaml` and routes to `project-service`.

2. **Authentication:** All credential endpoints require authentication. The gateway will validate the JWT token and forward user context to the backend service.

3. **Multi-tenancy:** If the system supports multi-tenancy, ensure that credentials are filtered by `tenant_id` from the JWT token.

4. **Data Migration:** If there are existing credentials in localStorage, create a migration script to import them to the backend database.

5. **Backward Compatibility:** Consider maintaining localStorage as a fallback during the transition period, or provide a one-time migration tool.

## Contact & Support

For questions or issues related to this integration, please refer to:
- Gateway Service: `gateway-service/README.md`
- Project Service: `project-service/README.md`
- Frontend Dashboard: `Dashbaord_Cloud_resource_management_system/README.md`

