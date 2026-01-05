'use client';

interface SystemDiskFormProps {
  data: { type: string; size: number };
  onChange: (data: { type: string; size: number }) => void;
}

export default function SystemDiskForm({ data, onChange }: SystemDiskFormProps) {
  const diskTypes = [
    { value: 'SAS', label: 'SAS' },
    { value: 'SSD', label: 'SSD' },
    { value: 'GPSSD', label: 'GPSSD' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800">System Disk</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disk Type</label>
          <select
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select type</option>
            {diskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size (GB)</label>
          <input
            type="number"
            min="40"
            max="1024"
            value={data.size}
            onChange={(e) => onChange({ ...data, size: parseInt(e.target.value) || 40 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

