'use client';

import { useState, useEffect } from 'react';
import { credentialsApi, Credential } from '@/services/credentialsApi';

interface CredentialSelectorProps {
  customerId?: number;
  vendorId?: number;
  value?: number;
  onChange: (credentialId: number | undefined) => void;
  error?: string;
}

/**
 * Credential Selector Component
 * 
 * Displays available credentials for selected customer and vendor.
 * Shows only first 4 characters of access key for security.
 * 
 * @param customerId - Selected customer ID
 * @param vendorId - Selected vendor/provider ID
 * @param value - Selected credential ID
 * @param onChange - Callback when credential selection changes
 * @param error - Validation error message
 */
export default function CredentialSelector({
  customerId,
  vendorId,
  value,
  onChange,
  error
}: CredentialSelectorProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load credentials when customer or vendor changes
  useEffect(() => {
    const loadCredentials = async () => {
      if (!customerId || !vendorId) {
        setCredentials([]);
        onChange(undefined);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      
      try {
        const response = await credentialsApi.getCredentials({
          customer_id: customerId,
          page: 1,
          page_size: 100
        });
        
        // Filter by vendor_id on frontend since API doesn't support vendor_id filter yet
        // TODO: Add vendor_id filter to backend API
        
        // Filter by vendor_id and only active credentials
        const activeCredentials = response.items.filter(
          cred => cred.status === 'active' && cred.vendor_id === vendorId
        );
        
        setCredentials(activeCredentials);
        
        // Reset selection if current credential is not in the list
        if (value && !activeCredentials.find(c => c.id === value)) {
          onChange(undefined);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load credentials');
        setCredentials([]);
      } finally {
        setLoading(false);
      }
    };

    loadCredentials();
  }, [customerId, vendorId, value, onChange]);

  // Mask access key to show only first 4 characters
  const maskAccessKey = (ak: string): string => {
    if (!ak) return '';
    if (ak.includes('*')) return ak; // Already masked
    if (ak.length > 4) {
      return ak.substring(0, 4) + '*'.repeat(ak.length - 4);
    }
    return '*'.repeat(ak.length);
  };

  return (
    <div>
      <label htmlFor="credential-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Credentials Management Choice <span className="text-red-500">*</span>
      </label>
      
      {!customerId || !vendorId ? (
        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
          Please select Customer and Provider first
        </div>
      ) : loading ? (
        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          Loading credentials...
        </div>
      ) : errorMessage ? (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errorMessage}
        </div>
      ) : credentials.length === 0 ? (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          No credentials available for this customer and provider. Please create credentials first.
        </div>
      ) : (
        <select
          id="credential-select"
          value={value || ''}
          onChange={(e) => {
            const selectedId = e.target.value ? parseInt(e.target.value, 10) : undefined;
            onChange(selectedId);
          }}
          className={`
            w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            bg-white text-gray-900 transition-all duration-200 shadow-sm text-sm
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
          `}
          aria-label="Select credential"
          aria-invalid={!!error}
          aria-describedby={error ? 'credential-error' : undefined}
        >
          <option value="">Select a credential</option>
          {credentials.map((cred) => (
            <option key={cred.id} value={cred.id}>
              {cred.customer_name} - {cred.vendor_display_name} (AK: {maskAccessKey(cred.access_key)})
            </option>
          ))}
        </select>
      )}
      
      {error && (
        <p id="credential-error" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {credentials.length > 0 && value && (
        <p className="mt-2 text-xs text-gray-500">
          Selected: {credentials.find(c => c.id === value)?.customer_name} - {credentials.find(c => c.id === value)?.vendor_display_name}
        </p>
      )}
    </div>
  );
}

