'use client';

interface IPv6SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function IPv6Switch({ checked, onChange, disabled = false }: IPv6SwitchProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id="ipv6"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-5 h-5 text-cyan-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-pointer"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="ipv6" className="text-sm font-semibold text-gray-900 cursor-pointer block mb-1">
          Enable IPv6
        </label>
        <p className="text-xs text-gray-600 leading-relaxed">
          Enable IPv6 addressing for your server instance
        </p>
      </div>
    </div>
  );
}

