'use client';

import { BasicInfo } from '@/types/server';
import RegionSelector from './RegionSelector';
import AZSelector from './AZSelector';
import ServerNameInput from './ServerNameInput';
import InstanceCountInput from './InstanceCountInput';
import DryRunSwitch from './DryRunSwitch';

interface BasicInfoSectionProps {
  data: BasicInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<BasicInfo>) => void;
}

export default function BasicInfoSection({ data, errors, onChange }: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
      <div className="space-y-4">
        <RegionSelector
          value={data.region}
          error={errors['basic.region']}
          onChange={(region) => onChange({ region })}
        />
        <AZSelector
          value={data.az}
          region={data.region}
          error={errors['basic.az']}
          onChange={(az) => onChange({ az })}
        />
        <ServerNameInput
          value={data.name}
          error={errors['basic.name']}
          onChange={(name) => onChange({ name })}
        />
        <InstanceCountInput
          value={data.count}
          onChange={(count) => onChange({ count })}
        />
        <DryRunSwitch
          checked={data.dryRun}
          onChange={(dryRun) => onChange({ dryRun })}
        />
      </div>
    </div>
  );
}

