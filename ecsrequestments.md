# ECS Server Creation - Backend Requirements

## Overview

This document specifies the requirements for the backend API endpoint that handles Elastic Cloud Server (ECS) instance creation. The frontend form collects user input and submits it in a structured format to the backend gateway service.

## API Endpoint

**Endpoint:** `POST /api/v1/servers/create`

**Base URL:** Configured via `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`)

## Request Format

### Request Body Structure

The frontend sends a JSON payload with the following structure:

```json
{
  "region": "string (required)",
  "availability_zone": "string (required)",
  "name": "string (required)",
  "count": "number (required, min: 1)",
  "flavor": "string (required)",
  "image": "string (required)",
  "admin_password": "string (required)",
  "system_disk": {
    "type": "string (required)",
    "size": "number (required, min: 40, max: 1024)"
  },
  "data_disks": [
    {
      "type": "string (required)",
      "size": "number (required, min: 10, max: 32768)"
    }
  ],
  "vpc_id": "string (required)",
  "subnet_id": "string (required)",
  "private_ip": "string (optional)",
  "enable_ipv6": "boolean (required, default: false)",
  "public_ip": {
    "eip_type": "string (required if public_ip is provided)",
    "bandwidth_type": "string (required if public_ip is provided)",
    "bandwidth_size": "number (required if public_ip is provided)"
  },
  "charging_mode": "string (required, enum: ['postPaid', 'prePaid'])",
  "auto_terminate_time": "string (optional, ISO 8601 datetime format)",
  "tags": [
    {
      "key": "string (required)",
      "value": "string (required)"
    }
  ]
}
```

## Field Specifications

### Basic Information

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `region` | string | Yes | Must be from project's region scope | Deployment region |
| `availability_zone` | string | Yes | Must be valid AZ for selected region | Availability zone within region |
| `name` | string | Yes | 1-255 characters, alphanumeric + hyphens/underscores | Server instance name |
| `count` | number | Yes | Min: 1, Max: project quota | Number of instances to create |

### Compute Configuration

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `flavor` | string | Yes | Must be valid flavor ID for region/AZ | Instance flavor/specification |
| `image` | string | Yes | Must be valid image ID for region/AZ | Operating system image |
| `admin_password` | string | Yes | Min 8 chars, uppercase, lowercase, number, special char | Administrator password |

### Storage Configuration

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `system_disk.type` | string | Yes | Enum: ['SSD', 'SAS', 'SATA'] | System disk type |
| `system_disk.size` | number | Yes | Min: 40, Max: 1024 (GB) | System disk size in GB |
| `data_disks` | array | No | Each disk: type (required), size (10-32768 GB) | Optional data disks |

### Network Configuration

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `vpc_id` | string | Yes | Must be valid VPC ID in region/AZ | Virtual Private Cloud ID |
| `subnet_id` | string | Yes | Must be valid subnet ID in selected VPC | Subnet ID within VPC |
| `private_ip` | string | No | Valid IPv4 address within subnet CIDR | Specific private IP (auto-assigned if omitted) |
| `enable_ipv6` | boolean | Yes | Default: false | Enable IPv6 addressing |
| `public_ip` | object | No | Required fields if provided: eip_type, bandwidth_type, bandwidth_size | Public IP configuration |

#### Public IP Configuration (if provided)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `eip_type` | string | Yes | Enum: ['5_bgp', '5_sbgp'] | Elastic IP type |
| `bandwidth_type` | string | Yes | Enum: ['5_bgp', '5_sbgp'] | Bandwidth type |
| `bandwidth_size` | number | Yes | Min: 1, Max: 2000 (Mbps) | Bandwidth size in Mbps |

### Billing & Lifecycle

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `charging_mode` | string | Yes | Enum: ['postPaid', 'prePaid'] | Payment mode |
| `auto_terminate_time` | string | No | ISO 8601 datetime, future date | Auto-termination timestamp |

### Advanced Settings

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `tags` | array | No | Each tag: key (required), value (required) | Resource tags for organization |

## Dependencies & Validation Rules

### Step Dependencies

