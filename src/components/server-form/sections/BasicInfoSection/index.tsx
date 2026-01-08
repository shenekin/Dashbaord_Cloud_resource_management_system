'use client';

import { useState, useEffect } from 'react';
import { BasicInfo } from '@/types/server';
import { credentialsApi, Credential } from '@/services/credentialsApi';
import RegionSelector from './RegionSelector';
import AZSelector from './AZSelector';
import ServerNameInput from './ServerNameInput';
import InstanceCountInput from './InstanceCountInput';
import DryRunSwitch from './DryRunSwitch';

/**
 * BasicInfoSection Component
 * 
 * Controlled component for basic server information form section.
 * 
 * Props (new API):
 * - value: Current form values (region, az, name, count, dryRun)
 * - onChange: Callback when any field changes
 * - errors?: Validation errors object
 * - onResetDownstream?: Optional callback to reset downstream sections
 * 
 * Props (legacy API - for backward compatibility):
 * - data: Current form values (same as value)
 * 
 * Features:
 * - Region loads dynamically from ProjectContext
 * - AvailabilityZone depends on selected Region
 * - Count respects Project quota
 * - DryRun defaults to true (optional)
 * - Resets downstream sections on Region/AZ change
 * - No API calls inside component
 * - Accessible UI with proper labels and ARIA attributes
 * - Loading states while options are fetching
 */
export interface BasicInfoSectionProps {
  value?: BasicInfo;
  onChange: (value: Partial<BasicInfo>) => void;
  errors?: Record<string, string>;
  onResetDownstream?: () => void;
  // Legacy props for backward compatibility
  data?: BasicInfo;
}

