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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">6</span>
          </div>
          Billing & Lifecycle
        </h2>
        <p className="text-emerald-100 text-xs mt-1">Configure charging mode and auto-termination settings</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChargingModeSelector
          value={formValue.chargingMode}
          onChange={(chargingMode) => onChange({ chargingMode })}
          error={errors['billing.chargingMode']}
        />
        </div>
        <div className="mt-6">
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