1. **Basic Information** → No dependencies (always enabled)
2. **Compute & Image** → Requires: `region`, `availability_zone`
3. **Storage** → Requires: `region`, `availability_zone`
4. **Network** → Requires: `region`, `availability_zone`
5. **IP Configuration** → Requires: `vpc_id`, `subnet_id`
6. **Billing & Lifecycle** → No dependencies (always enabled)
7. **Advanced (Tags)** → No dependencies (always enabled)
8. **Review & Submit** → Requires: All required fields from Basic, Compute, Storage, Network

### Cross-Field Validation

1. **Region & Availability Zone**: Must be valid combination from project's region scope
2. **Flavor & Image**: Must be compatible and available in selected region/AZ
3. **VPC & Subnet**: Subnet must belong to selected VPC
4. **Private IP**: Must be within subnet's CIDR range (if provided)
5. **Count**: Must not exceed project quota for instance count
6. **System Disk**: Type must be available in selected region/AZ
7. **Data Disks**: Total storage must not exceed project quota

### Quota Validation

The backend must validate against project quotas:
- **Instance Count**: Maximum instances allowed per project
- **CPU**: Total CPU cores across all instances
- **Memory**: Total memory (GB) across all instances
- **Storage**: Total disk storage (GB) across all instances

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "server_ids": ["server-id-1", "server-id-2"],
    "job_id": "job-12345",
    "message": "Server creation initiated successfully"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "field_name",
      "message": "Error message"
    }
  }
}
```

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Instance count quota exceeded",
    "details": {
      "quota_type": "instanceCount",
      "requested": 5,
      "available": 3
    }
  }
}
```

## Dry Run Endpoint

**Endpoint:** `POST /api/v1/servers/dry-run`

Validates the request without creating resources. Returns validation results and estimated costs.

### Dry Run Response

```json
{
  "success": true,
  "data": {
    "valid": true,
    "warnings": [],
    "estimated_cost": {
      "monthly": 100.50,
      "currency": "USD"
    },
    "resource_summary": {
      "instances": 2,
      "total_cpu": 4,
      "total_memory": 8,
      "total_storage": 160
    }
  }
}
```

## Authentication

All requests must include authentication headers:

```
Authorization: Bearer <access_token>
X-Project-ID: <project_id>
```

## Integration Points

### Gateway Service

The frontend sends requests to the gateway service, which:
1. Validates authentication and authorization
2. Checks project quotas
3. Routes to appropriate microservice (compute-service, network-service, etc.)
4. Aggregates responses
5. Returns unified response to frontend

### Required Backend Services

1. **Compute Service**: Handles flavor, image, and instance creation
2. **Network Service**: Manages VPC, subnet, and IP configuration
3. **Storage Service**: Handles disk creation and attachment
4. **Billing Service**: Manages charging mode and lifecycle policies
5. **Project Service**: Provides quota information and region scope

## Data Mapping

### Frontend to Backend Field Mapping

| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| `basic.region` | `region` | Direct mapping |
| `basic.az` | `availability_zone` | Direct mapping |
| `basic.name` | `name` | Direct mapping |
| `basic.count` | `count` | Direct mapping |
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

## Example Request

```json
{
  "region": "cn-north-1",
  "availability_zone": "cn-north-1-az-1",
  "name": "web-server-01",
  "count": 2,
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
| `AUTHENTICATION_ERROR` | 401 | Invalid or expired token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `INTERNAL_ERROR` | 500 | Server internal error |

## Notes for Backend Implementation

1. **Idempotency**: Consider adding an idempotency key to prevent duplicate requests
2. **Async Processing**: Server creation should be asynchronous, return job ID immediately
3. **Validation Order**: Validate in order: authentication → quota → region/AZ → resources → network
4. **Transaction Safety**: Ensure atomic operations for multi-instance creation
5. **Error Recovery**: Provide clear error messages with actionable guidance
6. **Logging**: Log all creation attempts for audit purposes
7. **Rate Limiting**: Implement rate limiting per project/user

## Testing Requirements

Backend should support:
- Unit tests for each validation rule
- Integration tests for full request flow
- Quota validation tests
- Error handling tests
- Dry run validation tests

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-04  
**Maintained By:** Frontend Team

