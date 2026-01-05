'use client';

import { AdvancedInfo } from '@/types/server';
import TagEditor from './TagEditor';

interface AdvancedSectionProps {
  data: AdvancedInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<AdvancedInfo>) => void;
}

export default function AdvancedSection({ data, errors, onChange }: AdvancedSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>
      <TagEditor
        tags={data.tags}
        onChange={(tags) => onChange({ tags })}
      />
    </div>
  );
}

