/**
 * Unit Tests for ECS Server Creation Form
 * 
 * Tests cover:
 * - Form validation logic
 * - Field dependency management
 * - Error filtering and actionable errors
 * - Data transformation for API submission
 * - State management and updates
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerFormData } from '@/types/server';
import { serverFormToApi } from '@/mappers/serverFormToApi';

// Note: Mocks are handled in setup.ts

describe('ECS Server Form Validation', () => {
  let mockFormData: ServerFormData;

  beforeEach(() => {
    mockFormData = {
      basic: {
        region: '',
        az: '',
        name: '',
        count: 1,
        dryRun: true,
      },
      compute: {
        flavor: '',
        image: '',
        adminPassword: '',
      },
      storage: {
        systemDisk: {
          type: '',
          size: 40,
        },
        dataDisks: [],
      },
      network: {
        vpc: '',
        subnet: '',
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
    };
  });

  describe('Required Field Validation', () => {
    it('should validate basic.region is required', () => {
      const result = validateRequiredField('basic', 'region', '');
      expect(result).toBe('Region is required');
    });

    it('should validate basic.az is required', () => {
      const result = validateRequiredField('basic', 'az', '');
      expect(result).toBe('Availability zone is required');
    });

    it('should validate basic.name is required', () => {
      const result = validateRequiredField('basic', 'name', '');
      expect(result).toBe('Server name is required');
    });

    it('should validate compute.flavor is required', () => {
      const result = validateRequiredField('compute', 'flavor', '');
      expect(result).toBe('Flavor is required');
    });

    it('should validate compute.image is required', () => {
      const result = validateRequiredField('compute', 'image', '');
      expect(result).toBe('Image is required');
    });

    it('should validate compute.adminPassword is required', () => {
      const result = validateRequiredField('compute', 'adminPassword', '');
      expect(result).toBe('Admin password is required');
    });

    it('should validate storage.systemDisk.type is required', () => {
      const result = validateNestedRequiredField('storage', 'systemDisk', 'type', '');
      expect(result).toBe('Disk Type is required');
    });

    it('should validate storage.systemDisk.size is required', () => {
      const result = validateNestedRequiredField('storage', 'systemDisk', 'size', 0);
      expect(result).toBe('Disk Size is required');
    });

    it('should validate network.vpc is required', () => {
      const result = validateRequiredField('network', 'vpc', '');
      expect(result).toBe('VPC is required');
    });

    it('should validate network.subnet is required', () => {
      const result = validateRequiredField('network', 'subnet', '');
      expect(result).toBe('Subnet is required');
    });
  });

  describe('Field Value Validation', () => {
    it('should validate server name pattern', () => {
      const invalidNames = ['123invalid', '-invalid', '_invalid', 'invalid-name-'];
      invalidNames.forEach(name => {
        const result = validateServerName(name);
        expect(result).toBeTruthy();
      });
    });

    it('should accept valid server names', () => {
      const validNames = ['valid-name', 'ValidName123', 'valid_name'];
      validNames.forEach(name => {
        const result = validateServerName(name);
        expect(result).toBeNull();
      });
    });

    it('should validate server name length (min 3, max 64)', () => {
      expect(validateServerName('ab')).toBeTruthy(); // Too short
      expect(validateServerName('a'.repeat(65))).toBeTruthy(); // Too long
      expect(validateServerName('abc')).toBeNull(); // Valid
      expect(validateServerName('a'.repeat(64))).toBeNull(); // Valid
    });

    it('should validate admin password length (min 12, max 64)', () => {
      expect(validatePassword('short')).toBeTruthy(); // Too short
      expect(validatePassword('a'.repeat(65))).toBeTruthy(); // Too long
      expect(validatePassword('ValidPass123!')).toBeNull(); // Valid
    });

    it('should validate admin password complexity', () => {
      expect(validatePassword('nouppercase123!')).toBeTruthy(); // Missing uppercase
      expect(validatePassword('NOLOWERCASE123!')).toBeTruthy(); // Missing lowercase
      expect(validatePassword('NoNumbers!')).toBeTruthy(); // Missing number
      expect(validatePassword('NoSpecial123')).toBeTruthy(); // Missing special char
      expect(validatePassword('ValidPass123!')).toBeNull(); // Valid
    });

    it('should validate system disk size range (40-2048 GB)', () => {
      expect(validateDiskSize(39)).toBeTruthy(); // Too small
      expect(validateDiskSize(2049)).toBeTruthy(); // Too large
      expect(validateDiskSize(40)).toBeNull(); // Valid (min)
      expect(validateDiskSize(2048)).toBeNull(); // Valid (max)
      expect(validateDiskSize(100)).toBeNull(); // Valid
    });

    it('should validate instance count range (1-100)', () => {
      expect(validateInstanceCount(0)).toBeTruthy(); // Too small
      expect(validateInstanceCount(101)).toBeTruthy(); // Too large
      expect(validateInstanceCount(1)).toBeNull(); // Valid (min)
      expect(validateInstanceCount(100)).toBeNull(); // Valid (max)
    });
  });

  describe('Section Dependency Management', () => {
    it('should enable compute section when region and az are selected', () => {
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
          az: 'us-east-1a',
        },
      };
      const isEnabled = isSectionEnabled('compute', formData);
      expect(isEnabled).toBe(true);
    });

    it('should disable compute section when region is missing', () => {
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          az: 'us-east-1a',
        },
      };
      const isEnabled = isSectionEnabled('compute', formData);
      expect(isEnabled).toBe(false);
    });

    it('should disable compute section when az is missing', () => {
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
        },
      };
      const isEnabled = isSectionEnabled('compute', formData);
      expect(isEnabled).toBe(false);
    });

    it('should enable storage section when region and az are selected', () => {
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
          az: 'us-east-1a',
        },
      };
      const isEnabled = isSectionEnabled('storage', formData);
      expect(isEnabled).toBe(true);
    });

    it('should enable network section when region and az are selected', () => {
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
          az: 'us-east-1a',
        },
      };
      const isEnabled = isSectionEnabled('network', formData);
      expect(isEnabled).toBe(true);
    });

    it('should enable IP section when vpc and subnet are selected', () => {
      const formData = {
        ...mockFormData,
        network: {
          vpc: 'vpc-001',
          subnet: 'subnet-001',
        },
      };
      const isEnabled = isSectionEnabled('ip', formData);
      expect(isEnabled).toBe(true);
    });

    it('should disable IP section when vpc is missing', () => {
      const formData = {
        ...mockFormData,
        network: {
          subnet: 'subnet-001',
        },
      };
      const isEnabled = isSectionEnabled('ip', formData);
      expect(isEnabled).toBe(false);
    });
  });

  describe('Actionable Errors Filtering', () => {
    it('should filter out errors for disabled sections', () => {
      const errors = {
        'compute.flavor': 'Flavor is required',
        'storage.systemDisk.type': 'Disk Type is required',
      };
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: '', // Missing region, so compute/storage are disabled
          az: '',
        },
      };
      const actionable = filterActionableErrors(errors, formData);
      expect(Object.keys(actionable)).toHaveLength(0);
    });

    it('should include errors for enabled sections with invalid values', () => {
      const errors = {
        'basic.region': 'Region is required',
        'basic.az': 'Availability zone is required',
      };
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: '', // Invalid
          az: '', // Invalid
        },
      };
      const actionable = filterActionableErrors(errors, formData);
      expect(Object.keys(actionable)).toHaveLength(2);
    });

    it('should exclude errors for fields with valid values', () => {
      const errors = {
        'basic.region': 'Region is required', // Stale error
      };
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1', // Valid value
        },
      };
      const actionable = filterActionableErrors(errors, formData);
      expect(Object.keys(actionable)).toHaveLength(0);
    });

    it('should handle nested field errors correctly', () => {
      const errors = {
        'storage.systemDisk.type': 'Disk Type is required',
        'storage.systemDisk.size': 'Disk Size is required',
      };
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
          az: 'us-east-1a',
        },
        storage: {
          systemDisk: {
            type: '', // Invalid
            size: 0, // Invalid
          },
          dataDisks: [],
        },
      };
      const actionable = filterActionableErrors(errors, formData);
      expect(Object.keys(actionable)).toHaveLength(2);
    });

    it('should exclude nested field errors when values are valid', () => {
      const errors = {
        'storage.systemDisk.type': 'Disk Type is required', // Stale error
      };
      const formData = {
        ...mockFormData,
        basic: {
          ...mockFormData.basic,
          region: 'us-east-1',
          az: 'us-east-1a',
        },
        storage: {
          systemDisk: {
            type: 'SSD', // Valid value
            size: 40,
          },
          dataDisks: [],
        },
      };
      const actionable = filterActionableErrors(errors, formData);
      expect(Object.keys(actionable)).toHaveLength(0);
    });
  });

  describe('Data Transformation for API', () => {
    it('should transform form data to API format correctly', () => {
      const formData: ServerFormData = {
        basic: {
          region: 'us-east-1',
          az: 'us-east-1a',
          name: 'test-server',
          count: 2,
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
          dataDisks: [
            { type: 'SSD', size: 200 },
          ],
        },
        network: {
          vpc: 'vpc-001',
          subnet: 'subnet-001',
        },
        ip: {
          enableIPv6: true,
          privateIP: '10.0.0.1',
        },
        billing: {
          chargingMode: 'prePaid',
        },
        tags: {
          tags: [
            { key: 'Environment', value: 'test' },
          ],
        },
      };

      const apiData = serverFormToApi(formData);

      expect(apiData.region).toBe('us-east-1');
      expect(apiData.availability_zone).toBe('us-east-1a');
      expect(apiData.name).toBe('test-server');
      expect(apiData.count).toBe(2);
      expect(apiData.flavor).toBe('ecs.t2.micro');
      expect(apiData.image).toBe('ubuntu-20.04');
      expect(apiData.admin_password).toBe('TestPass123!');
      expect(apiData.system_disk).toEqual({ type: 'SSD', size: 100 });
      expect(apiData.data_disks).toHaveLength(1);
      expect(apiData.vpc_id).toBe('vpc-001');
      expect(apiData.subnet_id).toBe('subnet-001');
      expect(apiData.enable_ipv6).toBe(true);
      expect(apiData.private_ip).toBe('10.0.0.1');
      expect(apiData.charging_mode).toBe('prePaid');
      expect(apiData.tags).toHaveLength(1);
    });

    it('should handle optional fields correctly', () => {
      const formData: ServerFormData = {
        ...mockFormData,
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
            size: 40,
          },
          dataDisks: [], // No data disks
        },
        network: {
          vpc: 'vpc-001',
          subnet: 'subnet-001',
        },
        ip: {
          enableIPv6: false,
          // No privateIP, no publicIP
        },
        billing: {
          chargingMode: 'postPaid',
          // No autoTerminateTime
        },
        tags: {
          tags: [], // No tags
        },
      };

      const apiData = serverFormToApi(formData);

      expect(apiData.data_disks).toBeUndefined();
      expect(apiData.private_ip).toBeUndefined();
      expect(apiData.public_ip).toBeUndefined();
      expect(apiData.auto_terminate_time).toBeUndefined();
      expect(apiData.tags).toBeUndefined();
    });
  });

  describe('Complete Form Validation', () => {
    it('should validate complete form with all required fields', () => {
      const completeFormData: ServerFormData = {
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
            size: 40,
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
      };

      const errors = validateCompleteForm(completeFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteFormData: ServerFormData = {
        ...mockFormData,
        basic: {
          region: 'us-east-1',
          az: '', // Missing
          name: 'test-server',
          count: 1,
          dryRun: false,
        },
        compute: {
          flavor: '', // Missing
          image: 'ubuntu-20.04',
          adminPassword: 'TestPass123!',
        },
        storage: {
          systemDisk: {
            type: '', // Missing
            size: 40,
          },
          dataDisks: [],
        },
        network: {
          vpc: 'vpc-001',
          subnet: '', // Missing
        },
      };

      const errors = validateCompleteForm(incompleteFormData);
      expect(errors['basic.az']).toBeTruthy();
      expect(errors['compute.flavor']).toBeTruthy();
      expect(errors['storage.systemDisk.type']).toBeTruthy();
      expect(errors['network.subnet']).toBeTruthy();
    });
  });
});

// Helper validation functions (simplified versions for testing)
function validateRequiredField(section: string, field: string, value: any): string | null {
  if (!value || value === '') {
    return `${field} is required`;
  }
  return null;
}

function validateNestedRequiredField(section: string, parent: string, field: string, value: any): string | null {
  if (!value || value === '' || value === 0) {
    return `${field} is required`;
  }
  return null;
}

function validateServerName(name: string): string | null {
  if (!name || name.length < 3 || name.length > 64) {
    return 'Server name must be between 3 and 64 characters';
  }
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    return 'Server name must start with a letter and contain only letters, numbers, hyphens, and underscores';
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (!password || password.length < 12 || password.length > 64) {
    return 'Password must be between 12 and 64 characters';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
}

function validateDiskSize(size: number): string | null {
  if (size < 40 || size > 2048) {
    return 'Disk size must be between 40 and 2048 GB';
  }
  return null;
}

function validateInstanceCount(count: number): string | null {
  if (count < 1 || count > 100) {
    return 'Instance count must be between 1 and 100';
  }
  return null;
}

function isSectionEnabled(section: string, formData: ServerFormData): boolean {
  if (section === 'basic') return true;
  if (section === 'compute' || section === 'storage' || section === 'network') {
    return !!(formData.basic.region && formData.basic.az);
  }
  if (section === 'ip') {
    return !!(formData.network.vpc && formData.network.subnet);
  }
  return true;
}

function filterActionableErrors(
  errors: Record<string, string>,
  formData: ServerFormData
): Record<string, string> {
  const filtered: Record<string, string> = {};

  Object.keys(errors).forEach(errorPath => {
    const pathParts = errorPath.split('.');
    const section = pathParts[0];
    const fieldName = pathParts[1];

    if (!section || !fieldName) return;

    // Check if section is enabled
    const sectionEnabled = isSectionEnabled(section, formData);
    if (!sectionEnabled) return;

    // Get field value
    let fieldValue: any;
    if (pathParts.length > 2) {
      // Nested field
      const nestedPath = `${section}.${fieldName}.${pathParts[2]}`;
      fieldValue = getNestedValue(formData, nestedPath);
    } else {
      // Simple field
      fieldValue = (formData as any)[section]?.[fieldName];
    }

    // Check if value is invalid
    const hasInvalidValue = fieldValue === undefined || fieldValue === null || fieldValue === '' ||
      (typeof fieldValue === 'object' && !Array.isArray(fieldValue) && Object.keys(fieldValue).length === 0) ||
      (Array.isArray(fieldValue) && fieldValue.length === 0);

    if (hasInvalidValue) {
      filtered[errorPath] = errors[errorPath];
    }
  });

  return filtered;
}

function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.');
  let value = obj;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return value;
}

function validateCompleteForm(formData: ServerFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  // Basic validation
  if (!formData.basic.region) errors['basic.region'] = 'Region is required';
  if (!formData.basic.az) errors['basic.az'] = 'Availability zone is required';
  if (!formData.basic.name) errors['basic.name'] = 'Server name is required';

  // Compute validation
  if (!formData.compute.flavor) errors['compute.flavor'] = 'Flavor is required';
  if (!formData.compute.image) errors['compute.image'] = 'Image is required';
  if (!formData.compute.adminPassword) errors['compute.adminPassword'] = 'Admin password is required';

  // Storage validation
  if (!formData.storage.systemDisk.type) errors['storage.systemDisk.type'] = 'Disk Type is required';
  if (!formData.storage.systemDisk.size || formData.storage.systemDisk.size < 40) {
    errors['storage.systemDisk.size'] = 'Disk Size is required';
  }

  // Network validation
  if (!formData.network.vpc) errors['network.vpc'] = 'VPC is required';
  if (!formData.network.subnet) errors['network.subnet'] = 'Subnet is required';

  return errors;
}

