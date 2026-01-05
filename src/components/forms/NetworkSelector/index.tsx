'use client';

interface NetworkSelectorProps {
  vpc: string;
  subnet: string;
  onVPCChange: (vpc: string) => void;
  onSubnetChange: (subnet: string) => void;
}

export default function NetworkSelector({ vpc, subnet, onVPCChange, onSubnetChange }: NetworkSelectorProps) {
  // TODO: Fetch from API
  const vpcs = [
    { value: 'vpc-001', label: 'VPC-001' },
    { value: 'vpc-002', label: 'VPC-002' },
  ];

  const subnets = vpc
    ? [
        { value: `${vpc}-subnet-1`, label: 'Subnet 1' },
        { value: `${vpc}-subnet-2`, label: 'Subnet 2' },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">VPC</label>
        <select
          value={vpc}
          onChange={(e) => {
            onVPCChange(e.target.value);
            onSubnetChange('');
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select VPC</option>
          {vpcs.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subnet</label>
        <select
          value={subnet}
          onChange={(e) => onSubnetChange(e.target.value)}
          disabled={!vpc}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!vpc ? 'bg-gray-100' : ''}`}
        >
          <option value="">Select subnet</option>
          {subnets.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

