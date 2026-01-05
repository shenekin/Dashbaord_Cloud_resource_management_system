'use client';

interface DataDiskItemProps {
  data: { type: string; size: number };
  onUpdate: (data: { type: string; size: number }) => void;
  onRemove: () => void;
}

export default function DataDiskItem({ data, onUpdate, onRemove }: DataDiskItemProps) {
  const diskTypes = [
    { value: 'SAS', label: 'SAS' },
    { value: 'SSD', label: 'SSD' },
    { value: 'GPSSD', label: 'GPSSD' },
  ];

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disk Type</label>
          <select
            value={data.type}
            onChange={(e) => onUpdate({ ...data, type: e.target.value })}
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
            min="10"
            max="32768"
            value={data.size}
            onChange={(e) => onUpdate({ ...data, size: parseInt(e.target.value) || 10 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="px-4 py-2 text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
}

