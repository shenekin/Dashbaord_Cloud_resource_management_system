'use client';

interface BandwidthTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function BandwidthTypeSelector({ value, onChange, disabled = false }: BandwidthTypeSelectorProps) {
  const bandwidthTypes = [
    { value: 'PER', label: 'PER (Per EIP)' },
    { value: 'WHOLE', label: 'WHOLE (Shared)' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth Type</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select bandwidth type</option>
        {bandwidthTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

