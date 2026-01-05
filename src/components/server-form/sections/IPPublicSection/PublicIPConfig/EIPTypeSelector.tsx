'use client';

interface EIPTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EIPTypeSelector({ value, onChange }: EIPTypeSelectorProps) {
  const eipTypes = [
    { value: '5_bgp', label: '5_bgp' },
    { value: '5_sbgp', label: '5_sbgp' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">EIP Type</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select EIP type</option>
        {eipTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

