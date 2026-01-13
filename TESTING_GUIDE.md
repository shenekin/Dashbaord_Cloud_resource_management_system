# ECS Server Form Testing Guide

## Overview

This guide provides comprehensive testing instructions for the ECS Server Creation Form, including unit tests, integration tests, and manual testing procedures.

## Test Files Created

1. **`src/__tests__/ECSServerForm.test.tsx`** - Unit tests for form validation
2. **`src/__tests__/setup.ts`** - Test setup and mocks
3. **`vitest.config.ts`** - Vitest configuration
4. **`run-tests.sh`** - Test runner script

## Installation

### Step 1: Install Test Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/coverage-v8 @vitejs/plugin-react
```

### Step 2: Verify Installation

```bash
npm list vitest @testing-library/react
```

## Running Tests

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Tests Using Script

```bash
./run-tests.sh
```

## Test Coverage

### 1. Required Field Validation

Tests verify that all required fields are properly validated:
- `basic.region` - Region selection
- `basic.az` - Availability zone selection
- `basic.name` - Server name
- `compute.flavor` - Instance type
- `compute.image` - OS image
- `compute.adminPassword` - Administrator password
- `storage.systemDisk.type` - System disk type
- `storage.systemDisk.size` - System disk size
- `network.vpc` - VPC selection
- `network.subnet` - Subnet selection

### 2. Field Value Validation

Tests verify field value constraints:
- Server name pattern (must start with letter, alphanumeric + hyphens/underscores)
- Server name length (3-64 characters)
- Password complexity (uppercase, lowercase, number, special char)
- Password length (12-64 characters)
- Disk size range (40-2048 GB)
- Instance count range (1-100)

### 3. Section Dependency Management

Tests verify section enable/disable logic:
- Compute section enabled when region + AZ selected
- Storage section enabled when region + AZ selected
- Network section enabled when region + AZ selected
- IP section enabled when VPC + subnet selected
- Sections disabled when dependencies not met

### 4. Actionable Errors Filtering

Tests verify error filtering logic:
- Errors for disabled sections are filtered out
- Errors for fields with valid values are excluded
- Errors for enabled sections with invalid values are included
- Nested field errors are handled correctly

### 5. Data Transformation

Tests verify form data to API transformation:
- All required fields are mapped correctly
- Optional fields are handled correctly (undefined when empty)
- Field name mapping (az → availability_zone)
- Nested object transformation (systemDisk → system_disk)

## Manual Testing Checklist

### Basic Information Section

- [ ] Select region → verify compute/storage/network sections enable
- [ ] Select availability zone → verify sections remain enabled
- [ ] Enter server name → verify validation (pattern, length)
- [ ] Change instance count → verify range validation (1-100)
- [ ] Select customer → verify credential auto-selection
- [ ] Select provider → verify credential auto-selection

### Compute & Image Section

- [ ] Select instance type → verify validation
- [ ] Select OS image → verify validation
- [ ] Enter admin password → verify complexity validation
- [ ] Regenerate password → verify new password meets requirements
- [ ] Try invalid password → verify error message

### Storage Section

- [ ] Select system disk type → verify validation
- [ ] Enter disk size → verify range validation (40-2048 GB)
- [ ] Add data disk → verify validation
- [ ] Remove data disk → verify no errors

### Network Section

- [ ] Select VPC → verify subnet options update
- [ ] Select subnet → verify IP section enables
- [ ] Change VPC → verify subnet resets
- [ ] Verify default VPC/subnet selection

### IP & Public IP Section

- [ ] Enable IPv6 → verify no errors
- [ ] Enter private IP → verify format validation
- [ ] Configure public IP → verify all fields required

### Billing & Lifecycle Section

- [ ] Select charging mode → verify no errors
- [ ] Set auto-terminate time → verify date format

### Advanced Section (Tags)

- [ ] Add tag → verify key/value validation
- [ ] Remove tag → verify no errors
- [ ] Add duplicate key → verify error (if applicable)

### Form Submission

- [ ] Fill all required fields → verify "Review & Create Server" button enables
- [ ] Leave required field empty → verify button disabled
- [ ] Click "Review & Create Server" → verify review section shows
- [ ] Verify all filled data in review section
- [ ] Confirm submission → verify API call
- [ ] Verify success redirect to `/resources/ecs`

## Debugging Tests

### View Test Output

```bash
npm run test -- --reporter=verbose
```

### Run Specific Test File

```bash
npm run test ECSServerForm.test.tsx
```

### Run Tests Matching Pattern

```bash
npm run test -- -t "required field"
```

### Debug Test in VS Code

1. Install "Jest" or "Vitest" extension
2. Set breakpoints in test file
3. Run test in debug mode
4. Step through test execution

## Common Issues

### Issue: Tests Fail with "Cannot find module"

**Solution:** Ensure all dependencies are installed:
```bash
npm install
```

### Issue: Tests Fail with "localStorage is not defined"

**Solution:** Check that `setup.ts` is properly configured and mocks localStorage.

### Issue: Tests Fail with Router Errors

**Solution:** Verify that `setup.ts` mocks Next.js router correctly.

### Issue: Coverage Report Not Generated

**Solution:** Ensure `@vitest/coverage-v8` is installed:
```bash
npm install --save-dev @vitest/coverage-v8
```

## Test Data

### Valid Form Data Example

```typescript
{
  basic: {
    region: 'us-east-1',
    az: 'us-east-1a',
    name: 'test-server',
    count: 1,
    dryRun: false,
  },
  compute: {
    flavor: 'ecs.t2.micro',
    image: 'ubuntu-20.04',
    adminPassword: 'TestPass123!',
  },
  storage: {
    systemDisk: {
      type: 'SSD',
      size: 100,
    },
    dataDisks: [],
  },
  network: {
    vpc: 'vpc-001',
    subnet: 'subnet-001',
  },
  ip: {
    enableIPv6: false,
  },
  billing: {
    chargingMode: 'postPaid',
  },
  tags: {
    tags: [],
  },
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
```

## Next Steps

1. Add integration tests for form submission flow
2. Add E2E tests using Playwright or Cypress
3. Add visual regression tests
4. Add performance tests for large forms
5. Add accessibility tests

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

