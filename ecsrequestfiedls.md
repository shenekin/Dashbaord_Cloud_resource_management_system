# ECS Form Data Access Guide

## Where to Get All Filled ECS Form Data

### 1. **Primary Location: `formData` from `useECSServerForm` Hook**

**File:** `src/app/servers/create/hooks/useECSServerForm.ts`

The complete form data is stored in the `formData` object returned by the `useECSServerForm()` hook.

**Access in Component:**
```typescript
// In ECSServerForm component (src/components/server-form/ECSServerForm.tsx)
const { formData } = useECSServerForm();
```

### 2. **Complete Data Structure**

The `formData` object follows the `ServerFormData` interface structure:

**File:** `src/types/server.ts`

```typescript
formData = {
  basic: {
    region: string,           // Selected region
    az: string,              // Selected availability zone
    name: string,            // Server name
    count: number,           // Number of instances (default: 1)
    dryRun: boolean         // Dry run flag (default: true)
  },
  compute: {
    flavor: string,          // Instance flavor/flavorRef
    image: string,           // Image/imageRef
    adminPassword: string    // Administrator password
  },
  storage: {
    systemDisk: {
      type: string,          // System disk type (e.g., "SSD", "SAS")
      size: number           // System disk size in GB (default: 40)
    },
    dataDisks: [             // Array of data disks
      {
        type: string,        // Data disk type
        size: number         // Data disk size in GB
      }
    ]
  },
  network: {
    vpc: string,             // VPC ID
    subnet: string           // Subnet ID
  },
  ip: {
    privateIP?: string,      // Optional private IP address
    enableIPv6: boolean,     // IPv6 enabled flag (default: false)
    publicIP?: {             // Optional public IP configuration
      eipType: string,       // EIP type (e.g., "5_bgp", "5_sbgp")
      bandwidthType: string, // Bandwidth type (e.g., "traffic", "bandwidth")
      bandwidthSize: number  // Bandwidth size
    }
  },
  billing: {
    chargingMode: string,    // Charging mode (e.g., "postPaid", "prePaid")
    autoTerminateTime?: string // Optional auto-terminate time (ISO format)
  },
  tags: {
    tags: [                  // Array of tags
      {
        key: string,         // Tag key
        value: string        // Tag value
      }
    ]
  }
}
```

### 3. **How to Access Data for Backend Submission**

#### Option A: Access `formData` Directly in Submit Handler

**Location:** `src/components/server-form/ECSServerForm.tsx` (line 52-56)

The submit handler already receives the complete `formData`:

```typescript
const handleSubmit = async () => {
  if (validate()) {
    await submit(formData);  // formData contains all filled data
  }
};
```

#### Option B: Use the Mapper Function (Recommended for Backend)

**File:** `src/mappers/serverFormToApi.ts`

The `serverFormToApi()` function converts frontend `formData` to backend API format:

```typescript
import { serverFormToApi } from '@/mappers/serverFormToApi';

// Convert form data to API request format
const apiRequest = serverFormToApi(formData);
```

**Backend API Request Format (`ServerApiRequest`):**

```typescript
{
  region: string,                    // From formData.basic.region
  availability_zone: string,        // From formData.basic.az
  name: string,                      // From formData.basic.name
  count: number,                      // From formData.basic.count
  flavor: string,                     // From formData.compute.flavor
  image: string,                      // From formData.compute.image
  admin_password: string,             // From formData.compute.adminPassword
  system_disk: {
    type: string,                     // From formData.storage.systemDisk.type
    size: number                      // From formData.storage.systemDisk.size
  },
  data_disks?: Array<{               // From formData.storage.dataDisks (optional)
    type: string,
    size: number
  }>,
  vpc_id: string,                     // From formData.network.vpc
  subnet_id: string,                  // From formData.network.subnet
  private_ip?: string,                // From formData.ip.privateIP (optional)
  enable_ipv6: boolean,               // From formData.ip.enableIPv6
  public_ip?: {                       // From formData.ip.publicIP (optional)
    eip_type: string,                 // From formData.ip.publicIP.eipType
    bandwidth_type: string,           // From formData.ip.publicIP.bandwidthType
    bandwidth_size: number            // From formData.ip.publicIP.bandwidthSize
  },
  charging_mode: string,              // From formData.billing.chargingMode
  auto_terminate_time?: string,       // From formData.billing.autoTerminateTime (optional)
  tags?: Array<{                      // From formData.tags.tags (optional)
    key: string,
    value: string
  }>
}
```

