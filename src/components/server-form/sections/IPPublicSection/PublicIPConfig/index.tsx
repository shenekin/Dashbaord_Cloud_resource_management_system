'use client';

import { useState } from 'react';
import EIPTypeSelector from './EIPTypeSelector';
import BandwidthTypeSelector from './BandwidthTypeSelector';
import BandwidthSizeInput from './BandwidthSizeInput';

interface PublicIPConfigProps {
  value?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  };
  onChange: (data?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  }) => void;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  };
}

export default function PublicIPConfig({ value, onChange, disabled = false, data }: PublicIPConfigProps) {
  const configValue = value || data;
  const [enabled, setEnabled] = useState(!!configValue);

  const handleToggle = (checked: boolean) => {
    if (disabled) return;
    setEnabled(checked);
    if (checked && !configValue) {
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
          disabled={disabled}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
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
        value={configValue?.eipType || ''}
        onChange={(eipType) => onChange({ ...configValue!, eipType })}
        disabled={disabled}
      />
      <BandwidthTypeSelector
        value={configValue?.bandwidthType || ''}
        onChange={(bandwidthType) => onChange({ ...configValue!, bandwidthType })}
        disabled={disabled}
      />
      <BandwidthSizeInput
        value={configValue?.bandwidthSize || 1}
        onChange={(bandwidthSize) => onChange({ ...configValue!, bandwidthSize })}
        disabled={disabled}
      />
    </div>
  );
}

