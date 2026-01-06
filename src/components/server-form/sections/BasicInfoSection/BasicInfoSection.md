# BasicInfoSection Backend Interface Documentation

## Overview

This document describes the backend interface for the `BasicInfoSection` component, which handles basic server information form fields including region, availability zone, server name, instance count, and dry run mode.

## Component Architecture

### Frontend Component
- **Location**: `src/components/server-form/sections/BasicInfoSection/`
- **Type**: Controlled React component
- **Props Interface**: Uses `value` and `onChange` pattern (controlled component)

### Data Flow
```
Frontend Component → Form Mapper → API Request → Gateway Service → Backend Service
```

## Data Model

### Frontend Data Structure (BasicInfo)

```typescript
interface BasicInfo {
  region: string;           // Selected region (e.g., "cn-north-1")
  az: string;               // Availability zone (e.g., "cn-north-1-az1")
  name: string;             // Server name
  count: number;            // Instance count (1-N, validated against quota)
  dryRun: boolean;          // Dry run mode (default: true)
}
```

### Backend API Request Structure

```typescript
interface ServerApiRequest {
  region: string;                    // Maps from basic.region
  availability_zone: string;          // Maps from basic.az
  name: string;                       // Maps from basic.name
  count: number;                      // Maps from basic.count
  dry_run?: boolean;                  // Optional, maps from basic.dryRun
  // ... other fields from other sections
}
```

## API Endpoints

### 1. Get Available Regions

**Endpoint**: `GET /api/v1/projects/{project_id}`

**Description**: Retrieves project information including available regions from `regionScope`.

**Response Structure**:
```json
{
  "project_id": 1,
  "project_name": "My Project",
  "region_scope": ["cn-north-1", "cn-east-2", "cn-south-1"],
  "quota": {
    "instanceCount": 100,
    "cpu": 1000,
    "memory": 2048
  }
}
```

**Gateway Route**: 
- Path: `/api/v1/projects/**`
- Service: `project-service`
- Auth Required: `true`

**Usage in Component**:
- Regions are loaded from `ProjectContext.project.regionScope`
- No direct API call in component (data provided via context)

### 2. Get Availability Zones by Region

**Endpoint**: `GET /api/v1/regions/{region}/availability-zones`

**Description**: Retrieves available zones for a specific region.

**Request Parameters**:
- `region` (path parameter): Region identifier (e.g., "cn-north-1")

**Response Structure**:
```json
{
  "region": "cn-north-1",
  "availability_zones": [
    {
      "id": "cn-north-1-az1",
      "name": "Availability Zone 1",
      "status": "available"
    },
    {
      "id": "cn-north-1-az2",
      "name": "Availability Zone 2",
      "status": "available"
    }
  ]
}
```

**Gateway Route**:
- Path: `/api/v1/regions/**` (to be configured)
- Service: `project-service` or dedicated region service
- Auth Required: `true`

**Usage in Component**:
- Availability zones should be fetched by parent component when region changes
- Component receives options via props (no API calls inside component)

### 3. Validate Instance Count Against Quota

**Endpoint**: `GET /api/v1/projects/{project_id}`

**Description**: Quota information is retrieved from project context.

**Quota Validation**:
- `count` must be between `1` and `project.quota.instanceCount`
- Frontend validates in real-time
- Backend validates on submission

**Response Structure**:
```json
{
  "quota": {
    "instanceCount": 100,
    "cpu": 1000,
    "memory": 2048
  }
}
```

### 4. Create Server (Full Form Submission)

**Endpoint**: `POST /ecs` (via gateway)

**Description**: Creates server instance(s) with all form data including basic info.

**Request Body**:
```json
{
  "region": "cn-north-1",
  "availability_zone": "cn-north-1-az1",
  "name": "my-server-001",
  "count": 2,
  "dry_run": true,
  "flavor": "s6.large.2",
  "image": "Ubuntu 20.04",
  "admin_password": "SecurePassword123!",
  "system_disk": {
    "type": "SSD",
    "size": 40
  },
  "vpc_id": "vpc-12345",
  "subnet_id": "subnet-67890",
  "enable_ipv6": false,
  "charging_mode": "postPaid"
}
```

**Gateway Route**:
- Path: `/ecs`
- Service: `ecs-service`
- Auth Required: `true`
- Rate Limit: `50` requests
- Timeout: `60` seconds

**Response Structure**:
```json
{
  "server_ids": ["server-001", "server-002"],
  "job_id": "job-12345",
  "status": "creating"
}
```

