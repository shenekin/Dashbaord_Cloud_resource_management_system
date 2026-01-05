'use client';

interface PrivateIPInputProps {
  value?: string;
  onChange: (value?: string) => void;
}

export default function PrivateIPInput({ value, onChange }: PrivateIPInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Private IP (Optional)</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="e.g., 192.168.1.100"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

