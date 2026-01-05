'use client';

interface DryRunSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function DryRunSwitch({ checked, onChange }: DryRunSwitchProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="dryRun"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <label htmlFor="dryRun" className="ml-2 text-sm text-gray-700">
        Enable Dry Run
      </label>
    </div>
  );
}

