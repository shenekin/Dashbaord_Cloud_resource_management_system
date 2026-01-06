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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">7</span>
          </div>
          Advanced Settings
        </h2>
        <p className="text-slate-100 text-sm mt-1.5">Add tags and labels to organize your resources</p>
      </div>
      <div className="p-8">
        <TagEditor
          tags={formValue.tags}
          onChange={(tags) => onChange({ tags })}
        />
      </div>
    </div>
  );
}

