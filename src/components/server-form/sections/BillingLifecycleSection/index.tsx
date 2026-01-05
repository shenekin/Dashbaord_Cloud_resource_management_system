'use client';

import { BillingInfo } from '@/types/server';
import ChargingModeSelector from './ChargingModeSelector';
import AutoTerminateTimePicker from './AutoTerminateTimePicker';

interface BillingLifecycleSectionProps {
  data: BillingInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<BillingInfo>) => void;
}

export default function BillingLifecycleSection({ data, errors, onChange }: BillingLifecycleSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Lifecycle</h2>
      <div className="space-y-4">
        <ChargingModeSelector
          value={data.chargingMode}
          onChange={(chargingMode) => onChange({ chargingMode })}
        />
        <AutoTerminateTimePicker
          value={data.autoTerminateTime}
          onChange={(autoTerminateTime) => onChange({ autoTerminateTime })}
        />
      </div>
    </div>
  );
}

