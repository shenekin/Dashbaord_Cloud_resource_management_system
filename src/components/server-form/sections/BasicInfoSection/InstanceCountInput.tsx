'use client';

interface InstanceCountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function InstanceCountInput({ value, onChange }: InstanceCountInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Instance Count</label>
      <input
        type="number"
        min="1"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

