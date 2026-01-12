# Quick Start Testing Guide

## Quick Test Checklist

This is a simplified testing guide for quick verification of the Credentials Management integration with ECS creation.

### Prerequisites
- ✅ Backend services running (gateway on port 8001)
- ✅ Frontend running (Next.js on port 3000)
- ✅ User logged in
- ✅ Test data: at least 1 customer, 1 provider, 1 credential

### Quick Test Steps (5 minutes)

1. **Navigate to ECS Create Page**
   - Go to: `http://localhost:3000/resources/ecs/create`
   - ✅ Page loads without errors

2. **Verify Layout Changes**
   - ✅ Customer dropdown appears on the left
   - ✅ Provider dropdown appears on the right (side by side)
   - ✅ No Credential dropdown (credential is auto-selected)
   - ✅ Credential info appears automatically when both Customer and Provider are selected
   - ✅ All sections look more compact (smaller headers, less padding)

3. **Test Customer Selection**
   - Click Customer dropdown
   - ✅ Customer list loads
   - Select a customer
   - ✅ Customer is selected

4. **Test Provider Selection**
   - Click Provider dropdown (should be enabled after customer selection)
   - ✅ Provider list loads
   - Select a provider
   - ✅ Provider is selected

5. **Test Automatic Credential Selection**
   - After selecting customer and provider, wait for credential to load automatically
   - ✅ Credential is automatically fetched and selected
   - ✅ Credential info shows masked access keys (only first 4 characters visible)
   - ✅ Format: "Credential: Customer - Provider (AK: XXXX****)"
   - ✅ No manual selection needed

6. **Test Form Validation**
   - Try to submit form without selecting customer/provider/credential
   - ✅ Validation errors appear
   - ✅ Submit button is disabled

7. **Verify Compact Layout**
   - Scroll through all sections
   - ✅ All sections are more compact than before
   - ✅ Headers are smaller
   - ✅ Padding is reduced

### Expected Results Summary

✅ **All tests pass if:**
- Customer/Provider selection works side by side (left/right)
- Credential is automatically selected when both Customer and Provider are chosen
- Access keys are masked (only first 4 chars visible)
- Form sections are more compact
- Form validation works
- No Credential dropdown (auto-selection only)
- No tabs for Customer/Provider

### Common Issues

**Issue:** Customer/Provider dropdowns not loading
- **Solution:** Check backend services are running and API is accessible

**Issue:** Credentials not showing
- **Solution:** Ensure credential exists for selected customer-provider combination

**Issue:** Form looks the same size
- **Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Full Test Documentation

For comprehensive testing, see: `TEST_CREDENTIALS_ECS_INTEGRATION.md`

