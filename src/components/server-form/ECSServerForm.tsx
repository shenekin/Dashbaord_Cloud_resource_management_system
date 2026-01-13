'use client';

import { useState, useMemo } from 'react';
import { useECSServerForm } from '@/app/servers/create/hooks/useECSServerForm';
import { useServerSubmit } from '@/app/servers/create/hooks/useServerSubmit';
import BasicInfoSection from '@/components/server-form/sections/BasicInfoSection';
import ComputeImageSection from '@/components/server-form/sections/ComputeImageSection';
import StorageSection from '@/components/server-form/sections/StorageSection';
import NetworkSection from '@/components/server-form/sections/NetworkSection';
import IPPublicSection from '@/components/server-form/sections/IPPublicSection';
import BillingLifecycleSection from '@/components/server-form/sections/BillingLifecycleSection';
import AdvancedSection from '@/components/server-form/sections/AdvancedSection';
import ReviewDryRunSection from '@/components/server-form/sections/ReviewDryRunSection';
import { createLogger } from '@/lib/logger';

const ecsLogger = createLogger('ecs');

/**
 * ECS Server Form Component
 * 
 * Comprehensive form for creating ECS (Elastic Cloud Server) instances with:
 * - Controlled components using form engine
 * - Dependency management (region → AZ → network, etc.)
 * - Required field enforcement
 * - Illegal transition prevention
 * - Submit flow
 * 
 * Context: Identity + Project + Quota
 */
