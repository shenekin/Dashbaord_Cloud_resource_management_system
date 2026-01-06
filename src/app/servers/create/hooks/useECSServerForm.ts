'use client';

import { useMemo } from 'react';
import { useFormEngine } from '@/hooks/useFormEngine';
import { loadServerFormConfig } from '@/utils/schemaLoader';
import { ServerFormData } from '@/types/server';

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

