# Form Data Storage and Validation Guide

## Overview

This document describes where form data is stored, how validation works, and where data is accessible for API submission and backend validation.

## Form Data Storage Locations

### 1. Primary Storage: Form Engine State

**Location**: `src/hooks/useFormEngine.ts`

**Storage Type**: React state (`useState`)

**Data Structure**: `ServerFormData` interface

```typescript
// Stored in: useFormEngine hook state
const [formData, setFormData] = useState<ServerFormData>(initialFormData);
```

**Access Path**: 
- Component: `src/components/server-form/ECSServerForm.tsx`
- Hook: `src/app/servers/create/hooks/useECSServerForm.ts`
- Access: `const { formData } = useECSServerForm();`

### 2. Form Data Structure

**File**: `src/types/server.ts`

```typescript
interface ServerFormData {
  basic: {
    region: string;              // Selected region
    az: string;                 // Selected availability zone
    name: string;               // Server name
    count: number;              // Instance count
    dryRun: boolean;           // Dry run flag
    customer_id?: number;      // Selected customer ID
    vendor_id?: number;         // Selected vendor/provider ID
    credential_id?: number;     // Selected credential ID
  };
  compute: {
    flavor: string;             // Instance type/flavor
    image: string;              // OS image
    adminPassword: string;      // Administrator password (masked in logs)
  };
  storage: {
    systemDisk: {
      type: string;             // System disk type (SSD, SAS, etc.)
      size: number;             // System disk size in GB
    };
    dataDisks: Array<{          // Optional data disks
      type: string;
      size: number;
    }>;
  };
  network: {
    vpc: string;                // VPC ID
    subnet: string;             // Subnet ID
  };
  ip: {
    enableIPv6: boolean;       // IPv6 enabled flag
    privateIP?: string;         // Optional private IP
    publicIP?: {                // Optional public IP config
      eipType: string;
      bandwidthType: string;
      bandwidthSize: number;
    };
  };
  billing: {
    chargingMode: string;       // postPaid or prePaid
    autoTerminateTime?: string; // Optional auto-terminate time
  };
  tags: {
    tags: Array<{               // Optional tags
      key: string;
      value: string;
    }>;
  };
}
```

### 3. Transformed API Data

**Location**: Created on-demand during submission

**Transformation Function**: `src/mappers/serverFormToApi.ts`

**Storage**: Temporary object created for API request

```typescript
// Transformation happens in: useServerSubmit hook
const apiData = serverFormToApi(formData);
```

**API Request Format**:

```typescript
interface ServerApiRequest {
  region: string;
  availability_zone: string;    // From formData.basic.az
  name: string;
  count: number;
  flavor: string;
  image: string;
  admin_password: string;       // From formData.compute.adminPassword
  system_disk: {
    type: string;                // From formData.storage.systemDisk.type
    size: number;                // From formData.storage.systemDisk.size
  };
  data_disks?: Array<{...}>;
  vpc_id: string;                // From formData.network.vpc
  subnet_id: string;            // From formData.network.subnet
  private_ip?: string;
  enable_ipv6: boolean;
  public_ip?: {...};
  charging_mode: string;
  auto_terminate_time?: string;
  tags?: Array<{...}>;
  access_key?: string;          // Added from credentials
  secret_key?: string;           // Added from credentials (masked in logs)
  customer?: string;             // Added from credentials
  provider?: string;             // Added from credentials
}
```

### 4. Credentials Storage

**Location**: Browser `localStorage`

**Key**: `local_credentials`

**Access Function**: `getCredentialsFromLocalStorage()` in `src/lib/utils.ts`

**Retrieved**: During submission in `useServerSubmit` hook

```typescript
// Retrieved in: src/app/servers/create/hooks/useServerSubmit.ts
const allCredentials = getCredentialsFromLocalStorage();
```

## Validation Flow

### 1. Field-Level Validation

**Location**: `src/hooks/useFormEngine.ts`

**Function**: `validateField()`

**Validates**:
- Required fields (empty check)
- String length (minLength, maxLength)
- Number range (min, max)
- Type validation

**Triggered**: 
- On field update (`updateField`)
- On section update (`updateSection`)
- On explicit validation call (`validate()`)

### 2. Form-Level Validation

**Location**: `src/hooks/useFormEngine.ts`

**Function**: `validate()`

**Process**:
1. Iterates through all sections in schema
2. Validates each field
3. Collects all errors
4. Returns `true` if no errors, `false` otherwise

**Note**: Validates ALL fields, including disabled/optional ones

### 3. Actionable Errors Filtering

**Location**: `src/components/server-form/ECSServerForm.tsx`

**Function**: `actionableErrors` (useMemo)

**Filters errors to only include**:
- Required fields
- Enabled sections (dependencies met)
- Enabled fields (not disabled)
- Fields with invalid values

**Used for**:
- Determining if "Review & Create Server" button should be enabled
- Showing validation error message
- Final validation before submission

### 4. Validation Points