export default function ECSServerForm() {
  const {
    formData,
    errors,
    touched,
    updateFormData,
    validate,
    reset,
    resetDownstreamSections,
    isFieldEnabled,
    getFieldConfig,
    getFieldValue,
  } = useECSServerForm();

  const { loading: submitLoading, error: submitError, submit } = useServerSubmit();
  const [showReview, setShowReview] = useState(false);

  // Handle section change with dependency reset
  const handleSectionChange = <K extends keyof typeof formData>(
    section: K,
    data: Partial<typeof formData[K]>
  ) => {
    // Update the section
    updateFormData(section, data);

    // Check if any field change requires downstream reset
    Object.keys(data).forEach(fieldName => {
      resetDownstreamSections(section, fieldName);
    });
  };

  /**
   * Handle review button click
   * Shows review section before submission
   * Uses actionableErrors to determine if form is valid (only checks enabled required fields)
   */
  const handleReview = () => {
    ecsLogger.info('Review button clicked - validating form');
    
    // Run validation to update errors
    validate();
    
    // Check actionable errors (only enabled required fields)
    const hasActionableErrors = Object.keys(actionableErrors).length > 0;
    
    if (!hasActionableErrors) {
      ecsLogger.info('Form validation passed - showing review section', {
        serverName: formData.basic.name,
        region: formData.basic.region,
        availabilityZone: formData.basic.az,
        instanceType: formData.compute.flavor,
        image: formData.compute.image,
      });
      setShowReview(true);
    } else {
      ecsLogger.debug('Form validation failed', {
        errorCount: Object.keys(errors).length,
        actionableErrors: Object.keys(actionableErrors).length,
        actionableErrorDetails: Object.keys(actionableErrors).map(key => ({
          field: key,
          message: actionableErrors[key],
        })),
      });
    }
  };

  /**
   * Handle submit from review section
   * Submits the form after user confirms in review
   * Resets form after successful submission
   */
  const handleSubmit = async () => {
    ecsLogger.info('Submit confirmed from review section');
    
    // Run validation to update errors
    validate();
    
    // Check actionable errors (only enabled required fields)
    const hasActionableErrors = Object.keys(actionableErrors).length > 0;
    
    if (!hasActionableErrors) {
      ecsLogger.info('Final validation passed - submitting form', {
        serverName: formData.basic.name,
        instanceCount: formData.basic.count,
        formDataSummary: {
          region: formData.basic.region,
          availabilityZone: formData.basic.az,
          instanceType: formData.compute.flavor,
          image: formData.compute.image,
          systemDisk: formData.storage.systemDisk,
          network: {
            vpc: formData.network.vpc,
            subnet: formData.network.subnet,
          },
        },
      });
      
      // Store form data before submission for logging
      const submittedFormData = { ...formData };
      
      const result = await submit(formData);
      
      // Reset form only after successful submission
      if (result?.success) {
        ecsLogger.info('Form reset after successful submission');
        reset();
        setShowReview(false);
      } else {
        ecsLogger.debug('Submission failed - form not reset', {
          error: result?.error || 'Unknown error',
        });
      }
    } else {
      ecsLogger.debug('Final validation failed - submission blocked', {
        errorCount: Object.keys(errors).length,
        actionableErrors: Object.keys(actionableErrors).length,
        actionableErrorDetails: Object.keys(actionableErrors).map(key => ({
          field: key,
          message: actionableErrors[key],
        })),
      });
    }
  };

  /**
   * Handle cancel review
   * Hides review section and returns to form
   */
  const handleCancelReview = () => {
    setShowReview(false);
  };

  // Check if section can be enabled (all dependencies met)
  const isSectionEnabled = (section: string): boolean => {
    // Basic section is always enabled
    if (section === 'basic') return true;

    // Compute depends on basic (region, AZ)
    if (section === 'compute') {
      return !!(formData.basic.region && formData.basic.az);
    }

    // Storage depends on basic (region, AZ)
    if (section === 'storage') {
      return !!(formData.basic.region && formData.basic.az);
    }

    // Network depends on basic (region, AZ)
    if (section === 'network') {
      return !!(formData.basic.region && formData.basic.az);
    }

    // IP depends on network (VPC, subnet)
    if (section === 'ip') {
      return !!(formData.network.vpc && formData.network.subnet);
    }

    // Billing and tags are always enabled
    return true;
  };

  /**
   * Filter errors to only show actionable validation errors that block submission.
   * An error blocks submission if:
   * 1. The field is required (according to schema)
   * 2. AND the section containing the field is enabled (dependencies met)
   * 3. AND the field is enabled (not disabled, dependencies met)
   * 4. OR the field has been touched by the user (show feedback even if optional)
   * 
   * This prevents showing errors for:
   * - Disabled fields that the user cannot yet interact with
   * - Optional fields that shouldn't block submission
   * 
   * Note: Handles field name mapping between schema (availabilityZone) and form data (az).
   * 
   * Memoized to avoid recalculating on every render.
   */
  const actionableErrors = useMemo(() => {
    const filtered: Record<string, string> = {};
    
    Object.keys(errors).forEach(errorPath => {
      const pathParts = errorPath.split('.');
      const section = pathParts[0];
      const schemaFieldName = pathParts[1];
      
      // Skip if we can't parse the path
      if (!section || !schemaFieldName) {
        return;
      }
      
      // Handle nested field paths (e.g., "storage.systemDisk.type")
      const isNestedPath = pathParts.length > 2;
      let isRequired = false;
      let parentFieldEnabled = true;
      
      if (isNestedPath) {
        // For nested paths like "storage.systemDisk.type":
        // - Check if parent object field (systemDisk) is required and enabled
        // - Nested properties of required parent objects are treated as required
        // - Known required nested fields: systemDisk.type, systemDisk.size
        const parentFieldConfig = getFieldConfig(section, schemaFieldName);
        const parentRequired = parentFieldConfig?.required ?? false;
        
        // Check if this is a known required nested property
        // According to schema: systemDisk has required properties (type, size)
        const nestedFieldName = pathParts[2];
        const isKnownRequiredNested = 
          schemaFieldName === 'systemDisk' && (nestedFieldName === 'type' || nestedFieldName === 'size');
        
        isRequired = parentRequired && isKnownRequiredNested;
        // For nested fields, check if parent object field is enabled
        parentFieldEnabled = isFieldEnabled(section, schemaFieldName);
      } else {
        // For simple paths like "basic.region", "network.vpc", "network.subnet":
        const fieldConfig = getFieldConfig(section, schemaFieldName);
        isRequired = fieldConfig?.required ?? false;
      }
      
      // Map schema field names to form data field names
      // Schema uses "availabilityZone" but form data uses "az"
      const formDataFieldName = schemaFieldName === 'availabilityZone' ? 'az' : schemaFieldName;
      
      // Check if section is enabled (inline check to avoid dependency issues)
      let sectionEnabled = false;
      if (section === 'basic') {
        sectionEnabled = true;
      } else if (section === 'compute' || section === 'storage' || section === 'network') {
        sectionEnabled = !!(formData.basic.region && formData.basic.az);
      } else if (section === 'ip') {
        sectionEnabled = !!(formData.network.vpc && formData.network.subnet);
      } else {
        sectionEnabled = true; // billing, tags, etc.
      }
      
      // Check if field is enabled (only if section is enabled)
      // For nested fields, we already checked parentFieldEnabled above
      // For simple fields, check if the field itself is enabled
      const fieldEnabled = isNestedPath 
        ? (sectionEnabled && parentFieldEnabled)
        : (sectionEnabled && isFieldEnabled(section, schemaFieldName));
      
      // Verify the field actually has an invalid value
      // This handles cases where errors might persist even after fields are filled
      // (e.g., when nested fields are updated but validation hasn't run yet)
      let fieldValue: any;
      if (isNestedPath) {
        // For nested paths like "storage.systemDisk.type", get value from nested path
        const nestedPath = `${section}.${schemaFieldName}.${pathParts[2]}`;
        fieldValue = getFieldValue(nestedPath);
      } else {
        // For simple paths, use the error path directly
        const formDataPath = `${section}.${formDataFieldName}`;
        fieldValue = getFieldValue(formDataPath);
      }
      
      // Check if field has invalid value (empty, null, undefined, or empty object/array)
      const hasInvalidValue = fieldValue === undefined || fieldValue === null || fieldValue === '' || 
        (typeof fieldValue === 'object' && !Array.isArray(fieldValue) && Object.keys(fieldValue).length === 0) ||
        (Array.isArray(fieldValue) && fieldValue.length === 0);
      
      // Only include error if it blocks submission:
      // - Field is required AND section is enabled AND field is enabled AND field has invalid value
      // This ensures only required fields with actual invalid values block submission.
      // Optional fields can have validation errors shown inline but won't block the button.
      if (isRequired && sectionEnabled && fieldEnabled && hasInvalidValue) {
        filtered[errorPath] = errors[errorPath];
      }
    });
    
    return filtered;
  }, [errors, formData, formData.basic.region, formData.basic.az, formData.network.vpc, formData.network.subnet, isFieldEnabled, getFieldConfig, getFieldValue]);

  return (
    <div className="space-y-3">
      {/* Basic Information Section */}
      <div id="step-basic" className={!isSectionEnabled('basic') ? 'opacity-50 pointer-events-none' : ''}>
        <BasicInfoSection
          value={formData.basic}
          onChange={(data) => handleSectionChange('basic', data)}
          errors={errors}
          onResetDownstream={() => {
            // Reset compute, storage, network when basic info changes
            handleSectionChange('compute', { flavor: '', image: '', adminPassword: '' });
            handleSectionChange('storage', { 
              systemDisk: { type: '', size: 40 },
              dataDisks: []
            });
            handleSectionChange('network', { vpc: '', subnet: '' });
          }}
        />
      </div>

      {/* Compute & Image Section */}
      <div id="step-compute" className={!isSectionEnabled('compute') ? 'opacity-50 pointer-events-none' : ''}>
        <ComputeImageSection
          value={formData.compute}
          onChange={(data) => handleSectionChange('compute', data)}
          errors={errors}
          region={formData.basic.region}
          availabilityZone={formData.basic.az}
          disabled={!isSectionEnabled('compute')}
        />
      </div>

      {/* Storage Section */}
      <div id="step-storage" className={!isSectionEnabled('storage') ? 'opacity-50 pointer-events-none' : ''}>
        <StorageSection
          value={formData.storage}
          onChange={(data) => handleSectionChange('storage', data)}
          errors={errors}
          region={formData.basic.region}
          availabilityZone={formData.basic.az}
          disabled={!isSectionEnabled('storage')}
        />
      </div>

      {/* Network Section */}
      <div id="step-network" className={!isSectionEnabled('network') ? 'opacity-50 pointer-events-none' : ''}>
        <NetworkSection
          value={formData.network}
          onChange={(data) => handleSectionChange('network', data)}
          errors={errors}
          region={formData.basic.region}
          availabilityZone={formData.basic.az}
          disabled={!isSectionEnabled('network')}
          onResetDownstream={() => {
            // Reset IP section when network changes
            handleSectionChange('ip', { enableIPv6: false });
          }}
        />
      </div>

      {/* IP & Public IP Section */}
      <div id="step-ip" className={!isSectionEnabled('ip') ? 'opacity-50 pointer-events-none' : ''}>
        <IPPublicSection
          value={formData.ip}
          onChange={(data) => handleSectionChange('ip', data)}
          errors={errors}
          disabled={!isSectionEnabled('ip')}
        />
      </div>

      {/* Billing & Lifecycle Section */}
      <div id="step-billing">
        <BillingLifecycleSection
          value={formData.billing}
          onChange={(data) => handleSectionChange('billing', data)}
          errors={errors}
        />
      </div>

      {/* Advanced Section (Tags) */}
      <div id="step-advanced">
        <AdvancedSection
          value={formData.tags}
          onChange={(data) => handleSectionChange('tags', data)}
          errors={errors}
        />
      </div>

      {/* Review Section - Show before submission */}
      {showReview && (
        <div id="step-review">
          <ReviewDryRunSection
            formData={formData}
            onConfirm={handleSubmit}
            onCancel={handleCancelReview}
            loading={submitLoading}
          />
        </div>
      )}

      {/* Submit Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 font-medium">
                    {submitError}
                  </p>
                </div>
              )}
              {Object.keys(actionableErrors).length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 font-medium">
                    Please fix validation errors before submitting
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {!showReview ? (
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={Object.keys(actionableErrors).length > 0}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Review & Create Server
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

