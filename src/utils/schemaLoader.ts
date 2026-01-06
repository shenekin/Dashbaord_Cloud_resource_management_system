/**
 * Schema Loader Utility
 * Loads and parses JSON schema files for form engine
 */

import basicInfoSchema from '@/components/server-form/sections/basicinfosection.json';
import computeSchema from '@/components/server-form/sections/Compute.json';
import storageSchema from '@/components/server-form/sections/Storage.json';
import networkSchema from '@/components/server-form/sections/Network.json';
import { FormEngineConfig, SectionSchema } from '@/hooks/useFormEngine';

/**
 * Load form engine configuration for server resource type
 */
export function loadServerFormConfig(): FormEngineConfig {
  return {
    resourceType: 'server',
    sections: [
      basicInfoSchema as SectionSchema,
      computeSchema as SectionSchema,
      storageSchema as SectionSchema,
      networkSchema as SectionSchema,
    ],
  };
}

/**
 * Get section schema by name
 */
export function getSectionSchema(config: FormEngineConfig, sectionName: string): SectionSchema | undefined {
  return config.sections.find(s => s.section === sectionName);
}

