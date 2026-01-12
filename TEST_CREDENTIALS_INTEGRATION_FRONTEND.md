# Frontend Credentials Integration - Manual Testing Guide

This guide provides step-by-step instructions for manually testing the Credentials Management integration in the Dashboard frontend.

## Prerequisites

1. **Backend Services Running:**
   - Gateway-service: `http://localhost:8001`
   - Project-service: `http://localhost:8002` (or configured port)
   - Auth-service: Running and accessible

2. **Frontend Running:**
   - Dashboard application: `http://localhost:3000` (or configured port)
   - User logged in with valid credentials

3. **Test Data Setup:**
   - At least one customer created via API or UI
   - At least one vendor/provider created via API or UI
   - At least one project created via API or UI

## Test Scenarios

### Test 1: Credentials Management Page - Access Key Masking

**Objective:** Verify that access keys are displayed with only first 4 characters visible.

**Steps:**
1. Navigate to **Credentials Management** page
2. Create a new credential:
   - Select a Customer
   - Select a Provider
   - Enter Access Key: `AK1234567890ABCDEF`
   - Enter Secret Key: `SK9876543210FEDCBA`
   - Click "Save Credentials"
3. Verify in Credential List:
   - Access Key displays as: `AK12****************` (only first 4 chars visible)
   - Secret Key displays as: `****` (fully masked)
   - Customer and Provider names are visible
   - Created date is visible

**Expected Result:**
- ✅ Access key shows only first 4 characters: `AK12`
- ✅ Rest of access key is masked with `*`
- ✅ Secret key is fully masked
- ✅ No sensitive data exposed

---

### Test 2: ECS Create Page - Customer and Provider Tabs

**Objective:** Verify customer and provider tabs appear in Basic Information section.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Scroll to **Basic Information** section
3. Verify tabs are present:
   - "Customer" tab
   - "Provider" tab
4. Click on "Customer" tab
5. Verify customer dropdown appears
6. Click on "Provider" tab
7. Verify provider dropdown appears

**Expected Result:**
- ✅ Customer and Provider tabs are visible
- ✅ Tabs switch correctly when clicked
- ✅ Active tab is highlighted (blue border)
- ✅ Dropdowns load customers and providers from API

---

### Test 3: Credential Selector Integration

**Objective:** Verify credential selector appears and works correctly.

**Steps:**
1. Navigate to **ECS Create Server** page
2. In Basic Information section:
   - Click "Customer" tab
   - Select a customer from dropdown
   - Click "Provider" tab
   - Select a provider from dropdown
3. Verify "Credentials Management Choice" selector appears below tabs
4. Verify selector shows:
   - Label: "Credentials Management Choice *"
   - Dropdown with available credentials
5. Click on credential dropdown
6. Verify each option shows:
   - Format: `CustomerName - ProviderName (AK: AK12**********)`
   - Only first 4 characters of access key visible
7. Select a credential
8. Verify selected credential is stored in form

**Expected Result:**
- ✅ Credential selector appears after customer and provider selection
- ✅ Dropdown shows only credentials for selected customer and provider
- ✅ Access keys are masked in dropdown options
- ✅ Selected credential_id is stored in form data

---

### Test 4: Credential Selector - No Credentials Available

**Objective:** Verify proper message when no credentials are available.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Select a customer and provider that have no credentials
3. Verify message appears:
   - "No credentials available for this customer and provider. Please create credentials first."

**Expected Result:**
- ✅ Appropriate message displayed
- ✅ Message is clear and actionable
- ✅ User knows they need to create credentials first

---

### Test 5: ECS Form Compactness

**Objective:** Verify all form sections are more compact.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Scroll through all sections:
   - Basic Information
   - Compute & Image
   - Storage Configuration
   - Network Configuration
   - IP Configuration
   - Billing & Lifecycle
   - Advanced Settings
3. Verify:
   - Headers are smaller (text-lg instead of text-xl)
   - Padding is reduced (p-5 instead of p-8)
   - Section spacing is reduced
   - Colors and styles remain unchanged

**Expected Result:**
- ✅ All sections are more compact
- ✅ Page requires less scrolling
- ✅ Visual style and colors unchanged
- ✅ Form is easier to navigate

---

### Test 6: Form Validation - Credential Required

**Objective:** Verify credential selection is required for form submission.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Fill in all required fields EXCEPT credential selection
3. Try to submit form
4. Verify validation error appears for credential field
5. Select a credential
6. Verify validation error disappears
7. Submit form
8. Verify form submits successfully

**Expected Result:**
- ✅ Validation error appears when credential not selected
- ✅ Error message is clear: "Credentials Management Choice is required"
- ✅ Error disappears when credential is selected
- ✅ Form can be submitted after credential selection

---

### Test 7: Credential Selection Reset