export default function BasicInfoSection({ 
  value,
  onChange, 
  errors = {},
  onResetDownstream,
  data // Legacy prop
}: BasicInfoSectionProps) {
  // Support both new API (value) and legacy API (data)
  const formValue = value || data || {
    customer: '',
    provider: '',
    credentialId: '',
    region: '',
    az: '',
    name: '',
    count: 1,
    dryRun: true,
  };

  // State for credentials management
  const [allCredentials, setAllCredentials] = useState<Credential[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState<string[]>([]);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);

  // Load all credentials on mount to extract customers and providers
  useEffect(() => {
    const loadCredentials = async () => {
      setLoadingCredentials(true);
      try {
        const response = await credentialsApi.getCredentials();
        const credentials = response.items || [];
        setAllCredentials(credentials);
        
        // Extract unique customers and providers from saved credentials
        const customers = Array.from(new Set(credentials.map(c => c.customer))).filter(Boolean);
        const providers = Array.from(new Set(credentials.map(c => c.provider))).filter(Boolean);
        
        setAvailableCustomers(customers);
        setAvailableProviders(providers);
      } catch (err) {
        console.error('Failed to load credentials:', err);
        setAvailableCustomers([]);
        setAvailableProviders([]);
      } finally {
        setLoadingCredentials(false);
      }
    };

    loadCredentials();
  }, []);

  // Filter credentials when customer or provider changes
  useEffect(() => {
    if (formValue.customer && formValue.provider) {
      const filtered = allCredentials.filter(
        c => c.customer === formValue.customer && c.provider === formValue.provider
      );
      setFilteredCredentials(filtered);
      
      // Reset credential selection if current credential is not in filtered list
      if (formValue.credentialId && !filtered.some(c => c.id === formValue.credentialId)) {
        onChange({ credentialId: '' });
      }
    } else {
      setFilteredCredentials([]);
      onChange({ credentialId: '' });
    }
  }, [formValue.customer, formValue.provider, allCredentials, formValue.credentialId, onChange]);

  // Handle customer change - reset provider, credential, region, and downstream
  const handleCustomerChange = (customer: string) => {
    onChange({ 
      customer,
      provider: '', // Reset provider
      credentialId: '', // Reset credential
      region: '', // Reset region
      az: '', // Reset AZ
    });
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Handle provider change - reset credential, region, and downstream
  const handleProviderChange = (provider: string) => {
    onChange({ 
      provider,
      credentialId: '', // Reset credential
      region: '', // Reset region
      az: '', // Reset AZ
    });
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Handle credential change - reset region and downstream
  const handleCredentialChange = (credentialId: string) => {
    onChange({ 
      credentialId,
      region: '', // Reset region
      az: '', // Reset AZ
    });
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Handle region change - reset availability zone and downstream sections
  const handleRegionChange = (region: string) => {
    onChange({ 
      region,
      az: '', // Reset AZ when region changes
    });
    // Reset downstream sections
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Handle availability zone change - reset downstream sections
  const handleAvailabilityZoneChange = (az: string) => {
    onChange({ az });
    // Reset downstream sections
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Check if region can be enabled (requires customer, provider, and credential)
  const isRegionEnabled = !!(formValue.customer && formValue.provider && formValue.credentialId);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">1</span>
          </div>
          Basic Information
        </h2>
        <p className="text-blue-100 text-sm mt-1.5">Configure region, availability zone, and server details</p>
      </div>
      <div className="p-8">
        {/* Customer and Provider Selection - Must be before Region */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Credentials Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Selector */}
            <div>
              <label htmlFor="customer-select" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer <span className="text-red-500">*</span>
              </label>
              {loadingCredentials ? (
                <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm">
                  Loading customers...
                </div>
              ) : availableCustomers.length === 0 ? (
                <div className="px-4 py-3 border border-yellow-300 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
                  No customers found. Please add credentials in the{' '}
                  <a href="/credentials" className="underline font-semibold" target="_blank" rel="noopener noreferrer">
                    Credentials Management
                  </a>{' '}
                  page.
                </div>
              ) : (
                <select
                  id="customer-select"
                  value={formValue.customer || ''}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm hover:border-gray-400 ${
                    errors['basic.customer'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  aria-label="Select customer"
                  required
                >
                  <option value="">-- Select Customer --</option>
                  {availableCustomers.map((customer) => (
                    <option key={customer} value={customer}>
                      {customer}
                    </option>
                  ))}
                </select>
              )}
              {errors['basic.customer'] && (
                <p className="mt-1 text-sm text-red-600">{errors['basic.customer']}</p>
              )}
            </div>

            {/* Provider Selector */}
            <div>
              <label htmlFor="provider-select" className="block text-sm font-semibold text-gray-700 mb-2">
                Provider <span className="text-red-500">*</span>
              </label>
              {loadingCredentials ? (
                <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm">
                  Loading providers...
                </div>
              ) : !formValue.customer ? (
                <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm">
                  Please select a customer first
                </div>
              ) : availableProviders.length === 0 ? (
                <div className="px-4 py-3 border border-yellow-300 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
                  No providers found for selected customer.
                </div>
              ) : (
                <select
                  id="provider-select"
                  value={formValue.provider || ''}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  disabled={!formValue.customer}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm hover:border-gray-400 ${
                    errors['basic.provider'] ? 'border-red-300' : 'border-gray-300'
                  } ${!formValue.customer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Select provider"
                  required
                >
                  <option value="">-- Select Provider --</option>
                  {availableProviders
                    .filter(provider => 
                      allCredentials.some(c => c.customer === formValue.customer && c.provider === provider)
                    )
                    .map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                </select>
              )}
              {errors['basic.provider'] && (
                <p className="mt-1 text-sm text-red-600">{errors['basic.provider']}</p>
              )}
            </div>
          </div>

          {/* Credential Selection */}
          {formValue.customer && formValue.provider && (
            <div className="mt-4">
              <label htmlFor="credential-select" className="block text-sm font-semibold text-gray-700 mb-2">
                Credential (AK/SK) <span className="text-red-500">*</span>
              </label>
              {filteredCredentials.length === 0 ? (
                <div className="px-4 py-3 border border-yellow-300 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
                  No credentials found for {formValue.customer} - {formValue.provider}. 
                  Please add credentials in the{' '}
                  <a href="/credentials" className="underline font-semibold" target="_blank" rel="noopener noreferrer">
                    Credentials Management
                  </a>{' '}
                  page.
                </div>
              ) : (
                <select
                  id="credential-select"
                  value={formValue.credentialId || ''}
                  onChange={(e) => handleCredentialChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm hover:border-gray-400 ${
                    errors['basic.credentialId'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  aria-label="Select credential"
                  required
                >
                  <option value="">-- Select Credential --</option>
                  {filteredCredentials.map((credential) => (
                    <option key={credential.id} value={credential.id}>
                      {credential.customer} - {credential.provider} (AK: {credential.access_key.substring(0, 8)}...)
                    </option>
                  ))}
                </select>
              )}
              {errors['basic.credentialId'] && (
                <p className="mt-1 text-sm text-red-600">{errors['basic.credentialId']}</p>
              )}
            </div>
          )}
        </div>

        {/* Region and Availability Zone - Enabled only after Customer, Provider, and Credential are selected */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="group" aria-labelledby="basic-info-heading">
          <div>
            <RegionSelector
              value={formValue.region}
              error={errors['basic.region']}
              onChange={handleRegionChange}
              onResetDownstream={onResetDownstream}
              disabled={!isRegionEnabled}
            />
            {!isRegionEnabled && formValue.customer && formValue.provider && !formValue.credentialId && (
              <p className="mt-1 text-xs text-gray-500">Please select a credential first</p>
            )}
            {!isRegionEnabled && (!formValue.customer || !formValue.provider) && (
              <p className="mt-1 text-xs text-gray-500">Please select customer and provider first</p>
            )}
          </div>
          <AZSelector
            value={formValue.az}
            region={formValue.region}
            error={errors['basic.az']}
            onChange={handleAvailabilityZoneChange}
            onResetDownstream={onResetDownstream}
          />
          <ServerNameInput
            value={formValue.name}
            error={errors['basic.name']}
            onChange={(name) => onChange({ name })}
          />
          <InstanceCountInput
            value={formValue.count}
            error={errors['basic.count']}
            onChange={(count) => onChange({ count })}
          />
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <DryRunSwitch
            checked={formValue.dryRun ?? true}
            onChange={(dryRun) => onChange({ dryRun })}
          />
        </div>
      </div>
    </div>
  );
}

