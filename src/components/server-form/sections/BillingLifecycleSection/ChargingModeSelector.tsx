'use client';

interface ChargingModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ChargingModeSelector({ value, onChange }: ChargingModeSelectorProps) {
  const chargingModes = [
    { value: 'postPaid', label: 'Post-paid (Pay-as-you-go)' },
    { value: 'prePaid', label: 'Pre-paid (Subscription)' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Charging Mode</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        {chargingModes.map((mode) => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}

