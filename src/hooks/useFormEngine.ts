'use client';

import { useState, useCallback, useMemo } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useIdentity } from '@/contexts/IdentityContext';
import { ServerFormData } from '@/types/server';

export interface FieldSchema {
  name: string;
  label: string;
  type: 'string' | 'integer' | 'boolean' | 'object' | 'array';
  component: 'select' | 'text' | 'number' | 'switch' | 'textarea' | 'date';
  required?: boolean;
  default?: any;
  min?: number;
  max?: number | { source: string; sourcePath: string };
  placeholder?: string;
  ariaLabel?: string;
  description?: string;
  source?: 'context' | 'api';
  sourcePath?: string;
  dependsOn?: string[];
  disabled?: {
    when: string;
  };
  dependencies?: {
    onChange?: {
      reset?: string[];
    };
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    quota?: {
      resourceType: string;
      source: string;
      sourcePath: string;
    };
  };
  enum?: any[];
}

export interface SectionSchema {
  section: string;
  title: string;
  fields: FieldSchema[];
}

export interface FormEngineConfig {
  resourceType: string;
  sections: SectionSchema[];
}

/**
 * Form Engine Hook
 * 
 * Manages form state, validation, dependencies, and field enabling/disabling
 * based on JSON schemas and context (Identity, Project, Quota)
 */
export function useFormEngine<T extends Record<string, any>>(
  initialData: T,
  config: FormEngineConfig
) {
  const { project } = useProject();
  const { identity } = useIdentity();
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get context value by path (e.g., "project.quota.instanceCount")
  const getContextValue = useCallback((path: string): any => {
    const parts = path.split('.');
    let value: any = { project, identity };
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  }, [project, identity]);

  // Check if field should be disabled
  const isFieldDisabled = useCallback((field: FieldSchema): boolean => {
    if (!field.disabled) return false;
    
    const condition = field.disabled.when;
    // Simple condition parser (supports !fieldName)
    if (condition.startsWith('!')) {
      const fieldName = condition.slice(1);
      const value = getFieldValue(fieldName);
      return !value || value === '';
    }
    
    return false;
  }, []);

  // Get field value by path (supports nested paths like "basic.region")
  const getFieldValue = useCallback((path: string): any => {
    const parts = path.split('.');
    let value: any = formData;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  }, [formData]);

  // Check if field dependencies are met
  const areDependenciesMet = useCallback((field: FieldSchema): boolean => {
    if (!field.dependsOn || field.dependsOn.length === 0) return true;
    
    return field.dependsOn.every(dep => {
      const value = getFieldValue(dep);
      return value !== undefined && value !== null && value !== '';
    });
  }, [getFieldValue]);

  // Get max value for field (from context or static)
  const getMaxValue = useCallback((field: FieldSchema): number | undefined => {
    if (typeof field.max === 'number') return field.max;
    if (field.max && typeof field.max === 'object' && field.max.source === 'context') {
      return getContextValue(field.max.sourcePath) as number;
    }
    return undefined;
  }, [getContextValue]);

  // Validate single field
  const validateField = useCallback((field: FieldSchema, value: any): string | null => {
    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`;
    }

    // Skip further validation if field is empty and not required
    if (!field.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // Type-specific validation
    if (field.type === 'string') {
      if (field.validation?.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be at most ${field.validation.maxLength} characters`;
      }
    }

    if (field.type === 'integer') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field.label} must be a number`;
      }
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      const maxValue = getMaxValue(field);
      if (maxValue !== undefined && numValue > maxValue) {
        return `${field.label} exceeds quota (max: ${maxValue})`;
      }
    }

    return null;
  }, [getMaxValue]);

  // Validate all fields
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldPath = `${section.section}.${field.name}`;
        const value = getFieldValue(fieldPath);
        const error = validateField(field, value);
        
        if (error) {
          newErrors[fieldPath] = error;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config, getFieldValue, validateField]);

  // Update field value
  const updateField = useCallback((section: string, fieldName: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev } as Record<string, any>;
      if (!newData[section]) {
        newData[section] = {};
      }
      newData[section] = {
        ...(newData[section] as Record<string, any>),
        [fieldName]: value,
      };
      return newData as T;
    });

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [`${section}.${fieldName}`]: true,
    }));

    // Validate field immediately
    const sectionSchema = config.sections.find(s => s.section === section);
    if (sectionSchema) {
      const fieldSchema = sectionSchema.fields.find(f => f.name === fieldName);
      if (fieldSchema) {
        const fieldPath = `${section}.${fieldName}`;
        const error = validateField(fieldSchema, value);
        
        setErrors(prev => {
          if (error) {
            return { ...prev, [fieldPath]: error };
          } else {
            const { [fieldPath]: _, ...rest } = prev;
            return rest;
          }
        });

        // Handle dependencies - reset dependent fields
        if (fieldSchema.dependencies?.onChange?.reset) {
          fieldSchema.dependencies.onChange.reset.forEach(resetField => {
            setFormData(prev => {
              const newData = { ...prev } as Record<string, any>;
              if (newData[section]) {
                newData[section] = {
                  ...(newData[section] as Record<string, any>),
                  [resetField]: fieldSchema.type === 'string' ? '' : fieldSchema.type === 'integer' ? 0 : false,
                };
              }
              return newData as T;
            });
          });
        }
      }
    }
  }, [config, validateField]);

  // Update section data
  const updateSection = useCallback((section: string, data: Partial<any>) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));

    // Validate all fields in section
    const sectionSchema = config.sections.find(s => s.section === section);
    if (sectionSchema) {
      sectionSchema.fields.forEach(field => {
        const fieldPath = `${section}.${field.name}`;
        const value = getFieldValue(fieldPath);
        const error = validateField(field, value);
        
        setErrors(prev => {
          if (error) {
            return { ...prev, [fieldPath]: error };
          } else {
            const { [fieldPath]: _, ...rest } = prev;
            return rest;
          }
        });
      });
    }
  }, [config, getFieldValue, validateField]);

  // Get field configuration
  const getFieldConfig = useCallback((section: string, fieldName: string): FieldSchema | undefined => {
    const sectionSchema = config.sections.find(s => s.section === section);
    return sectionSchema?.fields.find(f => f.name === fieldName);
  }, [config]);

  // Check if field is enabled
  const isFieldEnabled = useCallback((section: string, fieldName: string): boolean => {
    const fieldConfig = getFieldConfig(section, fieldName);
    if (!fieldConfig) return true;
    
    if (isFieldDisabled(fieldConfig)) return false;
    if (!areDependenciesMet(fieldConfig)) return false;
    
    return true;
  }, [getFieldConfig, isFieldDisabled, areDependenciesMet]);

  // Reset form
  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
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
  };
}

