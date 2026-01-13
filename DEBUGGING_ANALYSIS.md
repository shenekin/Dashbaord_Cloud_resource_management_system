# ECS Server Creation Form - Systematic Debugging Analysis

## 1. Execution Timeline

### Form Initialization Flow
```
T0: Component Mount
  ├─ useECSServerForm() hook initializes
  │  ├─ useFormEngine() creates initial state
  │  │  ├─ formData: initialFormData (all empty/default values)
  │  │  ├─ errors: {} (empty)
  │  │  └─ touched: {} (empty)
  │  └─ loadServerFormConfig() loads schema
  │
  ├─ useEffect runs (auto-generate name/password)
  │  ├─ generateServerName() → updates formData.basic.name
  │  └─ generateSecurePassword() → updates formData.compute.adminPassword
  │
  └─ ECSServerForm renders with initial state
```

### User Interaction Flow
```
T1: User selects Region
  ├─ handleSectionChange('basic', { region: 'us-east-1' })
  │  ├─ updateFormData('basic', { region: 'us-east-1' })
  │  │  ├─ updateSection() updates formData.basic.region
  │  │  ├─ validateField() checks if region is required
  │  │  └─ setErrors() clears 'basic.region' error if valid
  │  │
  │  └─ resetDownstreamSections('basic', 'region')
  │     ├─ Checks dependencies in schema
  │     └─ Resets compute, storage, network sections
  │
  └─ actionableErrors recalculates
     ├─ Checks if 'basic.region' error exists
     ├─ Verifies field is required: true
     ├─ Verifies section is enabled: true
     ├─ Verifies field is enabled: true
     └─ Verifies field value is invalid: false (now has value)
     └─ Result: Error NOT included in actionableErrors
```

### Validation Flow
```
T2: User clicks "Review & Create Server"
  ├─ handleReview() called
  │  ├─ validate() runs
  │  │  ├─ Iterates through all sections in config
  │  │  ├─ For each field:
  │  │  │  ├─ getFieldValue(fieldPath) gets current value
  │  │  │  ├─ validateField() checks:
  │  │  │  │  ├─ Required check
  │  │  │  │  ├─ Type validation (string length, number range)
  │  │  │  │  └─ Pattern validation (if applicable)
  │  │  │  └─ setErrors() updates errors object
  │  │  └─ Returns true if no errors, false otherwise
  │  │
  │  └─ If validate() returns true:
  │     └─ setShowReview(true) → Shows review section
  │
  └─ actionableErrors recalculates
     └─ Filters errors based on:
        ├─ Field required status
        ├─ Section enabled status
        ├─ Field enabled status
        └─ Field value validity (NEW CHECK)
```

### Submission Flow
```
T3: User confirms in Review section
  ├─ handleSubmit() called
  │  ├─ validate() runs again
  │  ├─ submit(formData) called
  │  │  ├─ useServerSubmit hook processes
  │  │  │  ├─ getCredentialsFromLocalStorage() retrieves credentials
  │  │  │  ├─ serverFormToApi(formData) transforms data
  │  │  │  │  ├─ Maps formData.basic.region → apiData.region
  │  │  │  │  ├─ Maps formData.basic.az → apiData.availability_zone
  │  │  │  │  ├─ Maps formData.storage.systemDisk → apiData.system_disk
  │  │  │  │  └─ Maps all other fields...
  │  │  │  │
  │  │  │  ├─ Adds credentials (access_key, secret_key, customer, provider)
  │  │  │  └─ apiClient.post() sends to backend
  │  │  │
  │  │  └─ On success: router.push('/resources/ecs')
  │  │  └─ On error: setError(errorMessage)
  │  │
  └─ Loading state managed by useServerSubmit
```

## 2. Variable/State Evolution

### Form Data State (`formData`)
**Storage Location:** `useFormEngine` hook, managed via `useState<ServerFormData>`

**Initial State:**
```typescript
{
  basic: {
    region: '',
    az: '',
    name: '',
    count: 1,
    dryRun: true,
    customer_id: undefined,
    vendor_id: undefined,
    credential_id: undefined
  },
  compute: {
    flavor: '',
    image: '',
    adminPassword: ''
  },
  storage: {
    systemDisk: { type: '', size: 40 },
    dataDisks: []
  },
  network: {
    vpc: '',
    subnet: ''
  },
  ip: {
    enableIPv6: false
  },
  billing: {
    chargingMode: 'postPaid'
  },
  tags: {
    tags: []
  }
}
```

