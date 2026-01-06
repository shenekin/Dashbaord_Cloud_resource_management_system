'use client';

interface DataDiskItemProps {
  value: { type: string; size: number };
  onUpdate: (data: { type: string; size: number }) => void;
  onRemove: () => void;
  disabled?: boolean;
  error?: string;
  // Legacy prop for backward compatibility
  data?: { type: string; size: number };
}

export default function DataDiskItem({ 
  value, 
  onUpdate, 
  onRemove, 
  disabled = false,
  error,
  data // Legacy prop
}: DataDiskItemProps) {
  const formValue = value || data || { type: '', size: 100 };

  const diskTypes = [
    { value: 'SAS', label: 'SAS' },
    { value: 'SSD', label: 'SSD' },
    { value: 'GPSSD', label: 'GPSSD' },
  ];

  return (
    <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Disk Type</label>
          <select
            value={formValue.type || ''}
            onChange={(e) => onUpdate({ ...formValue, type: e.target.value })}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-200'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
          >
            <option value="">Select type</option>
            {diskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Size (GB)</label>
          <input
            type="number"
            min="10"
            max="32768"
            value={formValue.size || 100}
            onChange={(e) => onUpdate({ ...formValue, size: parseInt(e.target.value) || 10 })}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-200'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-200 hover:border-red-300"
      >
        Remove
      </button>
    </div>
  );
}

