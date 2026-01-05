'use client';

import { useState } from 'react';
import EIPTypeSelector from './EIPTypeSelector';
import BandwidthTypeSelector from './BandwidthTypeSelector';
import BandwidthSizeInput from './BandwidthSizeInput';

interface PublicIPConfigProps {
  data?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  };
  onChange: (data?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  }) => void;
}

export default function PublicIPConfig({ data, onChange }: PublicIPConfigProps) {
  const [enabled, setEnabled] = useState(!!data);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (checked && !data) {
      onChange({
        eipType: '',
        bandwidthType: '',
        bandwidthSize: 1,
      });
    } else if (!checked) {
      onChange(undefined);
    }
  };

  if (!enabled) {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="publicIP"
          checked={false}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="publicIP" className="ml-2 text-sm text-gray-700">
          Enable Public IP
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Public IP Configuration</label>
        <input
          type="checkbox"
          id="publicIP"
          checked={enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
      </div>
      <EIPTypeSelector
        value={data?.eipType || ''}
        onChange={(eipType) => onChange({ ...data!, eipType })}
      />
      <BandwidthTypeSelector
        value={data?.bandwidthType || ''}
        onChange={(bandwidthType) => onChange({ ...data!, bandwidthType })}
      />
      <BandwidthSizeInput
        value={data?.bandwidthSize || 1}
        onChange={(bandwidthSize) => onChange({ ...data!, bandwidthSize })}
      />
    </div>
  );
}

