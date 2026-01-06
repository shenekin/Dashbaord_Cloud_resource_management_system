'use client';

interface SystemDiskFormProps {
  value: { type: string; size: number };
  onChange: (data: { type: string; size: number }) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: { type: string; size: number };
}

export default function SystemDiskForm({ 
  value, 
  onChange, 
  errors = {},
  disabled = false,
  data // Legacy prop
}: SystemDiskFormProps) {
  const formValue = value || data || { type: '', size: 40 };

  const diskTypes = [
    { value: 'SAS', label: 'SAS' },
    { value: 'SSD', label: 'SSD' },
    { value: 'GPSSD', label: 'GPSSD' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
        <h3 className="text-lg font-bold text-gray-900">System Disk</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="system-disk-type" className="block text-sm font-semibold text-gray-700 mb-2">
            Disk Type <span className="text-red-500">*</span>
          </label>
          <select
            id="system-disk-type"
            value={formValue.type || ''}
            onChange={(e) => onChange({ ...formValue, type: e.target.value })}
            disabled={disabled}
            aria-label="System disk type"
            aria-invalid={!!errors['storage.systemDisk.type']}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
              errors['storage.systemDisk.type'] ? 'border-red-400 bg-red-50' : 'border-gray-200'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
          >
            <option value="">Select disk type</option>
            {diskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors['storage.systemDisk.type'] && (
            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors['storage.systemDisk.type']}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="system-disk-size" className="block text-sm font-semibold text-gray-700 mb-2">
            Size (GB) <span className="text-red-500">*</span>
          </label>
          <input
            id="system-disk-size"
            type="number"
            min="40"
            max="1024"
            value={formValue.size || 40}
            onChange={(e) => onChange({ ...formValue, size: parseInt(e.target.value) || 40 })}
            disabled={disabled}
            aria-label="System disk size in GB"
            aria-invalid={!!errors['storage.systemDisk.size']}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
              errors['storage.systemDisk.size'] ? 'border-red-400 bg-red-50' : 'border-gray-200'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
          />
          {errors['storage.systemDisk.size'] && (
            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors['storage.systemDisk.size']}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

