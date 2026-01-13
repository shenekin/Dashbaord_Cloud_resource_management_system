'use client';

interface SubnetSelectorProps {
  value: string;
  vpc: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SubnetSelector({ 
  value, 
  vpc, 
  error, 
  onChange, 
  disabled = false 
}: SubnetSelectorProps) {
  // Default subnets - includes default subnet with IP range 192.168.1.0/24
  const isDefaultVPC = vpc && vpc.startsWith('vpc-default-');
  const defaultSubnet = isDefaultVPC ? `${vpc.replace('vpc-', 'subnet-')}-1` : null;
  const subnets = vpc
    ? [
        ...(defaultSubnet ? [{ value: defaultSubnet, label: `Default Subnet (192.168.1.0/24)` }] : []),
        { value: `${vpc}-subnet-1`, label: 'Subnet 1' },
        { value: `${vpc}-subnet-2`, label: 'Subnet 2' },
      ]
    : [];

  const isDisabled = disabled || !vpc;

  return (
    <div>
      <label htmlFor="subnet-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Subnet <span className="text-red-500">*</span>
      </label>
      <select
        id="subnet-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        aria-label="Select subnet"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'subnet-error' : undefined}
        aria-disabled={isDisabled}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        } ${isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      >
        <option value="">Select a subnet</option>
        {subnets.map((subnet) => (
          <option key={subnet.value} value={subnet.value}>
            {subnet.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="subnet-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

