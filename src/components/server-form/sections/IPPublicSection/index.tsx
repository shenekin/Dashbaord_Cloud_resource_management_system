'use client';

import { IPInfo } from '@/types/server';
import PrivateIPInput from './PrivateIPInput';
import IPv6Switch from './IPv6Switch';
import PublicIPConfig from './PublicIPConfig';

interface IPPublicSectionProps {
  data: IPInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<IPInfo>) => void;
}

export default function IPPublicSection({ data, errors, onChange }: IPPublicSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">IP Configuration</h2>
      <div className="space-y-4">
        <PrivateIPInput
          value={data.privateIP}
          onChange={(privateIP) => onChange({ privateIP })}
        />
        <IPv6Switch
          checked={data.enableIPv6}
          onChange={(enableIPv6) => onChange({ enableIPv6 })}
        />
        <PublicIPConfig
          data={data.publicIP}
          onChange={(publicIP) => onChange({ publicIP })}
        />
      </div>
    </div>
  );
}

