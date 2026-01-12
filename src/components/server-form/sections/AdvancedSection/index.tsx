'use client';

import { AdvancedInfo } from '@/types/server';
import TagEditor from './TagEditor';

export interface AdvancedSectionProps {
  value: AdvancedInfo;
  onChange: (data: Partial<AdvancedInfo>) => void;
  errors?: Record<string, string>;
  // Legacy prop for backward compatibility
  data?: AdvancedInfo;
}

export default function AdvancedSection({ 
  value, 
  onChange, 
  errors = {},
  data // Legacy prop
}: AdvancedSectionProps) {
  const formValue = value || data || {
    tags: [],
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-2.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">7</span>
          </div>
          Advanced Settings
        </h2>
        <p className="text-slate-100 text-xs mt-0.5">Add tags and labels to organize your resources</p>
      </div>
      <div className="p-4">
        <TagEditor
          tags={formValue.tags}
          onChange={(tags) => onChange({ tags })}
        />
      </div>
    </div>
  );
}

