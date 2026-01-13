'use client';

interface VPCSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  region?: string;
  availabilityZone?: string;
  disabled?: boolean;
}

export default function VPCSelector({ 
  value, 
  error, 
  onChange, 
  region,
  availabilityZone,
  disabled = false 
}: VPCSelectorProps) {
  // Default VPCs - includes default VPC for the region
  const defaultVPC = region ? `vpc-default-${region}` : '';
  const vpcs = [
    ...(defaultVPC ? [{ value: defaultVPC, label: `Default VPC (${region})` }] : []),
    { value: 'vpc-001', label: 'VPC-001' },
    { value: 'vpc-002', label: 'VPC-002' },
  ];

  return (
    <div>
      <label htmlFor="vpc-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Virtual Private Cloud (VPC) <span className="text-red-500">*</span>
      </label>
      <select
        id="vpc-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select Virtual Private Cloud"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'vpc-error' : undefined}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      >
        <option value="">Select a VPC</option>
        {vpcs.map((vpc) => (
          <option key={vpc.value} value={vpc.value}>
            {vpc.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="vpc-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

