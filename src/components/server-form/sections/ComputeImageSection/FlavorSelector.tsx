'use client';

interface FlavorSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function FlavorSelector({ value, error, onChange }: FlavorSelectorProps) {
  // TODO: Fetch flavors from API
  const flavors = [
    { value: 's6.small.1', label: 's6.small.1 (1vCPU, 1GB)' },
    { value: 's6.medium.1', label: 's6.medium.1 (2vCPU, 4GB)' },
    { value: 's6.large.1', label: 's6.large.1 (4vCPU, 8GB)' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Flavor</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select flavor</option>
        {flavors.map((flavor) => (
          <option key={flavor.value} value={flavor.value}>
            {flavor.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

