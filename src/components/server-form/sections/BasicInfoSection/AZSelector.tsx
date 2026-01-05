'use client';

interface AZSelectorProps {
  value: string;
  region: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function AZSelector({ value, region, error, onChange }: AZSelectorProps) {
  // TODO: Fetch availability zones from API based on region
  const availabilityZones = region
    ? [
        { value: `${region}-az1`, label: 'Availability Zone 1' },
        { value: `${region}-az2`, label: 'Availability Zone 2' },
        { value: `${region}-az3`, label: 'Availability Zone 3' },
      ]
    : [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Availability Zone</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!region}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${!region ? 'bg-gray-100' : ''}`}
      >
        <option value="">Select availability zone</option>
        {availabilityZones.map((az) => (
          <option key={az.value} value={az.value}>
            {az.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