**State Evolution Example:**
```
Step 1: User selects region
formData.basic.region: '' → 'us-east-1'
formData.compute: { flavor: '', image: '', adminPassword: '' } (reset)
formData.storage: { systemDisk: { type: '', size: 40 }, dataDisks: [] } (reset)
formData.network: { vpc: '', subnet: '' } (reset)

Step 2: User selects availability zone
formData.basic.az: '' → 'us-east-1a'
formData.compute: Still empty (depends on region + az)
formData.storage: Still empty (depends on region + az)
formData.network: Still empty (depends on region + az)

Step 3: User selects instance type
formData.compute.flavor: '' → 'ecs.t2.micro'

Step 4: User selects image
formData.compute.image: '' → 'ubuntu-20.04'

Step 5: User selects system disk type
formData.storage.systemDisk.type: '' → 'SSD'

Step 6: User selects VPC
formData.network.vpc: '' → 'vpc-001'
formData.network.subnet: '' (reset, depends on vpc)

Step 7: User selects subnet
formData.network.subnet: '' → 'subnet-001'
```

### Errors State (`errors`)
**Storage Location:** `useFormEngine` hook, managed via `useState<Record<string, string>>`

**State Evolution Example:**
```
Initial: {}
After region selection (valid): {}
After region selection (invalid): { 'basic.region': 'Region is required' }
After filling region: {} (error cleared)
After validation with missing fields:
{
  'basic.az': 'Availability zone is required',
  'compute.flavor': 'Flavor is required',
  'storage.systemDisk.type': 'Disk Type is required',
  'network.vpc': 'VPC is required'
}
After filling all required fields: {} (all errors cleared)
```

### Actionable Errors (`actionableErrors`)
**Storage Location:** `ECSServerForm` component, computed via `useMemo`

**Computation Logic:**
```typescript
actionableErrors = errors.filter(error => {
  const field = parseErrorPath(error);
  return (
    field.isRequired &&
    field.sectionEnabled &&
    field.fieldEnabled &&
    field.hasInvalidValue  // NEW CHECK
  );
});
```

**State Evolution Example:**
```
Initial: {} (no errors)
After partial fill: { 'basic.az': '...', 'compute.flavor': '...' }
After all required fields filled: {} (even if errors object has stale entries)
```

## 3. Failure Trigger Points

### Trigger Point 1: Stale Errors in Errors Object
**Location:** `useFormEngine.ts:updateSection()` (line 251-278)

**Problem:**
- `updateSection()` validates only top-level fields
- Nested fields (e.g., `storage.systemDisk.type`) are not validated
- Errors for nested fields may persist even after values are filled

**Example:**
```typescript
// User fills systemDisk.type
updateSection('storage', { systemDisk: { type: 'SSD', size: 40 } })
// Only validates 'storage.systemDisk' (top-level), not 'storage.systemDisk.type'
// Error for 'storage.systemDisk.type' may still exist in errors object
```

**Fix Applied:**
- Added value verification in `actionableErrors` filtering
- Checks if field actually has invalid value before including error

### Trigger Point 2: Field Name Mapping Mismatch
**Location:** `ECSServerForm.tsx:actionableErrors` (line 172-173)

**Problem:**
- Schema uses `availabilityZone` but form data uses `az`
- Error paths use schema names, but value lookup needs form data names

**Fix Applied:**
- Added mapping: `formDataFieldName = schemaFieldName === 'availabilityZone' ? 'az' : schemaFieldName`

### Trigger Point 3: Nested Field Path Parsing
**Location:** `ECSServerForm.tsx:actionableErrors` (line 198-201)

**Problem:**
- Error path: `storage.systemDisk.type`
- Need to get value from `formData.storage.systemDisk.type`
- Path parsing must handle nested structures

**Fix Applied:**
- Added nested path handling: `${section}.${schemaFieldName}.${pathParts[2]}`

### Trigger Point 4: Section Dependency Chain
**Location:** `ECSServerForm.tsx:isSectionEnabled()` (line 86-112)

**Problem:**
- Sections have dependencies (region → compute/storage/network → ip)
- If upstream dependency changes, downstream sections should reset
- Errors for disabled sections should not block submission

**Fix Applied:**
- `actionableErrors` checks `sectionEnabled` before including errors

## 4. Debugging Strategy

### Logs to Add

**1. Form State Changes**
```typescript
// In useFormEngine.ts:updateSection()
console.log('[FormEngine] Section update:', {
  section,
  data,
  newFormData: formData,
  errors: errors
});
```

**2. Validation Results**
```typescript
// In useFormEngine.ts:validate()
console.log('[FormEngine] Validation result:', {
  errors: newErrors,
  isValid: Object.keys(newErrors).length === 0,
  errorCount: Object.keys(newErrors).length
});
```

**3. Actionable Errors Calculation**
```typescript
// In ECSServerForm.tsx:actionableErrors
console.log('[ECSServerForm] Actionable errors calculation:', {
  allErrors: errors,
  filteredErrors: filtered,
  errorCount: Object.keys(filtered).length,
  formDataSnapshot: JSON.stringify(formData, null, 2)
});
```

**4. Field Value Lookup**
```typescript
// In ECSServerForm.tsx:actionableErrors (for each error)
console.log('[ECSServerForm] Field value check:', {
  errorPath,
  isNestedPath,
  fieldValue,
  hasInvalidValue,
  willBlock: isRequired && sectionEnabled && fieldEnabled && hasInvalidValue
});
```