1. **On Field Change**: Immediate validation via `updateField` or `updateSection`
2. **On Review Click**: Full validation via `validate()`, then check `actionableErrors`
3. **On Submit**: Full validation via `validate()`, then check `actionableErrors`

## Data Access for Backend Validation

### 1. Before Submission

**Access**: `formData` from `useECSServerForm()` hook

```typescript
// In component
const { formData } = useECSServerForm();

// Access specific fields
const region = formData.basic.region;
const instanceType = formData.compute.flavor;
```

### 2. During Submission

**Access**: Transformed `apiData` from `serverFormToApi(formData)`

**Location**: `src/app/servers/create/hooks/useServerSubmit.ts`

```typescript
const apiData = serverFormToApi(formData);
// apiData contains all fields in API format
```

### 3. After Submission

**Storage**: 
- Form data is reset after successful submission
- Submitted data is logged to `log/ecs.log` (with sensitive data masked)
- API response contains server ID and status

**Log Location**: `log/ecs.log`

**Log Format**:
```
[timestamp] [INFO] [ecs] ECS server created successfully | Data: {
  "serverId": "...",
  "serverName": "...",
  "submittedData": {
    "region": "...",
    "availabilityZone": "...",
    ...
  }
}
```

## Validation Rules

### Required Fields

1. **Basic Section**:
   - `region` (string, minLength: 1)
   - `az` / `availabilityZone` (string, minLength: 1)
   - `name` (string, minLength: 3, maxLength: 64, pattern: ^[a-zA-Z][a-zA-Z0-9-_]*$)
   - `count` (integer, min: 1, max: 100)

2. **Compute Section**:
   - `flavor` (string, minLength: 1)
   - `image` (string, minLength: 1)
   - `adminPassword` (string, minLength: 12, maxLength: 64, complexity requirements)

3. **Storage Section**:
   - `systemDisk.type` (string, enum: ["SSD", "ESSD", "HDD"])
   - `systemDisk.size` (integer, min: 40, max: 2048)

4. **Network Section**:
   - `vpc` / `vpc_id` (string)
   - `subnet` / `subnet_id` (string)

### Optional Fields

- `dataDisks` (array)
- `privateIP` (string)
- `publicIP` (object)
- `autoTerminateTime` (string)
- `tags` (array)

### Conditional Requirements

- If `login_method` is "password": `password` is required
- If `login_method` is "ssh_key": `ssh_key_id` is required

## Form Reset

### After Successful Submission

**Location**: `src/components/server-form/ECSServerForm.tsx`

**Function**: `handleSubmit()`

**Process**:
1. Validate form
2. Check actionable errors
3. Submit form data
4. On success: Call `reset()` to restore initial state
5. Hide review section

**Reset Function**: `reset()` from `useECSServerForm()` hook

**Resets to**:
```typescript
{
  basic: {
    region: '',
    az: '',
    name: '',  // Will be auto-generated
    count: 1,
    dryRun: true,
  },
  compute: {
    flavor: '',
    image: '',
    adminPassword: '',  // Will be auto-generated
  },
  storage: {
    systemDisk: { type: '', size: 40 },
    dataDisks: [],
  },
  network: { vpc: '', subnet: '' },
  // ... other sections reset to defaults
}
```

## Data Flow Summary

```
User Input
  ↓
Form Components (onChange)
  ↓
updateFormData() / updateSection()
  ↓
Form Engine State (formData)
  ↓
Field Validation (validateField)
  ↓
Errors State (errors)
  ↓
Actionable Errors Filter (actionableErrors)
  ↓
UI Updates (button enable/disable, error messages)
  ↓
User Clicks "Review & Create Server"
  ↓
Full Validation (validate())
  ↓
Check Actionable Errors
  ↓
Show Review Section (if valid)
  ↓
User Confirms Submission
  ↓
Transform Data (serverFormToApi)
  ↓
Add Credentials (from localStorage)
  ↓
API Request (apiClient.post)
  ↓
On Success: Reset Form
  ↓
Redirect to /resources/ecs
```

## Security Considerations

1. **Sensitive Data Masking**:
   - Passwords, access keys, secret keys are masked in logs
   - Masked values appear as `***MASKED***`

2. **Data Storage**:
   - Form data stored in React state (memory only)
   - Credentials stored in localStorage (encrypted in production)
   - No sensitive data in URL or query parameters

3. **Validation**:
   - Client-side validation for UX
   - Backend validation required for security
   - All sensitive fields validated but not logged

## Troubleshooting

### Form Not Resetting

- Check if submission was successful (check `result.success`)
- Verify `reset()` function is called
- Check browser console for errors

### Validation Failing

- Check `actionableErrors` instead of `errors` (only actionable errors block submission)
- Verify all required fields are filled
- Check section dependencies (region → compute/storage/network → ip)

### Data Not Accessible

- Verify `formData` is accessed from `useECSServerForm()` hook
- Check data structure matches `ServerFormData` interface
- Verify transformation function `serverFormToApi()` is used for API format

