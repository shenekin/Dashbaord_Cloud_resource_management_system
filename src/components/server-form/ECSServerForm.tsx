'use client';

import { useECSServerForm } from '@/app/servers/create/hooks/useECSServerForm';
import { useServerSubmit } from '@/app/servers/create/hooks/useServerSubmit';
import BasicInfoSection from '@/components/server-form/sections/BasicInfoSection';
import ComputeImageSection from '@/components/server-form/sections/ComputeImageSection';
import StorageSection from '@/components/server-form/sections/StorageSection';
import NetworkSection from '@/components/server-form/sections/NetworkSection';
import IPPublicSection from '@/components/server-form/sections/IPPublicSection';
import BillingLifecycleSection from '@/components/server-form/sections/BillingLifecycleSection';
import AdvancedSection from '@/components/server-form/sections/AdvancedSection';

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
    updateFormData,
    validate,
    resetDownstreamSections,
    isFieldEnabled,
  } = useECSServerForm();

  const { loading: submitLoading, error: submitError, submit } = useServerSubmit();

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

  // Handle submit
  const handleSubmit = async () => {
    if (validate()) {
      await submit(formData);
    }
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
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800 font-medium">
                    Please fix validation errors before submitting
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading || Object.keys(errors).length > 0}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Server
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

