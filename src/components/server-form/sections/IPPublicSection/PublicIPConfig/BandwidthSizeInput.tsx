'use client';

interface BandwidthSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function BandwidthSizeInput({ value, onChange }: BandwidthSizeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth Size (Mbps)</label>
      <input
        type="number"
        min="1"
        max="2000"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

