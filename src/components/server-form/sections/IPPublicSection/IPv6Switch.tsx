'use client';

interface IPv6SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function IPv6Switch({ checked, onChange }: IPv6SwitchProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="ipv6"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <label htmlFor="ipv6" className="ml-2 text-sm text-gray-700">
        Enable IPv6
      </label>
    </div>
  );
}

