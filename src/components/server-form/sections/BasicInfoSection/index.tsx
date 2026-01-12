'use client';

import { useState, useEffect } from 'react';
import { BasicInfo } from '@/types/server';
import RegionSelector from './RegionSelector';
import AZSelector from './AZSelector';
import ServerNameInput from './ServerNameInput';
import InstanceCountInput from './InstanceCountInput';
import DryRunSwitch from './DryRunSwitch';
import CredentialSelector from './CredentialSelector';
import { customersApi, Customer } from '@/services/customersApi';
import { vendorsApi, Vendor } from '@/services/vendorsApi';

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
    region: '',
    az: '',
    name: '',
    count: 1,
    dryRun: true,
    customer_id: undefined,
    vendor_id: undefined,
    credential_id: undefined,
  };

  // State for customer and vendor lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [activeTab, setActiveTab] = useState<'customer' | 'provider'>('customer');

  // Load customers and vendors on mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingCustomers(true);
      setLoadingVendors(true);
      
      try {
        const [customersData, vendorsData] = await Promise.all([
          customersApi.getCustomers(),
          vendorsApi.getVendors()
        ]);
        
        // Ensure data is always an array, even if API returns undefined/null
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setVendors(Array.isArray(vendorsData) ? vendorsData : []);
      } catch (err) {
        console.error('Failed to load customers/vendors:', err);
        // Ensure state remains as empty array on error
        setCustomers([]);
        setVendors([]);
      } finally {
        setLoadingCustomers(false);
        setLoadingVendors(false);
      }
    };

    loadData();
  }, []);

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

  // Handle customer change - reset credential
  const handleCustomerChange = (customerId: number | undefined) => {
    onChange({ 
      customer_id: customerId,
      credential_id: undefined // Reset credential when customer changes
    });
  };

  // Handle vendor change - reset credential
  const handleVendorChange = (vendorId: number | undefined) => {
    onChange({ 
      vendor_id: vendorId,
      credential_id: undefined // Reset credential when vendor changes
    });
  };

  // Handle credential change
  const handleCredentialChange = (credentialId: number | undefined) => {
    onChange({ credential_id: credentialId });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3.5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          Basic Information
        </h2>
        <p className="text-blue-100 text-xs mt-1">Configure region, availability zone, credentials, and server details</p>
      </div>
      <div className="p-5">
        {/* Customer and Provider Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'customer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('provider')}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'provider'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Provider
            </button>
          </div>
        </div>

        {/* Customer Tab Content */}
        {activeTab === 'customer' && (
          <div className="mb-4">
            <label htmlFor="customer-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Customer <span className="text-red-500">*</span>
            </label>
            {loadingCustomers ? (
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                Loading customers...
              </div>
            ) : (
              <select
                id="customer-select"
                value={formValue.customer_id || ''}
                onChange={(e) => {
                  const customerId = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  handleCustomerChange(customerId);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm text-sm ${
                  errors['basic.customer_id'] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a customer</option>
                {Array.isArray(customers) && customers.length > 0 ? (
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No customers available</option>
                )}
              </select>
            )}
            {errors['basic.customer_id'] && (
              <p className="mt-1 text-xs text-red-600">{errors['basic.customer_id']}</p>
            )}
          </div>
        )}

        {/* Provider Tab Content */}
        {activeTab === 'provider' && (
          <div className="mb-4">
            <label htmlFor="vendor-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Provider <span className="text-red-500">*</span>
            </label>
            {loadingVendors ? (
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                Loading providers...
              </div>
            ) : (
              <select
                id="vendor-select"
                value={formValue.vendor_id || ''}
                onChange={(e) => {
                  const vendorId = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  handleVendorChange(vendorId);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm text-sm ${
                  errors['basic.vendor_id'] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a provider</option>
                {Array.isArray(vendors) && vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.display_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No providers available</option>
                )}
              </select>
            )}
            {errors['basic.vendor_id'] && (
              <p className="mt-1 text-xs text-red-600">{errors['basic.vendor_id']}</p>
            )}
          </div>
        )}

        {/* Credential Selector */}
        <div className="mb-4">
          <CredentialSelector
            customerId={formValue.customer_id}
            vendorId={formValue.vendor_id}
            value={formValue.credential_id}
            onChange={handleCredentialChange}
            error={errors['basic.credential_id']}
          />
        </div>

        {/* Region, AZ, Name, Count - More Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" role="group" aria-labelledby="basic-info-heading">
          <RegionSelector
            value={formValue.region}
            error={errors['basic.region']}
            onChange={handleRegionChange}
            onResetDownstream={onResetDownstream}
          />
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
        
        {/* Dry Run Switch - More Compact */}
        <div className="pt-4 border-t border-gray-100">
          <DryRunSwitch
            checked={formValue.dryRun ?? true}
            onChange={(dryRun) => onChange({ dryRun })}
          />
        </div>
      </div>
    </div>
  );
}

