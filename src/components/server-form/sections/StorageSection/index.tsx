'use client';

import { StorageInfo } from '@/types/server';
import SystemDiskForm from './SystemDiskForm';
import DataDiskList from './DataDiskList';

interface StorageSectionProps {
  data: StorageInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<StorageInfo>) => void;
}

export default function StorageSection({ data, errors, onChange }: StorageSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage</h2>
      <div className="space-y-4">
        <SystemDiskForm
          data={data.systemDisk}
          onChange={(systemDisk) => onChange({ systemDisk })}
        />
        <DataDiskList
          data={data.dataDisks}
          onChange={(dataDisks) => onChange({ dataDisks })}
        />
      </div>
    </div>
  );
}

