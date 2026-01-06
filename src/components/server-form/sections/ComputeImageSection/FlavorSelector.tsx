'use client';

interface FlavorSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  region?: string;
  availabilityZone?: string;
  disabled?: boolean;
}

export default function FlavorSelector({ 
  value, 
  error, 
  onChange, 
  region,
  availabilityZone,
  disabled = false 
}: FlavorSelectorProps) {
  // TODO: Fetch flavors from API based on region and availabilityZone
  const flavors = [
    { value: 's6.small.1', label: 's6.small.1 (1vCPU, 1GB)' },
    { value: 's6.medium.1', label: 's6.medium.1 (2vCPU, 4GB)' },
    { value: 's6.large.1', label: 's6.large.1 (4vCPU, 8GB)' },
  ];

  return (
    <div>
      <label htmlFor="flavor-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Instance Flavor <span className="text-red-500">*</span>
      </label>
      <select
        id="flavor-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select instance flavor"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'flavor-error' : undefined}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      >
        <option value="">Select a flavor</option>
        {flavors.map((flavor) => (
          <option key={flavor.value} value={flavor.value}>
            {flavor.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="flavor-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

