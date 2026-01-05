'use client';

interface AutoTerminateTimePickerProps {
  value?: string;
  onChange: (value?: string) => void;
}

export default function AutoTerminateTimePicker({ value, onChange }: AutoTerminateTimePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Auto Terminate Time (Optional)</label>
      <input
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

