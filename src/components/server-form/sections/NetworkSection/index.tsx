'use client';

import { NetworkInfo } from '@/types/server';
import VPCSelector from './VPCSelector';
import SubnetSelector from './SubnetSelector';

interface NetworkSectionProps {
  data: NetworkInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<NetworkInfo>) => void;
}

export default function NetworkSection({ data, errors, onChange }: NetworkSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Network</h2>
      <div className="space-y-4">
        <VPCSelector
          value={data.vpc}
          error={errors['network.vpc']}
          onChange={(vpc) => onChange({ vpc })}
        />
        <SubnetSelector
          value={data.subnet}
          vpc={data.vpc}
          error={errors['network.subnet']}
          onChange={(subnet) => onChange({ subnet })}
        />
      </div>
    </div>
  );
}

