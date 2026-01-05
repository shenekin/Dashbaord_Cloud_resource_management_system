'use client';

interface VPCSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function VPCSelector({ value, error, onChange }: VPCSelectorProps) {
  // TODO: Fetch VPCs from API
  const vpcs = [
    { value: 'vpc-001', label: 'VPC-001' },
    { value: 'vpc-002', label: 'VPC-002' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">VPC</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select VPC</option>
        {vpcs.map((vpc) => (
          <option key={vpc.value} value={vpc.value}>
            {vpc.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

