'use client';

import { useCreateServerForm } from './hooks/useCreateServerForm';
import { useServerDryRun } from './hooks/useServerDryRun';
import { useServerSubmit } from './hooks/useServerSubmit';
import BasicInfoSection from '@/components/server-form/sections/BasicInfoSection';
import ComputeImageSection from '@/components/server-form/sections/ComputeImageSection';
import StorageSection from '@/components/server-form/sections/StorageSection';
import NetworkSection from '@/components/server-form/sections/NetworkSection';
import IPPublicSection from '@/components/server-form/sections/IPPublicSection';
import BillingLifecycleSection from '@/components/server-form/sections/BillingLifecycleSection';
import AdvancedSection from '@/components/server-form/sections/AdvancedSection';
import ReviewDryRunSection from '@/components/server-form/sections/ReviewDryRunSection';

/**
 * Create Server Form Component
 * Main form component for creating server instances
 */
export default function CreateServerForm() {
  const { formData, errors, updateFormData, validate } = useCreateServerForm();
  const { loading: dryRunLoading, result: dryRunResult, dryRun } = useServerDryRun();
  const { loading: submitLoading, error: submitError, submit } = useServerSubmit();

  const handleDryRun = async () => {
    if (validate()) {
      await dryRun(formData);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      await submit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <BasicInfoSection
        data={formData.basic}
        errors={errors}
        onChange={(data) => updateFormData('basic', data)}
      />
      
      <ComputeImageSection
        data={formData.compute}
        errors={errors}
        onChange={(data) => updateFormData('compute', data)}
      />
      
      <StorageSection
        data={formData.storage}
        errors={errors}
        onChange={(data) => updateFormData('storage', data)}
      />
      
      <NetworkSection
        data={formData.network}
        errors={errors}
        onChange={(data) => updateFormData('network', data)}
      />
      
      <IPPublicSection
        data={formData.ip}
        errors={errors}
        onChange={(data) => updateFormData('ip', data)}
      />
      
      <BillingLifecycleSection
        data={formData.billing}
        errors={errors}
        onChange={(data) => updateFormData('billing', data)}
      />
      
      <AdvancedSection
        data={formData.tags}
        errors={errors}
        onChange={(data) => updateFormData('tags', data)}
      />
      
      <ReviewDryRunSection
        formData={formData}
        dryRunResult={dryRunResult}
        dryRunLoading={dryRunLoading}
        onDryRun={handleDryRun}
        onSubmit={handleSubmit}
        submitLoading={submitLoading}
        submitError={submitError}
      />
    </div>
  );
}

