'use client';

interface DryRunSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function DryRunSwitch({ checked, onChange }: DryRunSwitchProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id="dryRun"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Enable dry run mode"
          aria-describedby="dryRun-description"
          className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="dryRun" className="text-sm font-semibold text-gray-900 cursor-pointer block mb-1">
          Enable Dry Run
        </label>
        <p id="dryRun-description" className="text-xs text-gray-600 leading-relaxed">
          Preview changes without applying them. This allows you to validate your configuration before creating the server.
        </p>
      </div>
    </div>
  );
}

