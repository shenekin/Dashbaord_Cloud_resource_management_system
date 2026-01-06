'use client';

interface ChargingModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ChargingModeSelector({ value, onChange, error }: ChargingModeSelectorProps) {
  const chargingModes = [
    { value: 'postPaid', label: 'Post-paid (Pay-as-you-go)' },
    { value: 'prePaid', label: 'Pre-paid (Subscription)' },
  ];

  return (
    <div>
      <label htmlFor="charging-mode" className="block text-sm font-semibold text-gray-700 mb-2">
        Charging Mode
      </label>
      <select
        id="charging-mode"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select charging mode"
        aria-invalid={!!error}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      >
        {chargingModes.map((mode) => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

