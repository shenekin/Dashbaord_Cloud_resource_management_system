# ECS API Interfaces - Filled Fields Summary

This document summarizes all ECS-related API interfaces with filled fields for interaction with the backend gateway-service. All endpoints are accessed through the gateway-service configured in `next.config.js`.

## Base Configuration

**Gateway Service Base URL:** `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8001`)

**Authentication:** All requests require JWT token in `Authorization: Bearer <token>` header. Token is stored in `localStorage.getItem('auth-token')`.

---

## 1. Create ECS Server

**Endpoint:** `POST /ecs`  
**Route Config:** `NEXT_PUBLIC_ECS_CREATE`  
**Service:** `ecs-service` (via gateway)

### Request Body

```typescript
interface CreateECSServerRequest {
  // Basic Information
  region: string;                    // Required: Deployment region (e.g., "cn-north-1")
  availability_zone: string;         // Required: Availability zone (e.g., "cn-north-1-az-1")
  name: string;                      // Required: Server instance name (1-255 chars, alphanumeric + hyphens/underscores)
  count: number;                     // Required: Number of instances to create (min: 1, max: project quota)
  credential_id?: string;            // Optional: Credential ID (AK/SK) for cloud provider authentication
  
  // Compute Configuration
  flavor: string;                    // Required: Instance flavor/specification ID (e.g., "s6.large.2")
  image: string;                     // Required: Operating system image ID (e.g., "Ubuntu 20.04 64bit")
  admin_password: string;           // Required: Administrator password (min 8 chars, uppercase, lowercase, number, special char)
  
  // Storage Configuration
  system_disk: {                    // Required: System disk configuration
    type: string;                   // Required: Disk type - Enum: ['SSD', 'SAS', 'SATA']
    size: number;                    // Required: Disk size in GB (min: 40, max: 1024)
  };
  data_disks?: Array<{              // Optional: Data disks array
    type: string;                   // Required: Disk type - Enum: ['SSD', 'SAS', 'SATA']
    size: number;                    // Required: Disk size in GB (min: 10, max: 32768)
  }>;
  
  // Network Configuration
  vpc_id: string;                    // Required: Virtual Private Cloud ID
  subnet_id: string;                 // Required: Subnet ID within selected VPC
  private_ip?: string;               // Optional: Specific private IP address (must be within subnet CIDR)
  enable_ipv6: boolean;              // Required: Enable IPv6 addressing (default: false)
  public_ip?: {                      // Optional: Public IP configuration
    eip_type: string;                // Required if public_ip provided: Elastic IP type - Enum: ['5_bgp', '5_sbgp']
    bandwidth_type: string;          // Required if public_ip provided: Bandwidth type - Enum: ['5_bgp', '5_sbgp']
    bandwidth_size: number;          // Required if public_ip provided: Bandwidth size in Mbps (min: 1, max: 2000)
  };
  
  // Billing & Lifecycle
  charging_mode: string;             // Required: Payment mode - Enum: ['postPaid', 'prePaid']
  auto_terminate_time?: string;      // Optional: Auto-termination timestamp (ISO 8601 datetime format, future date)
  
  // Advanced Settings
  tags?: Array<{                    // Optional: Resource tags for organization
    key: string;                    // Required: Tag key
    value: string;                  // Required: Tag value
  }>;
}
```

### Response (Success - 200 OK)

```typescript
interface CreateECSServerResponse {
  success: true;
  data: {
    server_ids: string[];           // Array of created server IDs
    job_id: string;                 // Job ID for tracking async creation
    message: string;                // Success message
  };
}
```

### Response (Error - 400 Bad Request)

```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: string;
    details: {
      field: string;                // Field name with validation error
      message: string;               // Error message
    };
  };
}
```

### Response (Error - 403 Forbidden)

```typescript
interface QuotaExceededResponse {
  success: false;
  error: {
    code: "QUOTA_EXCEEDED";
    message: string;
    details: {
      quota_type: string;            // e.g., "instanceCount", "cpu", "memory", "storage"
      requested: number;             // Requested amount
      available: number;              // Available quota
    };
  };
}
```

### Example Request

```json
{
  "region": "cn-north-1",
  "availability_zone": "cn-north-1-az-1",
  "name": "web-server-01",
  "count": 2,
  "credential_id": "cred-1234567890",
  "flavor": "s6.large.2",
  "image": "Ubuntu 20.04 64bit",
  "admin_password": "SecurePass123!",
  "system_disk": {
    "type": "SSD",
    "size": 100
  },
  "data_disks": [
    {
      "type": "SSD",
      "size": 500
    }
  ],
  "vpc_id": "vpc-123456",
  "subnet_id": "subnet-789012",
  "private_ip": "192.168.1.100",
  "enable_ipv6": false,
  "public_ip": {
    "eip_type": "5_bgp",
    "bandwidth_type": "5_bgp",
    "bandwidth_size": 10
  },
  "charging_mode": "postPaid",
  "auto_terminate_time": "2024-12-31T23:59:59Z",
  "tags": [
    {
      "key": "Environment",
      "value": "Production"
    },
    {
      "key": "Team",
      "value": "WebDev"
    }
  ]
}
```

