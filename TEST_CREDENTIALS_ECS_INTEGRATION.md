# Test Documentation: Credentials Management Integration with ECS Creation

## Overview

This document provides comprehensive test cases for verifying the integration of Credentials Management into the ECS (Elastic Cloud Server) creation flow. The integration includes:

1. Customer and Provider selection (sequential, not tabs)
2. Credential selection with masked access keys (first 4 characters only)
3. Compact ECS form layout
4. Version API integration

## Prerequisites

1. **Backend Services Running:**
   - Gateway service (default: `http://localhost:8001`)
   - Project service (credentials, customers, vendors APIs)
   - Authentication service

2. **Test Data Setup:**
   - At least one customer created
   - At least one vendor/provider created
   - At least one credential created for a customer-vendor combination
   - Valid authentication token

3. **Frontend Application:**
   - Next.js development server running (`npm run dev`)
   - Browser with developer tools enabled

## Test Environment Setup

### 1. Start Backend Services

```bash
# Start gateway service
cd gateway-service
./start.sh  # or your start command

# Verify gateway is running
curl http://localhost:8001/health
```

### 2. Start Frontend Application

```bash
# In the Dashboard project root
npm run dev

# Verify frontend is running
# Open http://localhost:3000 in browser
```

### 3. Login to Application

1. Navigate to `http://localhost:3000/login`
2. Enter valid credentials
3. Verify successful login and redirect to dashboard

## Test Cases

### Test Case 1: Basic Information Section Layout

**Objective:** Verify that Customer and Provider are displayed side by side (left and right) and credential is automatically determined.

**Steps:**
1. Navigate to ECS Create page: `http://localhost:3000/resources/ecs/create`
2. Scroll to "Basic Information" section
3. Verify the section header is compact (smaller than before)

**Expected Results:**
- ✅ Customer dropdown appears on the left
- ✅ Provider dropdown appears on the right (side by side with Customer)
- ✅ Customer and Provider are in a grid layout (2 columns on medium+ screens)
- ✅ No Credential selector dropdown (credential is auto-selected)
- ✅ Credential information is displayed automatically when both Customer and Provider are selected
- ✅ No tabs visible for Customer/Provider selection
- ✅ Section header is smaller (text-base instead of text-lg)
- ✅ Section padding is reduced (p-4 instead of p-5/p-6)

**Screenshots Location:** Save screenshots as `test-results/tc1-basic-info-layout.png`

---

### Test Case 2: Customer Selection

**Objective:** Verify customer dropdown loads and functions correctly.

**Steps:**
1. On ECS Create page, locate Customer dropdown
2. Click on Customer dropdown
3. Verify customer list is populated
4. Select a customer

**Expected Results:**
- ✅ Customer dropdown is enabled
- ✅ Customer list loads from API
- ✅ Loading indicator shows while fetching
- ✅ Selected customer is displayed
- ✅ Provider dropdown becomes enabled after customer selection

**Test Data:**
- Customer IDs: 1, 2, 3 (or your test customer IDs)
- Customer Names: "Test Customer 1", "Test Customer 2", etc.

**Screenshots Location:** `test-results/tc2-customer-selection.png`

---

### Test Case 3: Provider Selection

**Objective:** Verify provider dropdown loads and functions correctly after customer selection.

**Steps:**
1. Select a customer (from Test Case 2)
2. Locate Provider dropdown
3. Click on Provider dropdown
4. Verify provider list is populated
5. Select a provider

**Expected Results:**
- ✅ Provider dropdown is enabled after customer selection
- ✅ Provider list loads from API
- ✅ Loading indicator shows while fetching
- ✅ Selected provider is displayed
- ✅ Credential dropdown becomes enabled after provider selection

**Test Data:**
- Provider IDs: 1, 2, 3 (or your test provider IDs)
- Provider Names: "Huawei", "AWS", "Azure", etc.

**Screenshots Location:** `test-results/tc3-provider-selection.png`

---

### Test Case 4: Automatic Credential Selection with Masked Access Key

**Objective:** Verify credential is automatically selected and shows only first 4 characters of access key.

**Prerequisites:**
- Customer selected
- Provider selected
- At least one credential exists for the customer-provider combination

**Steps:**
1. Select a customer
2. Select a provider
3. Wait for credential to be automatically loaded
4. Verify credential information is displayed

**Expected Results:**
- ✅ Credential is automatically fetched and selected when both customer and provider are selected
- ✅ Loading indicator shows while fetching credential
- ✅ Credential info displays format: `Credential: Customer Name - Provider Name (AK: XXXX****)`
- ✅ Only first 4 characters of access key are visible
- ✅ Remaining characters are masked with asterisks
- ✅ Credential info is displayed in a blue info box (not a dropdown)
- ✅ No manual credential selection is required

