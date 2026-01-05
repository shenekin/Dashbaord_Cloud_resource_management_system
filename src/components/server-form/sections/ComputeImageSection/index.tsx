'use client';

import { ComputeInfo } from '@/types/server';
import FlavorSelector from './FlavorSelector';
import ImageSelector from './ImageSelector';
import AdminPasswordInput from './AdminPasswordInput';

interface ComputeImageSectionProps {
  data: ComputeInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<ComputeInfo>) => void;
}

export default function ComputeImageSection({ data, errors, onChange }: ComputeImageSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Compute & Image</h2>
      <div className="space-y-4">
        <FlavorSelector
          value={data.flavor}
          error={errors['compute.flavor']}
          onChange={(flavor) => onChange({ flavor })}
        />
        <ImageSelector
          value={data.image}
          error={errors['compute.image']}
          onChange={(image) => onChange({ image })}
        />
        <AdminPasswordInput
          value={data.adminPassword}
          error={errors['compute.adminPassword']}
          onChange={(adminPassword) => onChange({ adminPassword })}
        />
      </div>
    </div>
  );
}

