'use client';

interface SubnetSelectorProps {
  value: string;
  vpc: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function SubnetSelector({ value, vpc, error, onChange }: SubnetSelectorProps) {
  // TODO: Fetch subnets from API based on VPC
  const subnets = vpc
    ? [
        { value: `${vpc}-subnet-1`, label: 'Subnet 1' },
        { value: `${vpc}-subnet-2`, label: 'Subnet 2' },
      ]
    : [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Subnet</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!vpc}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${!vpc ? 'bg-gray-100' : ''}`}
      >
        <option value="">Select subnet</option>
        {subnets.map((subnet) => (
          <option key={subnet.value} value={subnet.value}>
            {subnet.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