**Test Data:**
- Credential with access_key: "ABCD1234567890" should display as "ABCD**********"
- Credential with access_key: "TEST" should display as "TEST" or "****"

**Screenshots Location:** `test-results/tc4-credential-masked-ak.png`

---

### Test Case 5: Automatic Credential Selection - No Credentials Available

**Objective:** Verify appropriate message when no credentials exist for selected customer-provider combination.

**Steps:**
1. Select a customer
2. Select a provider that has no credentials
3. Wait for credential auto-selection to complete
4. Verify warning message

**Expected Results:**
- ✅ Warning message displayed: "No credential available for this customer and provider combination. Please create credentials first."
- ✅ Message is styled with amber/yellow background
- ✅ Message appears automatically (no dropdown interaction needed)
- ✅ Form validation should prevent submission if no credential is available

**Screenshots Location:** `test-results/tc5-no-credentials.png`

---

### Test Case 6: Form Section Compactness

**Objective:** Verify all ECS form sections are more compact than before.

**Steps:**
1. Navigate to ECS Create page
2. Scroll through all sections:
   - Basic Information
   - Compute & Image
   - Storage Configuration
   - Network Configuration
   - IP Configuration
   - Billing & Lifecycle
   - Advanced Settings

**Expected Results:**
- ✅ All sections have reduced padding (p-4 instead of p-5/p-6)
- ✅ All section headers are smaller (text-base instead of text-lg)
- ✅ All section headers have reduced padding (px-4 py-2.5 instead of px-6 py-3.5)
- ✅ All section icons are smaller (w-6 h-6 instead of w-7 h-7)
- ✅ All section spacing is tighter (gap-3/space-y-3 instead of gap-6/space-y-6)
- ✅ All sections use rounded-lg instead of rounded-xl/rounded-2xl
- ✅ All sections use shadow-md instead of shadow-lg/shadow-xl
- ✅ Overall form height is reduced, making it easier to navigate

**Screenshots Location:** `test-results/tc6-compact-sections.png`

---

### Test Case 7: Form Validation

**Objective:** Verify form validation works correctly with customer, provider, and credential fields.

**Steps:**
1. Navigate to ECS Create page
2. Try to submit form without selecting customer
3. Try to submit form with customer but no provider
4. Try to submit form with customer and provider but no credential
5. Select all required fields and verify form can be submitted

**Expected Results:**
- ✅ Form shows validation error if customer is not selected
- ✅ Form shows validation error if provider is not selected
- ✅ Form shows validation error if credential is not selected
- ✅ Error messages are displayed in red below respective fields
- ✅ Submit button is disabled when validation errors exist
- ✅ Form can be submitted when all required fields are filled

**Screenshots Location:** `test-results/tc7-form-validation.png`

---

### Test Case 8: Automatic Credential Reset on Customer/Provider Change

**Objective:** Verify credential is automatically reset and re-selected when customer or provider changes.

**Steps:**
1. Select a customer
2. Select a provider
3. Wait for credential to be automatically selected
4. Verify credential is displayed
5. Change the customer selection
6. Verify credential is reset and provider is also reset
7. Select a provider again
8. Verify credential is automatically re-selected for new customer-provider combination
9. Change the provider selection
10. Verify credential is automatically reset and re-selected for new combination

**Expected Results:**
- ✅ Credential is automatically cleared when customer changes
- ✅ Provider is also reset when customer changes
- ✅ Credential is automatically cleared when provider changes
- ✅ Credential is automatically re-fetched and re-selected when new customer-provider combination is selected
- ✅ Loading indicator shows during credential fetch
- ✅ New credential info is displayed automatically

**Screenshots Location:** `test-results/tc8-credential-reset.png`

---

### Test Case 9: Version API Integration

**Objective:** Verify version API service is accessible and returns version information.

**Steps:**
1. Open browser developer console
2. Navigate to ECS Create page
3. In console, test version API:
   ```javascript
   import { versionApi } from '@/services/versionApi';
   versionApi.getVersion().then(console.log).catch(console.error);
   ```

**Expected Results:**
- ✅ Version API service file exists at `src/services/versionApi.ts`
- ✅ Version API can be imported without errors
- ✅ `getVersion()` method returns version information
- ✅ Version info includes: service_name, version, api_version, build_date
- ✅ Optional fields may include: description, git_commit, git_branch

**Test Data:**
- Expected response format:
  ```json
  {
    "service_name": "project-service",
    "version": "1.0.0",
    "api_version": "v1",
    "build_date": "2024-01-15T10:30:00Z",
    "description": "Project management service"
  }
  ```

