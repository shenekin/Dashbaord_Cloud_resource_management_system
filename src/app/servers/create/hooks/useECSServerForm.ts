'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useFormEngine } from '@/hooks/useFormEngine';
import { loadServerFormConfig } from '@/utils/schemaLoader';
import { ServerFormData } from '@/types/server';
import { generateServerName, generateSecurePassword } from '@/lib/utils';

const initialFormData: ServerFormData = {
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

/**
 * ECS Server Form Hook
 * Uses form engine to manage form state, validation, and dependencies
 */
export function useECSServerForm() {
  const config = useMemo(() => loadServerFormConfig(), []);

  const {
    formData,
    errors,
    touched,
    updateField,
    updateSection,
    validate,
    reset,
    getFieldValue,
    getFieldConfig,
    isFieldEnabled,
    getContextValue,
    getMaxValue,
  } = useFormEngine<ServerFormData>(initialFormData, config);

  // Track if initial values have been generated to prevent regeneration on re-renders
  const hasGeneratedInitialValues = useRef(false);

  /**
   * Auto-generate server name and password on component mount
   * These values are generated instantly without API calls
   * Users can modify or regenerate them later
   */
  useEffect(() => {
    if (hasGeneratedInitialValues.current) {
      return;
    }

    // Only generate if values are empty (not already set)
    if (!formData.basic.name) {
      const generatedServerName = generateServerName();
      updateField('basic', 'name', generatedServerName);
    }

    if (!formData.compute.adminPassword) {
      const generatedPassword = generateSecurePassword(16);
      updateField('compute', 'adminPassword', generatedPassword);
    }

    hasGeneratedInitialValues.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to update section data (maintains backward compatibility)
  const updateFormData = <K extends keyof ServerFormData>(
    section: K,
    data: Partial<ServerFormData[K]>
  ) => {
    updateSection(section, data);
  };

  // Reset downstream sections when upstream changes
  const resetDownstreamSections = (changedSection: string, changedField: string) => {
    const sectionSchema = config.sections.find(s => s.section === changedSection);
    if (!sectionSchema) return;

    const fieldSchema = sectionSchema.fields.find(f => f.name === changedField);
    if (!fieldSchema || !fieldSchema.dependencies?.onChange?.reset) return;

    // Reset fields in the same section
    fieldSchema.dependencies.onChange.reset.forEach(resetField => {
      const fieldConfig = getFieldConfig(changedSection, resetField);
      if (fieldConfig) {
        const defaultValue = fieldConfig.default ?? 
          (fieldConfig.type === 'string' ? '' : 
           fieldConfig.type === 'integer' ? 0 : 
           fieldConfig.type === 'boolean' ? false : 
           fieldConfig.type === 'array' ? [] : {});
        updateField(changedSection, resetField, defaultValue);
      }
    });

    // Reset dependent sections
    // Check all sections for dependencies on the changed field
    config.sections.forEach(section => {
      if (section.section === changedSection) return; // Already handled above
      
      section.fields.forEach(field => {
        if (field.dependsOn?.includes(`${changedSection}.${changedField}`)) {
          // Reset this field
          const defaultValue = field.default ?? 
            (field.type === 'string' ? '' : 
             field.type === 'integer' ? 0 : 
             field.type === 'boolean' ? false : 
             field.type === 'array' ? [] : {});
          updateField(section.section, field.name, defaultValue);
        }
      });
    });
  };

  return {
    formData,
    errors,
    touched,
    updateFormData,
    updateField,
    updateSection,
    validate,
    reset,
    getFieldValue,
    getFieldConfig,
    isFieldEnabled,
    getContextValue,
    getMaxValue,
    resetDownstreamSections,
    config,
  };
}

