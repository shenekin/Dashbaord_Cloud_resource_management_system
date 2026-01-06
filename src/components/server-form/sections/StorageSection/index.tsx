'use client';

import { StorageInfo } from '@/types/server';
import SystemDiskForm from './SystemDiskForm';
import DataDiskList from './DataDiskList';

export interface StorageSectionProps {
  value: StorageInfo;
  onChange: (data: Partial<StorageInfo>) => void;
  errors?: Record<string, string>;
  region?: string;
  availabilityZone?: string;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: StorageInfo;
}

export default function StorageSection({ 
  value, 
  onChange, 
  errors = {},
  region,
  availabilityZone,
  disabled = false,
  data // Legacy prop
}: StorageSectionProps) {
  const formValue = value || data || {
    systemDisk: {
      type: '',
      size: 40,
    },
    dataDisks: [],
  };

  const isDisabled = disabled || !region || !availabilityZone;

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">3</span>
          </div>
          Storage Configuration
        </h2>
        <p className="text-indigo-100 text-sm mt-1.5">Configure system disk and optional data disks</p>
      </div>
      <div className="p-8">
        {isDisabled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please complete Basic Information (Region & Availability Zone) first
            </p>
          </div>
        )}
        <div className="space-y-6">
          <SystemDiskForm
            value={formValue.systemDisk}
            onChange={(systemDisk) => onChange({ systemDisk })}
            errors={errors}
            disabled={isDisabled}
          />
          <DataDiskList
            value={formValue.dataDisks}
            onChange={(dataDisks) => onChange({ dataDisks })}
            errors={errors}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}

