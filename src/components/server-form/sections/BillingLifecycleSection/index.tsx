'use client';

import { BillingInfo } from '@/types/server';
import ChargingModeSelector from './ChargingModeSelector';
import AutoTerminateTimePicker from './AutoTerminateTimePicker';

export interface BillingLifecycleSectionProps {
  value: BillingInfo;
  onChange: (data: Partial<BillingInfo>) => void;
  errors?: Record<string, string>;
  // Legacy prop for backward compatibility
  data?: BillingInfo;
}

export default function BillingLifecycleSection({ 
  value, 
  onChange, 
  errors = {},
  data // Legacy prop
}: BillingLifecycleSectionProps) {
  const formValue = value || data || {
    chargingMode: 'postPaid',
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">6</span>
          </div>
          Billing & Lifecycle
        </h2>
        <p className="text-emerald-100 text-xs mt-0.5">Configure charging mode and auto-termination settings</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChargingModeSelector
          value={formValue.chargingMode}
          onChange={(chargingMode) => onChange({ chargingMode })}
          error={errors['billing.chargingMode']}
        />
        </div>
        <div className="mt-3">
          <AutoTerminateTimePicker
            value={formValue.autoTerminateTime}
            onChange={(autoTerminateTime) => onChange({ autoTerminateTime })}
            error={errors['billing.autoTerminateTime']}
          />
        </div>
      </div>
    </div>
  );
}