### Breakpoints to Set

1. **`useFormEngine.ts:updateSection()` (line 251)**
   - Break when section data is updated
   - Inspect: `section`, `data`, `formData`, `errors`

2. **`useFormEngine.ts:validate()` (line 175)**
   - Break when validation runs
   - Inspect: `newErrors`, validation results

3. **`ECSServerForm.tsx:actionableErrors` (line 130)**
   - Break when actionable errors are calculated
   - Inspect: `errors`, `formData`, `filtered`

4. **`ECSServerForm.tsx:handleReview()` (line 61)**
   - Break when user clicks "Review & Create Server"
   - Inspect: `validate()` result, `actionableErrors.length`

### Metrics to Track

1. **Error Count Over Time**
   ```typescript
   const errorCountHistory: number[] = [];
   // Track: errors.length after each update
   ```

2. **Actionable Error Count**
   ```typescript
   const actionableErrorCountHistory: number[] = [];
   // Track: actionableErrors.length after each update
   ```

3. **Validation Performance**
   ```typescript
   const validationTimes: number[] = [];
   // Track: time taken for validate() to complete
   ```

4. **Field Update Frequency**
   ```typescript
   const fieldUpdateCounts: Record<string, number> = {};
   // Track: how many times each field is updated
   ```

## 5. Final Fix Summary

### Changes Made

1. **Added Value Verification in Error Filtering** (`ECSServerForm.tsx:194-217`)
   - Checks if field actually has invalid value before including error
   - Handles nested field paths correctly
   - Prevents stale errors from blocking submission

2. **Added Field Name Mapping** (`ECSServerForm.tsx:172-173`)
   - Maps schema field names to form data field names
   - Handles `availabilityZone` → `az` mapping

3. **Enhanced Nested Path Handling** (`ECSServerForm.tsx:198-201`)
   - Correctly parses nested error paths
   - Gets values from nested form data structures

### Next Investigation Steps

1. **Enhance Form Engine for Nested Validation**
   - Modify `updateSection()` to validate nested object properties
   - Add recursive validation for nested structures

2. **Add Real-time Validation Feedback**
   - Validate fields as user types (debounced)
   - Show inline errors immediately

3. **Improve Error Messages**
   - Add field-specific error messages
   - Include validation context (e.g., "Must be at least 40GB")

4. **Add Form State Persistence**
   - Save form state to localStorage
   - Restore on page reload

## 6. Data Storage Locations

### Form Data Storage
- **Primary Location:** `useFormEngine` hook state (`formData`)
- **Type:** `ServerFormData` (defined in `src/types/server.ts`)
- **Access:** Via `useECSServerForm()` hook in `ECSServerForm` component

### Errors Storage
- **Primary Location:** `useFormEngine` hook state (`errors`)
- **Type:** `Record<string, string>` (error path → error message)
- **Access:** Via `useECSServerForm()` hook

### Transformed API Data
- **Transformation Function:** `serverFormToApi()` in `src/mappers/serverFormToApi.ts`
- **Storage:** Created on-demand during submission
- **Type:** `ServerApiRequest` interface

### Credentials Storage
- **Location:** Browser `localStorage` (key: `local_credentials`)
- **Access:** Via `getCredentialsFromLocalStorage()` in `src/lib/utils.ts`
- **Retrieved:** During submission in `useServerSubmit` hook

## 7. API Submission Flow

```
User fills form
  ↓
formData updated in useFormEngine state
  ↓
User clicks "Review & Create Server"
  ↓
validate() checks all fields
  ↓
If valid, showReview = true
  ↓
User confirms in review section
  ↓
handleSubmit() called
  ↓
validate() runs again
  ↓
submit(formData) called
  ↓
useServerSubmit hook:
  ├─ getCredentialsFromLocalStorage()
  ├─ serverFormToApi(formData) → transforms to API format
  ├─ Adds credentials (access_key, secret_key, customer, provider)
  └─ apiClient.post('/ecs', requestPayload)
     ↓
Backend receives:
{
  region: string,
  availability_zone: string,
  name: string,
  count: number,
  flavor: string,
  image: string,
  admin_password: string,
  system_disk: { type: string, size: number },
  vpc_id: string,
  subnet_id: string,
  access_key: string,
  secret_key: string,
  customer: string,
  provider: string,
  ...other fields
}
```

## 8. Reproducibility Checklist

To reproduce validation issues:

1. ✅ Clear browser localStorage
2. ✅ Navigate to `/resources/ecs/create`
3. ✅ Fill form step by step:
   - Select region → verify compute/storage/network reset
   - Select AZ → verify sections enable
   - Fill compute fields → verify validation
   - Fill storage fields → verify nested field validation
   - Fill network fields → verify IP section enables
4. ✅ Check `actionableErrors` after each step
5. ✅ Verify "Review & Create Server" button state
6. ✅ Test with missing required fields
7. ✅ Test with all fields filled
8. ✅ Test nested field updates (systemDisk.type, systemDisk.size)