---

## 2. Get ECS Instances List

**Endpoint:** `GET /ecs`  
**Route Config:** `NEXT_PUBLIC_ECS_BASE`  
**Service:** `ecs-service` (via gateway)

### Query Parameters

```typescript
interface GetECSListParams {
  page?: number;                     // Optional: Page number (default: 1)
  page_size?: number;                // Optional: Items per page (default: 20)
  region?: string;                   // Optional: Filter by region
  status?: string;                   // Optional: Filter by status (e.g., "running", "stopped")
  name?: string;                     // Optional: Filter by name (partial match)
}
```

### Response (Success - 200 OK)

```typescript
interface GetECSListResponse {
  success: true;
  data: {
    items: Array<{
      id: string;                    // ECS instance ID
      name: string;                  // Instance name
      region: string;                // Deployment region
      availability_zone: string;     // Availability zone
      flavor: string;                 // Instance flavor
      image: string;                 // OS image
      status: string;                // Instance status (e.g., "running", "stopped", "creating")
      private_ip?: string;           // Private IP address
      public_ip?: string;            // Public IP address
      created_at: string;            // Creation timestamp (ISO 8601)
      updated_at: string;            // Last update timestamp (ISO 8601)
      tags?: Array<{                 // Resource tags
        key: string;
        value: string;
      }>;
    }>;
    total: number;                   // Total number of instances
    page: number;                   // Current page number
    page_size: number;              // Items per page
    total_pages: number;            // Total number of pages
  };
}
```

---

## 3. Get ECS Instance by ID

**Endpoint:** `GET /ecs/{ecs_id}`  
**Route Config:** `NEXT_PUBLIC_ECS_BY_ID`  
**Service:** `ecs-service` (via gateway)

### Path Parameters

- `ecs_id` (string, required): ECS instance ID

### Response (Success - 200 OK)

```typescript
interface GetECSInstanceResponse {
  success: true;
  data: {
    id: string;                      // ECS instance ID
    name: string;                    // Instance name
    region: string;                  // Deployment region
    availability_zone: string;       // Availability zone
    flavor: string;                  // Instance flavor
    image: string;                   // OS image
    status: string;                  // Instance status
    system_disk: {                   // System disk information
      type: string;
      size: number;
    };
    data_disks?: Array<{             // Data disks information
      id: string;
      type: string;
      size: number;
    }>;
    network: {                       // Network configuration
      vpc_id: string;
      subnet_id: string;
      private_ip?: string;
      public_ip?: string;
      enable_ipv6: boolean;
    };
    billing: {                       // Billing information
      charging_mode: string;
      auto_terminate_time?: string;
    };
    tags?: Array<{                   // Resource tags
      key: string;
      value: string;
    }>;
    created_at: string;             // Creation timestamp
    updated_at: string;              // Last update timestamp
  };
}
```

### Response (Error - 404 Not Found)

```typescript
interface NotFoundResponse {
  success: false;
  error: {
    code: "NOT_FOUND";
    message: string;
  };
}
```

---

## 4. Update ECS Instance

**Endpoint:** `PUT /ecs/{ecs_id}`  
**Route Config:** `NEXT_PUBLIC_ECS_BY_ID`  
**Service:** `ecs-service` (via gateway)

### Path Parameters

- `ecs_id` (string, required): ECS instance ID

### Request Body

```typescript
interface UpdateECSInstanceRequest {
  name?: string;                     // Optional: Update instance name
  auto_terminate_time?: string;      // Optional: Update auto-termination time (ISO 8601)
  tags?: Array<{                    // Optional: Update tags
    key: string;
    value: string;
  }>;
}
```

**Note:** Not all fields can be updated. Only name, auto_terminate_time, and tags are typically updatable after creation.

### Response (Success - 200 OK)

```typescript
interface UpdateECSInstanceResponse {
  success: true;
  data: {
    id: string;
    message: string;                  // Success message
    updated_at: string;              // Update timestamp
  };
}
```

---

## 5. Delete ECS Instance

**Endpoint:** `DELETE /ecs/{ecs_id}`  
**Route Config:** `NEXT_PUBLIC_ECS_BY_ID`  
**Service:** `ecs-service` (via gateway)

### Path Parameters

- `ecs_id` (string, required): ECS instance ID

### Response (Success - 200 OK)

```typescript
interface DeleteECSInstanceResponse {
  success: true;
  data: {
    message: string;                 // Success message
    job_id?: string;                 // Optional: Job ID for async deletion
  };
}
```

---

## 6. Dry Run Validation

**Endpoint:** `POST /ecs/dry-run`  
**Route Config:** `NEXT_PUBLIC_ECS_BASE` (with `/dry-run` suffix)  
**Service:** `ecs-service` (via gateway)

### Request Body

Same as Create ECS Server request (see section 1).

### Response (Success - 200 OK)

