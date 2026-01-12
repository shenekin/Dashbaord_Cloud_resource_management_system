'use client';

import { IPInfo } from '@/types/server';
import PrivateIPInput from './PrivateIPInput';
import IPv6Switch from './IPv6Switch';
import PublicIPConfig from './PublicIPConfig';

export interface IPPublicSectionProps {
  value: IPInfo;
  onChange: (data: Partial<IPInfo>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  // Legacy prop for backward compatibility
  data?: IPInfo;
}

export default function IPPublicSection({ 
  value, 
  onChange, 
  errors = {},
  disabled = false,
  data // Legacy prop
}: IPPublicSectionProps) {
  const formValue = value || data || {
    enableIPv6: false,
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">5</span>
          </div>
          IP Configuration
        </h2>
        <p className="text-cyan-100 text-xs mt-0.5">Configure private IP, IPv6, and public IP settings</p>
      </div>
      <div className="p-4">
        {disabled && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please complete Network Configuration (VPC & Subnet) first
            </p>
          </div>
        )}
        <div className="space-y-3">
          <PrivateIPInput
            value={formValue.privateIP}
            onChange={(privateIP) => onChange({ privateIP })}
            disabled={disabled}
          />
          <IPv6Switch
            checked={formValue.enableIPv6}
            onChange={(enableIPv6) => onChange({ enableIPv6 })}
            disabled={disabled}
          />
          <PublicIPConfig
            value={formValue.publicIP}
            onChange={(publicIP) => onChange({ publicIP })}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