**Objective:** Verify credential selection resets when customer or provider changes.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Select Customer: "Customer1"
3. Select Provider: "Provider1"
4. Select Credential: "Credential1"
5. Change Customer to "Customer2"
6. Verify credential selection is reset (cleared)
7. Select Provider: "Provider2"
8. Verify credential selection is reset again

**Expected Result:**
- ✅ Credential selection resets when customer changes
- ✅ Credential selection resets when provider changes
- ✅ User must re-select credential after changing customer/provider

---

### Test 8: Loading States

**Objective:** Verify loading states appear during API calls.

**Steps:**
1. Navigate to **ECS Create Server** page
2. Click "Customer" tab
3. Verify loading indicator appears (if customers are loading)
4. Wait for customers to load
5. Click "Provider" tab
6. Verify loading indicator appears (if providers are loading)
7. Select customer and provider
8. Verify loading indicator appears in credential selector
9. Wait for credentials to load

**Expected Result:**
- ✅ Loading indicators appear during API calls
- ✅ Loading messages are clear: "Loading customers...", "Loading providers...", "Loading credentials..."
- ✅ UI is responsive and doesn't freeze

---

### Test 9: Error Handling

**Objective:** Verify error messages appear when API calls fail.

**Steps:**
1. Stop backend service (or disconnect network)
2. Navigate to **ECS Create Server** page
3. Try to select customer
4. Verify error message appears
5. Try to select provider
6. Verify error message appears
7. Select customer and provider (if possible)
8. Verify error message appears in credential selector

**Expected Result:**
- ✅ Error messages are displayed clearly
- ✅ Error messages are user-friendly
- ✅ UI doesn't crash on errors
- ✅ User can retry after fixing the issue

---

### Test 10: Complete ECS Creation Flow

**Objective:** Verify complete flow from credential selection to ECS creation.

**Steps:**
1. **Create Credential:**
   - Navigate to Credentials Management page
   - Create a credential with customer, provider, AK, and SK
   - Verify credential appears in list with masked AK

2. **Create ECS:**
   - Navigate to ECS Create Server page
   - Click "Customer" tab, select customer
   - Click "Provider" tab, select provider
   - Select credential from dropdown
   - Fill in other required fields:
     - Region, Availability Zone
     - Server Name
     - Instance Count
     - Flavor, Image
     - Storage, Network, etc.
   - Click "Create Server"

3. **Verify Submission:**
   - Check browser network tab
   - Verify POST request includes `credential_id` in form data
   - Verify request is sent to correct endpoint

**Expected Result:**
- ✅ Complete flow works end-to-end
- ✅ Credential is properly selected
- ✅ Form data includes credential_id
- ✅ ECS creation request includes credential information

---

## Visual Checklist

### Basic Information Section:
- [ ] Section header is smaller (text-lg)
- [ ] Padding is reduced (p-5)
- [ ] Customer and Provider tabs are visible
- [ ] Tabs switch correctly
- [ ] Active tab has blue border
- [ ] Credential selector appears after customer/provider selection
- [ ] Credential dropdown shows masked access keys
- [ ] All fields are properly aligned

### Other Sections:
- [ ] All sections have reduced padding
- [ ] All headers are smaller
- [ ] Section spacing is reduced
- [ ] Colors and styles unchanged
- [ ] Form is more compact overall

---

## Browser Console Checks

While testing, check browser console for:

1. **No Errors:**
   - No JavaScript errors
   - No API call failures (unless testing error handling)
   - No React warnings

2. **API Calls:**
   - Verify correct endpoints are called
   - Verify request headers include authentication
   - Verify request payloads are correct
   - Verify responses are handled correctly

3. **Network Tab:**
   - Check API response times
   - Check response status codes
   - Check response data structure

---

## Test Data Examples

### Customer:
```json
{
  "name": "Test Customer",
  "description": "Test customer for integration testing"
}
```

### Vendor:
```json
{
  "name": "huaweicloud",
  "display_name": "Huawei Cloud",
  "description": "Huawei Cloud Platform"
}
```

### Credential:
```json
{
  "customer_id": 1,
  "project_id": 1,
  "vendor_id": 1,
  "access_key": "AK1234567890ABCDEF",
  "secret_key": "SK9876543210FEDCBA",
  "status": "active"
}
```

---

## Troubleshooting

### Issue: Credentials not loading
- Check backend service is running
- Check API endpoint is correct
- Check authentication token is valid
- Check browser console for errors

### Issue: Access keys not masked
- Check API response contains masked access_key
- Check frontend is using API response
- Clear browser cache and reload

### Issue: Tabs not working
- Check React state is updating correctly
- Check browser console for errors
- Verify component is receiving correct props

### Issue: Form too large
- Check all sections have updated CSS classes
- Verify padding is p-5, not p-8
- Verify headers are text-lg, not text-xl

---

## Notes

- All tests should be performed in a clean browser session
- Clear browser cache if issues persist
- Use browser DevTools to inspect network requests
- Check both success and error scenarios
- Verify responsive design on different screen sizes

