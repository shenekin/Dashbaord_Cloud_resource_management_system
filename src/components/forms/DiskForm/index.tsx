'use client';

interface DiskFormProps {
  type: string;
  size: number;
  onChange: (type: string, size: number) => void;
}

export default function DiskForm({ type, size, onChange }: DiskFormProps) {
  const diskTypes = [
    { value: 'SAS', label: 'SAS' },
    { value: 'SSD', label: 'SSD' },
    { value: 'GPSSD', label: 'GPSSD' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Disk Type</label>
        <select
          value={type}
          onChange={(e) => onChange(e.target.value, size)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select type</option>
          {diskTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Size (GB)</label>
        <input
          type="number"
          min="10"
          max="32768"
          value={size}
          onChange={(e) => onChange(type, parseInt(e.target.value) || 10)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}