**Screenshots Location:** `test-results/tc9-version-api.png`

---

### Test Case 10: End-to-End ECS Creation Flow

**Objective:** Verify complete ECS creation flow with credentials integration.

**Steps:**
1. Navigate to ECS Create page
2. Select Customer
3. Select Provider
4. Select Credential
5. Fill in all required fields:
   - Region
   - Availability Zone
   - Server Name
   - Instance Count
   - Flavor
   - Image
   - Admin Password
   - System Disk
   - VPC
   - Subnet
   - Charging Mode
6. Click "Create Server" button
7. Verify form submission

**Expected Results:**
- ✅ All form sections are accessible and functional
- ✅ Form data includes customer_id, vendor_id, and credential_id
- ✅ Form submission includes credential information
- ✅ Success/error message is displayed after submission
- ✅ Form can be submitted successfully (if backend is configured)

**Test Data:**
- Use valid test data for all fields
- Verify form data payload includes:
  ```json
  {
    "basic": {
      "customer_id": 1,
      "vendor_id": 1,
      "credential_id": 1,
      "region": "cn-north-1",
      "az": "cn-north-1a",
      "name": "test-server",
      "count": 1,
      "dryRun": true
    },
    ...
  }
  ```

**Screenshots Location:** `test-results/tc10-end-to-end.png`

---

## Regression Testing

### Test Case 11: Existing Functionality Not Affected

**Objective:** Verify that existing ECS creation functionality still works.

**Steps:**
1. Test all existing form fields (Region, AZ, Name, Count, etc.)
2. Test form dependencies (Region → AZ → Network, etc.)
3. Test form validation for existing fields
4. Test form submission flow

**Expected Results:**
- ✅ All existing form fields work as before
- ✅ Form dependencies are maintained
- ✅ Form validation works for existing fields
- ✅ No breaking changes to existing functionality

---

## Performance Testing

### Test Case 12: Form Loading Performance

**Objective:** Verify form loads quickly and customer/provider/credential data loads efficiently.

**Steps:**
1. Open browser developer tools → Network tab
2. Navigate to ECS Create page
3. Monitor API calls for customers, vendors, and credentials
4. Measure load times

**Expected Results:**
- ✅ Customer list loads within 2 seconds
- ✅ Vendor list loads within 2 seconds
- ✅ Credential list loads within 2 seconds after customer/provider selection
- ✅ No unnecessary API calls
- ✅ API calls are properly cached if applicable

---

## Browser Compatibility Testing

### Test Case 13: Cross-Browser Compatibility

**Objective:** Verify functionality works across different browsers.

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Steps:**
1. Test in each browser
2. Verify all test cases pass
3. Check for any visual inconsistencies

**Expected Results:**
- ✅ All functionality works in all browsers
- ✅ UI is consistent across browsers
- ✅ No browser-specific errors

---

## Test Results Template

Use this template to document test results:

```markdown
## Test Results - [Date]

### Test Case [Number]: [Test Case Name]
- **Status:** ✅ Pass / ❌ Fail / ⚠️ Partial
- **Tester:** [Name]
- **Date:** [Date]
- **Notes:** [Any additional notes]
- **Screenshots:** [Path to screenshots]
- **Issues Found:** [List any issues]
```

---

## Known Issues

Document any known issues here:

1. **[Issue Description]**
   - **Severity:** High/Medium/Low
   - **Status:** Open/In Progress/Resolved
   - **Workaround:** [If applicable]

---

## Test Checklist

Use this checklist to ensure all tests are completed:

- [ ] Test Case 1: Basic Information Section Layout
- [ ] Test Case 2: Customer Selection
- [ ] Test Case 3: Provider Selection
- [ ] Test Case 4: Credential Selection with Masked Access Key
- [ ] Test Case 5: Credential Selection - No Credentials Available
- [ ] Test Case 6: Form Section Compactness
- [ ] Test Case 7: Form Validation
- [ ] Test Case 8: Credential Reset on Customer/Provider Change
- [ ] Test Case 9: Version API Integration
- [ ] Test Case 10: End-to-End ECS Creation Flow
- [ ] Test Case 11: Existing Functionality Not Affected
- [ ] Test Case 12: Form Loading Performance
- [ ] Test Case 13: Cross-Browser Compatibility

---

## Contact

For questions or issues related to testing, contact:
- Development Team: [Contact Information]
- QA Team: [Contact Information]

---

## Version History

- **v1.0** - Initial test documentation for Credentials Management Integration
- **Date:** [Current Date]