## Data Mapping

### Frontend to Backend Mapping

The mapping is handled by `serverFormToApi` function in `src/mappers/serverFormToApi.ts`:

```typescript
{
  region: formData.basic.region,
  availability_zone: formData.basic.az,
  name: formData.basic.name,
  count: formData.basic.count,
  // dry_run is optional and may be included in query params or request body
}
```

### Field Transformations

| Frontend Field | Backend Field | Transformation |
|---------------|--------------|----------------|
| `basic.region` | `region` | Direct mapping |
| `basic.az` | `availability_zone` | Snake case conversion |
| `basic.name` | `name` | Direct mapping |
| `basic.count` | `count` | Direct mapping |
| `basic.dryRun` | `dry_run` | Optional, snake case conversion |

## Validation Rules

### Frontend Validation

1. **Region**:
   - Required field
   - Must be from `project.regionScope`
   - Validates on change

2. **Availability Zone**:
   - Required field
   - Depends on region selection
   - Disabled when no region selected
   - Resets when region changes

3. **Server Name**:
   - Required field
   - Min length: 1
   - Max length: 255
   - Validates on change

4. **Instance Count**:
   - Required field
   - Min: 1
   - Max: `project.quota.instanceCount`
   - Validates against quota in real-time

5. **Dry Run**:
   - Optional field
   - Default: `true`
   - Boolean value

### Backend Validation

Backend services should validate:

1. **Region**: Must be a valid region for the project
2. **Availability Zone**: Must be valid for the selected region
3. **Server Name**: Must be unique within the project (if required)
4. **Instance Count**: Must not exceed quota
5. **Quota Check**: Validate available quota before creation

## Error Handling

### Frontend Error Display

Errors are displayed inline with each field:
- Error messages shown below input fields
- ARIA attributes for accessibility
- Visual indicators (red borders)

### Backend Error Responses

**Validation Error (400)**:
```json
{
  "detail": [
    {
      "loc": ["body", "region"],
      "msg": "Region is required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "count"],
      "msg": "Instance count exceeds quota",
      "type": "value_error"
    }
  ]
}
```

**Quota Exceeded (403)**:
```json
{
  "error": "quota_exceeded",
  "message": "Instance count exceeds available quota",
  "available": 10,
  "requested": 20
}
```

**Unauthorized (401)**:
```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

## Dependencies and Reset Logic

### Upstream Dependencies

1. **Region → Availability Zone**:
   - When region changes, availability zone resets to empty
   - Availability zone options reload based on new region

2. **Region/AZ → Downstream Sections**:
   - Network section (VPC/Subnet) may need reset
   - Compute section (flavors) may need reset
   - Storage section may need reset

### Reset Callback

The component supports `onResetDownstream` callback:
```typescript
onResetDownstream?: () => void;
```

This callback is triggered when:
- Region changes
- Availability zone changes

## Integration with Gateway Service

### Gateway Configuration

Routes should be configured in `gateway-service/config/routes.yaml`:

```yaml
- path: /api/v1/regions/**
  service: project-service
  methods: [GET]
  auth_required: true
  rate_limit: 100
  timeout: 30
```

### Authentication

All endpoints require authentication:
- JWT token in `Authorization` header
- Token validated by gateway middleware
- User ID extracted from token for quota checks

### Rate Limiting

- Project endpoints: 100 requests/minute
- ECS creation: 50 requests/minute
- Per-user rate limiting applied

## Testing

### Unit Tests

Test cases should cover:
1. Region selection and availability zone loading
2. Quota validation for instance count
3. Form field validation
4. Error display
5. Reset logic on region/AZ change

### Integration Tests

Test scenarios:
1. Create server with valid basic info
2. Validate quota enforcement
3. Test region/AZ dependency
4. Test dry run mode
5. Error handling for invalid inputs

## Future Enhancements

1. **Real-time Quota Updates**: WebSocket or polling for quota changes
2. **Region-specific Validation**: Different rules per region
3. **Availability Zone Status**: Show availability zone status (available/maintenance)
4. **Bulk Operations**: Support for creating multiple servers with different names
5. **Name Validation**: Check server name uniqueness before submission

## Related Documentation

- [Gateway Service Routes](../gateway-service/config/routes.yaml)
- [Project Service API](../project-service/README.md)
- [Form Mapper](../mappers/serverFormToApi.ts)
- [Project Context](../contexts/ProjectContext.tsx)

