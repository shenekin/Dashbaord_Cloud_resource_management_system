'use client';

import { useState, useEffect } from 'react';

interface AZSelectorProps {
  value: string;
  region: string;
  error?: string;
  onChange: (value: string) => void;
  onResetDownstream?: () => void;
}

interface AvailabilityZone {
  value: string;
  label: string;
}

export default function AZSelector({ value, region, error, onChange, onResetDownstream }: AZSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [availabilityZones, setAvailabilityZones] = useState<AvailabilityZone[]>([]);

  useEffect(() => {
    if (!region) {
      setAvailabilityZones([]);
      return;
    }

    // Fetch availability zones based on region
    // Note: No API calls inside component - this should be handled by parent
    // For now, we'll simulate the structure but parent should provide the data
    setLoading(true);
    
    // Simulate async loading - in real implementation, parent should fetch and pass options
    setTimeout(() => {
      // Placeholder: In real implementation, parent component should fetch and pass options
      // This is just for structure - actual data should come from props or context
      const mockZones: AvailabilityZone[] = region
        ? [
            { value: `${region}-az1`, label: `${region} - Availability Zone 1` },
            { value: `${region}-az2`, label: `${region} - Availability Zone 2` },
            { value: `${region}-az3`, label: `${region} - Availability Zone 3` },
          ]
        : [];
      setAvailabilityZones(mockZones);
      setLoading(false);
    }, 200);
  }, [region]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Reset downstream sections when AZ changes
    if (onResetDownstream && newValue !== value) {
      onResetDownstream();
    }
  };

  return (
    <div>
      <label htmlFor="az-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Availability Zone <span className="text-red-500">*</span>
      </label>
      {loading ? (
        <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center shadow-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-3"></div>
          <span className="text-sm text-gray-600 font-medium">Loading availability zones...</span>
        </div>
      ) : (
        <select
          id="az-select"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={!region}
          aria-label="Select availability zone"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'az-error' : undefined}
          aria-disabled={!region}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          } ${!region ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
        >
          <option value="">Select an availability zone</option>
          {availabilityZones.map((az) => (
            <option key={az.value} value={az.value}>
              {az.label}
            </option>
          ))}
        </select>
      )}
      {error && (
        <p id="az-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

