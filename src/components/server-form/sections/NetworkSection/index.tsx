'use client';

import { useEffect } from 'react';
import { NetworkInfo } from '@/types/server';
import VPCSelector from './VPCSelector';
import SubnetSelector from './SubnetSelector';

export interface NetworkSectionProps {
  value: NetworkInfo;
  onChange: (data: Partial<NetworkInfo>) => void;
  errors?: Record<string, string>;
  region?: string;
  availabilityZone?: string;
  disabled?: boolean;
  onResetDownstream?: () => void;
  // Legacy prop for backward compatibility
  data?: NetworkInfo;
}

export default function NetworkSection({ 
  value, 
  onChange, 
  errors = {},
  region,
  availabilityZone,
  disabled = false,
  onResetDownstream,
  data // Legacy prop
}: NetworkSectionProps) {
  const formValue = value || data || {
    vpc: '',
    subnet: '',
  };

  const isDisabled = disabled || !region || !availabilityZone;

  /**
   * Set default VPC and subnet when region and availability zone are available
   * Default VPC: vpc-default-{region}
   * Default Subnet: subnet-default-{region}-{az} with IP range 192.168.1.0/24
   */
  useEffect(() => {
    if (region && availabilityZone && !formValue.vpc && !formValue.subnet) {
      const defaultVPC = `vpc-default-${region}`;
      const defaultSubnet = `subnet-default-${region}-${availabilityZone}`;
      onChange({ 
        vpc: defaultVPC,
        subnet: defaultSubnet
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, availabilityZone]);

  const handleVPCChange = (vpc: string) => {
    onChange({ vpc, subnet: '' }); // Reset subnet when VPC changes
    if (onResetDownstream) {
      onResetDownstream();
    }
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">4</span>
          </div>
          Network Configuration
        </h2>
        <p className="text-teal-100 text-xs mt-0.5">Select VPC and subnet for your server</p>
      </div>
      <div className="p-4">
        {isDisabled && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please complete Basic Information (Region & Availability Zone) first
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <VPCSelector
            value={formValue.vpc}
            error={errors['network.vpc']}
            onChange={handleVPCChange}
            region={region}
            availabilityZone={availabilityZone}
            disabled={isDisabled}
          />
          <SubnetSelector
            value={formValue.subnet}
            vpc={formValue.vpc}
            error={errors['network.subnet']}
            onChange={(subnet) => onChange({ subnet })}
            disabled={isDisabled || !formValue.vpc}
          />
        </div>
      </div>
    </div>
  );
}

