'use client';

interface PrivateIPInputProps {
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}

export default function PrivateIPInput({ value, onChange, disabled = false }: PrivateIPInputProps) {
  return (
    <div>
      <label htmlFor="private-ip" className="block text-sm font-semibold text-gray-700 mb-2">
        Private IP Address <span className="text-gray-500 font-normal text-xs">(Optional)</span>
      </label>
      <input
        id="private-ip"
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="e.g., 192.168.1.100"
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 placeholder:text-gray-400 ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'border-gray-200'
        }`}
      />
      <p className="mt-2 text-xs text-gray-500">
        Leave empty to auto-assign an IP address from the subnet
      </p>
    </div>
  );
}

