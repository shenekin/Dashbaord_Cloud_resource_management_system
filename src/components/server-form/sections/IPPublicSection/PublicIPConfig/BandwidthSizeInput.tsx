'use client';

interface BandwidthSizeInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function BandwidthSizeInput({ value, onChange, disabled = false }: BandwidthSizeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth Size (Mbps)</label>
      <input
        type="number"
        min="1"
        max="2000"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

