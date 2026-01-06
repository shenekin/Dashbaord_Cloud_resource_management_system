'use client';

interface ServerNameInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function ServerNameInput({ value, error, onChange }: ServerNameInputProps) {
  return (
    <div>
      <label htmlFor="name-input" className="block text-sm font-semibold text-gray-700 mb-2">
        Server Name <span className="text-red-500">*</span>
      </label>
      <input
        id="name-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., ecs-web-server-01"
        aria-label="Server name input"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'name-error' : undefined}
        maxLength={255}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 placeholder:text-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      />
      {error && (
        <p id="name-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

