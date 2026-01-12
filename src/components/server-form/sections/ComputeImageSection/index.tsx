'use client';

import { ComputeInfo } from '@/types/server';
import FlavorSelector from './FlavorSelector';
import ImageSelector from './ImageSelector';
import AdminPasswordInput from './AdminPasswordInput';

export interface ComputeImageSectionProps {
  value: ComputeInfo;
  onChange: (data: Partial<ComputeInfo>) => void;
  errors?: Record<string, string>;
  region?: string;
  availabilityZone?: string;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: ComputeInfo;
}

export default function ComputeImageSection({ 
  value, 
  onChange, 
  errors = {},
  region,
  availabilityZone,
  disabled = false,
  data // Legacy prop
}: ComputeImageSectionProps) {
  const formValue = value || data || {
    flavor: '',
    image: '',
    adminPassword: '',
  };

  const isDisabled = disabled || !region || !availabilityZone;

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3.5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          Compute & Image
        </h2>
        <p className="text-purple-100 text-xs mt-1">Select instance flavor, operating system, and admin credentials</p>
      </div>
      <div className="p-5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FlavorSelector
          value={formValue.flavor}
          error={errors['compute.flavor']}
          onChange={(flavor) => onChange({ flavor })}
          region={region}
          availabilityZone={availabilityZone}
          disabled={isDisabled}
        />
        <ImageSelector
          value={formValue.image}
          error={errors['compute.image']}
          onChange={(image) => onChange({ image })}
          region={region}
          disabled={isDisabled}
        />
        </div>
        <div className="mt-6">
          <AdminPasswordInput
            value={formValue.adminPassword}
            error={errors['compute.adminPassword']}
            onChange={(adminPassword) => onChange({ adminPassword })}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}

