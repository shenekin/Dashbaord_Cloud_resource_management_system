'use client';

import { useState, useEffect } from 'react';
import { BasicInfo } from '@/types/server';
import RegionSelector from './RegionSelector';
import AZSelector from './AZSelector';
import ServerNameInput from './ServerNameInput';
import InstanceCountInput from './InstanceCountInput';
import DryRunSwitch from './DryRunSwitch';
import { customersApi, Customer } from '@/services/customersApi';
import { vendorsApi, Vendor } from '@/services/vendorsApi';
import { credentialsApi, Credential } from '@/services/credentialsApi';
import { 
  getCredentialsFromLocalStorage, 
  getUniqueCustomersFromStorage, 
  getUniqueProvidersFromStorage,
  LocalCredential 
} from '@/lib/utils';

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
  
  // State for local credentials
  const [localCredentials, setLocalCredentials] = useState<LocalCredential[]>([]);
  const [localCustomers, setLocalCustomers] = useState<string[]>([]);
  const [localProviders, setLocalProviders] = useState<string[]>([]);
  
  // State for credential auto-selection
  const [selectedCredential, setSelectedCredential] = useState<LocalCredential | null>(null);
  const [loadingCredential, setLoadingCredential] = useState(false);

  /**
   * Load customers and vendors from API and local storage
   * Local storage credentials take precedence for customer/provider selection
   */
  useEffect(() => {
    const loadData = async () => {
      setLoadingCustomers(true);
      setLoadingVendors(true);
      
      // Load from local storage first
      const storedCredentials = getCredentialsFromLocalStorage();
      setLocalCredentials(storedCredentials);
      setLocalCustomers(getUniqueCustomersFromStorage());
      setLocalProviders(getUniqueProvidersFromStorage());
      
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

  /**
   * Automatically select credential from local storage when customer and provider are selected
   * Uses customer name and provider name to match credentials stored locally
   */
  useEffect(() => {
    const autoSelectCredential = () => {
      if (!formValue.customer_id || !formValue.vendor_id) {
        if (selectedCredential !== null || formValue.credential_id !== undefined) {
          setSelectedCredential(null);
          onChange({ credential_id: undefined });
        }
        return;
      }

      // Find customer and vendor names
      const customer = customers.find(c => c.id === formValue.customer_id) || 
                      localCustomers.find(c => c === formValue.customer_id?.toString());
      const vendor = vendors.find(v => v.id === formValue.vendor_id) ||
                     localProviders.find(p => p === formValue.vendor_id?.toString());

      if (!customer || !vendor) {
        return;
      }

      const customerName = typeof customer === 'string' ? customer : customer.name;
      const vendorName = typeof vendor === 'string' ? vendor : vendor.display_name;

      // Find matching credential from local storage
      const matchingCredentials = localCredentials.filter(
        cred => cred.customer === customerName && cred.provider === vendorName
      );

      if (matchingCredentials.length > 0) {
        const credential = matchingCredentials[0];
        if (!selectedCredential || selectedCredential.id !== credential.id) {
          setSelectedCredential(credential);
          // Store credential ID as string for local credentials
          onChange({ credential_id: credential.id as any });
        }
      } else {
        if (selectedCredential !== null || formValue.credential_id !== undefined) {
          setSelectedCredential(null);
          onChange({ credential_id: undefined });
        }
      }
    };

    autoSelectCredential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue.customer_id, formValue.vendor_id, localCredentials, customers, vendors]);

  /**
   * Handle customer change - reset vendor and credential
   * Supports both API customer IDs (number) and local customer names (string)
   */
  const handleCustomerChange = (customerId: number | string | undefined) => {
    onChange({ 
      customer_id: customerId as any,
      vendor_id: undefined, // Reset vendor when customer changes
      credential_id: undefined // Reset credential when customer changes
    });
  };

  /**
   * Handle vendor change - reset credential
   * Supports both API vendor IDs (number) and local provider names (string)
   */
  const handleVendorChange = (vendorId: number | string | undefined) => {
    onChange({ 
      vendor_id: vendorId as any,
      credential_id: undefined // Reset credential when vendor changes
    });
  };

  /**
   * Mask access key to show only first 4 characters for security
   */
  const maskAccessKey = (ak: string): string => {
    if (!ak) return '';
    if (ak.includes('*')) return ak; // Already masked
    if (ak.length > 4) {
      return ak.substring(0, 4) + '*'.repeat(ak.length - 4);
    }
    return '*'.repeat(ak.length);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">1</span>
          </div>
          Basic Information
        </h2>
        <p className="text-blue-100 text-xs mt-0.5">Configure region, availability zone, credentials, and server details</p>
      </div>
      <div className="p-4">
        {/* Customer and Provider Selection - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Customer Selection - Left */}
          <div>
            <label htmlFor="customer-select" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Customer <span className="text-red-500">*</span>
            </label>
            {loadingCustomers ? (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                Loading customers...
              </div>
            ) : (
              <select
                id="customer-select"
                value={formValue.customer_id || ''}
                onChange={(e) => {
                  const customerValue = e.target.value;
                  const customerId = customerValue ? (isNaN(Number(customerValue)) ? customerValue : parseInt(customerValue, 10)) : undefined;
                  handleCustomerChange(customerId as any);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm text-sm ${
                  errors['basic.customer_id'] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a customer</option>
                {localCustomers.length > 0 && (
                  <>
                    {localCustomers.map((customerName) => (
                      <option key={`local-${customerName}`} value={customerName}>
                        {customerName} (Local)
                      </option>
                    ))}
                  </>
                )}
                {Array.isArray(customers) && customers.length > 0 && (
                  <>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </>
                )}
                {localCustomers.length === 0 && (!Array.isArray(customers) || customers.length === 0) && (
                  <option value="" disabled>No customers available</option>
                )}
              </select>
            )}
            {errors['basic.customer_id'] && (
              <p className="mt-1 text-xs text-red-600">{errors['basic.customer_id']}</p>
            )}
          </div>

          {/* Provider Selection - Right */}
          <div>
            <label htmlFor="vendor-select" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Provider <span className="text-red-500">*</span>
            </label>
            {loadingVendors ? (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                Loading providers...
              </div>
            ) : (
              <select
                id="vendor-select"
                value={formValue.vendor_id || ''}
                onChange={(e) => {
                  const vendorValue = e.target.value;
                  const vendorId = vendorValue ? (isNaN(Number(vendorValue)) ? vendorValue : parseInt(vendorValue, 10)) : undefined;
                  handleVendorChange(vendorId as any);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm text-sm ${
                  errors['basic.vendor_id'] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a provider</option>
                {localProviders.length > 0 && (
                  <>
                    {localProviders.map((providerName) => (
                      <option key={`local-${providerName}`} value={providerName}>
                        {providerName} (Local)
                      </option>
                    ))}
                  </>
                )}
                {Array.isArray(vendors) && vendors.length > 0 && (
                  <>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.display_name}
                      </option>
                    ))}
                  </>
                )}
                {localProviders.length === 0 && (!Array.isArray(vendors) || vendors.length === 0) && (
                  <option value="" disabled>No providers available</option>
                )}
              </select>
            )}
            {errors['basic.vendor_id'] && (
              <p className="mt-1 text-xs text-red-600">{errors['basic.vendor_id']}</p>
            )}
          </div>
        </div>

        {/* Credential Auto-Selection Display - Show selected credential info */}
        {formValue.customer_id && formValue.vendor_id && (
          <div className="mb-3">
            {loadingCredential ? (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                Loading credential...
              </div>
            ) : selectedCredential ? (
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                  Credential: {selectedCredential.customer} - {selectedCredential.provider} (AK: {maskAccessKey(selectedCredential.accessKey)})
                </p>
              </div>
            ) : (
              <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  No credential available for this customer and provider combination. Please create credentials first.
                </p>
              </div>
            )}
            {errors['basic.credential_id'] && (
              <p className="mt-1 text-xs text-red-600">{errors['basic.credential_id']}</p>
            )}
          </div>
        )}

        {/* Region, AZ, Name, Count - More Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3" role="group" aria-labelledby="basic-info-heading">
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
        <div className="pt-3 border-t border-gray-100">
          <DryRunSwitch
            checked={formValue.dryRun ?? true}
            onChange={(dryRun) => onChange({ dryRun })}
          />
        </div>
      </div>
    </div>
  );
}

