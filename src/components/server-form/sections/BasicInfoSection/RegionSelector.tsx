'use client';

interface RegionSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function RegionSelector({ value, error, onChange }: RegionSelectorProps) {
  // TODO: Fetch regions from API
  const regions = [
    { value: 'cn-north-1', label: 'North China (Beijing)' },
    { value: 'cn-east-2', label: 'East China (Shanghai)' },
    { value: 'cn-south-1', label: 'South China (Guangzhou)' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select region</option>
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

