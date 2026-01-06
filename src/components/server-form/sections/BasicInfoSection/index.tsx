'use client';

import { BasicInfo } from '@/types/server';
import RegionSelector from './RegionSelector';
import AZSelector from './AZSelector';
import ServerNameInput from './ServerNameInput';
import InstanceCountInput from './InstanceCountInput';
import DryRunSwitch from './DryRunSwitch';

/**
 * BasicInfoSection Component
 * 
 * Controlled component for basic server information form section.
 * 
 * Props (new API):
 * - value: Current form values (region, az, name, count, dryRun)
 * - onChange: Callback when any field changes
 * - errors?: Validation errors object
 * - onResetDownstream?: Optional callback to reset downstream sections
 * 
 * Props (legacy API - for backward compatibility):
 * - data: Current form values (same as value)
 * 
 * Features:
 * - Region loads dynamically from ProjectContext
 * - AvailabilityZone depends on selected Region
 * - Count respects Project quota
 * - DryRun defaults to true (optional)
 * - Resets downstream sections on Region/AZ change
 * - No API calls inside component
 * - Accessible UI with proper labels and ARIA attributes
 * - Loading states while options are fetching
 */
export interface BasicInfoSectionProps {
  value?: BasicInfo;
  onChange: (value: Partial<BasicInfo>) => void;
  errors?: Record<string, string>;
  onResetDownstream?: () => void;
  // Legacy props for backward compatibility
  data?: BasicInfo;
}

export default function BasicInfoSection({ 
  value,
  onChange, 
  errors = {},
  onResetDownstream,
  data // Legacy prop
}: BasicInfoSectionProps) {
  // Support both new API (value) and legacy API (data)
  const formValue = value || data || {
    region: '',
    az: '',
    name: '',
    count: 1,
    dryRun: true,
  };
  // Handle region change - reset availability zone and downstream sections
  const handleRegionChange = (region: string) => {
    onChange({ 
      region,
      az: '', // Reset AZ when region changes
    });
    // Reset downstream sections
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  // Handle availability zone change - reset downstream sections
  const handleAvailabilityZoneChange = (az: string) => {
    onChange({ az });
    // Reset downstream sections
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">1</span>
          </div>
          Basic Information
        </h2>
        <p className="text-blue-100 text-sm mt-1.5">Configure region, availability zone, and server details</p>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="group" aria-labelledby="basic-info-heading">
        <RegionSelector
          value={formValue.region}
          error={errors['basic.region']}
          onChange={handleRegionChange}
          onResetDownstream={onResetDownstream}
        />
        <AZSelector
          value={formValue.az}
          region={formValue.region}
          error={errors['basic.az']}
          onChange={handleAvailabilityZoneChange}
          onResetDownstream={onResetDownstream}
        />
        <ServerNameInput
          value={formValue.name}
          error={errors['basic.name']}
          onChange={(name) => onChange({ name })}
        />
        <InstanceCountInput
          value={formValue.count}
          error={errors['basic.count']}
          onChange={(count) => onChange({ count })}
        />
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <DryRunSwitch
            checked={formValue.dryRun ?? true}
            onChange={(dryRun) => onChange({ dryRun })}
          />
        </div>
      </div>
    </div>
  );
}