```typescript
interface DryRunResponse {
  success: true;
  data: {
    valid: boolean;                  // Whether the request is valid
    warnings: Array<{               // Array of warnings (non-blocking)
      field?: string;               // Optional: Field name
      message: string;               // Warning message
    }>;
    errors?: Array<{                // Array of errors (blocking) - only if valid is false
      field: string;                // Field name
      message: string;               // Error message
    }>;
    estimated_cost?: {              // Optional: Estimated cost
      monthly: number;              // Monthly cost
      currency: string;             // Currency code (e.g., "USD")
    };
    resource_summary?: {            // Optional: Resource summary
      instances: number;            // Number of instances
      total_cpu: number;            // Total CPU cores
      total_memory: number;         // Total memory in GB
      total_storage: number;         // Total storage in GB
    };
  };
}
```

---

## Field Mapping: Frontend to Backend

| Frontend Field (FormData) | Backend Field (API Request) | Notes |
|---------------------------|----------------------------|-------|
| `basic.region` | `region` | Direct mapping |
| `basic.az` | `availability_zone` | Direct mapping |
| `basic.name` | `name` | Direct mapping |
| `basic.count` | `count` | Direct mapping |
| `basic.credentialId` | `credential_id` | Credential ID for AK/SK authentication |
| `compute.flavor` | `flavor` | Direct mapping |
| `compute.image` | `image` | Direct mapping |
| `compute.adminPassword` | `admin_password` | Snake case conversion |
| `storage.systemDisk.type` | `system_disk.type` | Nested object |
| `storage.systemDisk.size` | `system_disk.size` | Nested object |
| `storage.dataDisks[]` | `data_disks[]` | Array mapping |
| `network.vpc` | `vpc_id` | Field name conversion |
| `network.subnet` | `subnet_id` | Field name conversion |
| `ip.privateIP` | `private_ip` | Optional, snake case |
| `ip.enableIPv6` | `enable_ipv6` | Boolean, snake case |
| `ip.publicIP.eipType` | `public_ip.eip_type` | Optional nested object |
| `ip.publicIP.bandwidthType` | `public_ip.bandwidth_type` | Optional nested object |
| `ip.publicIP.bandwidthSize` | `public_ip.bandwidth_size` | Optional nested object |
| `billing.chargingMode` | `charging_mode` | Snake case conversion |
| `billing.autoTerminateTime` | `auto_terminate_time` | Optional, ISO 8601 format |
| `tags.tags[]` | `tags[]` | Array of {key, value} objects |

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Field validation failed |
| `QUOTA_EXCEEDED` | 403 | Project quota exceeded |
| `INVALID_REGION` | 400 | Region not in project scope |
| `INVALID_AZ` | 400 | Availability zone not valid for region |
| `INVALID_FLAVOR` | 400 | Flavor not available in region/AZ |
| `INVALID_IMAGE` | 400 | Image not available in region/AZ |
| `INVALID_VPC` | 400 | VPC not found or not accessible |
| `INVALID_SUBNET` | 400 | Subnet not found or not in VPC |
| `INVALID_IP` | 400 | Private IP not in subnet range |
| `INVALID_CREDENTIAL` | 400 | Credential ID not found or invalid |
| `AUTHENTICATION_ERROR` | 401 | Invalid or expired token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server internal error |

---

## Implementation Files

### Frontend Mapper

**File:** `src/mappers/serverFormToApi.ts`

- `ServerApiRequest` interface: TypeScript interface for API request
- `serverFormToApi()` function: Maps frontend form data to API request format

### Frontend Types

**File:** `src/types/server.ts`

- `ServerFormData` interface: Frontend form data structure
- `BasicInfo`, `ComputeInfo`, `StorageInfo`, `NetworkInfo`, `IPInfo`, `BillingInfo`, `AdvancedInfo` interfaces

### Frontend API Service

**File:** `src/app/servers/create/hooks/useServerSubmit.ts`

- `useServerSubmit()` hook: Handles form submission and API call
- Uses `serverFormToApi()` to transform form data before sending

### Gateway Configuration

**File:** `gateway-service/config/routes.yaml`

- Route configuration for `/ecs` endpoints
- Routes to `ecs-service` backend service

---

## Authentication Headers

All requests must include:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Optional headers:

```
X-Project-ID: <project_id>          // For project-scoped operations
```

---

## Notes

1. **Credential ID**: The `credential_id` field is used to reference credentials (AK/SK) stored in the Credentials Management system. The backend will retrieve the actual access key and secret key using this ID.

2. **Async Operations**: Server creation and deletion are typically asynchronous operations. The API returns a `job_id` that can be used to track the operation status.

3. **Validation**: All field validations should be performed both on the frontend (for UX) and backend (for security).

4. **Quota Checking**: The backend validates quotas before creating resources. Quota information should be fetched from the Project Service.

5. **Error Handling**: All API errors follow a consistent format with `success: false` and an `error` object containing `code`, `message`, and optional `details`.

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-04  
**Maintained By:** Frontend Team