### 4. **Submit Hook Location**

**File:** `src/app/servers/create/hooks/useServerSubmit.ts`

The submit hook processes the form data:

```typescript
const submit = async (formData: ServerFormData) => {
  const apiData = serverFormToApi(formData);  // Convert to API format
  // TODO: Implement actual API call here
  // await api.createServer(apiData);
};
```

**Current Status:** The submit function currently has a placeholder. You need to implement the actual API call at line 19-20 in `useServerSubmit.ts`.

### 5. **Where to Implement Backend API Call**

**File:** `src/app/servers/create/hooks/useServerSubmit.ts`

**Line 13-30:** Replace the placeholder code with your actual backend API call:

```typescript
const submit = async (formData: ServerFormData) => {
  setLoading(true);
  setError(null);

  try {
    const apiData = serverFormToApi(formData);
    
    // TODO: Replace this with your actual API call
    const response = await fetch('/api/servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create server');
    }
    
    const result = await response.json();
    router.push(`/servers/${result.id}`);
  } catch (err: any) {
    setError(err.message || 'Failed to create server');
  } finally {
    setLoading(false);
  }
};
```

### 6. **Data Flow Summary**

1. **User Input** → Form components update `formData` via `onChange` handlers
2. **Form State** → `formData` is managed by `useECSServerForm()` hook
3. **Submit Action** → `handleSubmit()` in `ECSServerForm.tsx` calls `submit(formData)`
4. **Data Transformation** → `serverFormToApi(formData)` converts to backend format
5. **API Call** → Send `apiData` to your backend endpoint (to be implemented)

### 7. **Important Notes**

- **Validation:** Before submitting, `validate()` is called to ensure all required fields are filled
- **Errors:** Validation errors are stored in `errors` object (also from `useECSServerForm()`)
- **Dependencies:** Some fields may be empty if their dependencies are not met (e.g., `compute.flavor` requires `basic.region` and `basic.az`)
- **Optional Fields:** Fields marked with `?` in the type definition are optional and may be `undefined`
- **Default Values:** Some fields have defaults (e.g., `count: 1`, `enableIPv6: false`, `chargingMode: 'postPaid'`)

### 8. **Example: Accessing Specific Fields**

```typescript
// Get all form data
const { formData } = useECSServerForm();

// Access specific sections
const region = formData.basic.region;
const serverName = formData.basic.name;
const instanceCount = formData.basic.count;
const flavor = formData.compute.flavor;
const image = formData.compute.image;
const vpcId = formData.network.vpc;
const subnetId = formData.network.subnet;
const systemDiskSize = formData.storage.systemDisk.size;
const dataDisks = formData.storage.dataDisks;
const publicIP = formData.ip.publicIP;
const tags = formData.tags.tags;
```

---

## Summary

**To get all filled ECS form data for backend submission:**

1. **Location:** `formData` object from `useECSServerForm()` hook
2. **Component:** `ECSServerForm.tsx` (line 27)
3. **Submit Handler:** `handleSubmit()` function (line 52-56)
4. **Mapper:** `serverFormToApi()` function converts to backend format
5. **Implementation:** Add your API call in `useServerSubmit.ts` (line 19-20)

The complete form data is available in the `formData` object and can be accessed at any time during the form lifecycle, but it's typically sent to the backend when the user clicks the "Create Server" button.

