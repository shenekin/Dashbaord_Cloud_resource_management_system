'use client';

import DataDiskItem from './DataDiskList/DataDiskItem';

interface DataDiskListProps {
  value: Array<{ type: string; size: number }>;
  onChange: (data: Array<{ type: string; size: number }>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: Array<{ type: string; size: number }>;
}

export default function DataDiskList({ 
  value, 
  onChange, 
  errors = {},
  disabled = false,
  data // Legacy prop
}: DataDiskListProps) {
  const formValue = value || data || [];

  const addDisk = () => {
    if (disabled) return;
    onChange([...formValue, { type: '', size: 100 }]);
  };

  const updateDisk = (index: number, disk: { type: string; size: number }) => {
    const newData = [...formValue];
    newData[index] = disk;
    onChange(newData);
  };

  const removeDisk = (index: number) => {
    if (disabled) return;
    onChange(formValue.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-900">Data Disks</h3>
          <span className="text-xs text-gray-500 font-normal">(Optional)</span>
        </div>
        <button
          type="button"
          onClick={addDisk}
          disabled={disabled}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all duration-200"
        >
          + Add Disk
        </button>
      </div>
      {formValue.length === 0 ? (
        <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">No data disks added</p>
          <p className="text-xs text-gray-500 mt-1">Click "Add Disk" to attach additional storage</p>
        </div>
      ) : (
        formValue.map((disk, index) => (
          <DataDiskItem
            key={index}
            value={disk}
            onUpdate={(updatedDisk) => updateDisk(index, updatedDisk)}
            onRemove={() => removeDisk(index)}
            disabled={disabled}
            error={errors[`storage.dataDisks.${index}`]}
          />
        ))
      )}
    </div>
  );
}

