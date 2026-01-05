'use client';

interface ServerNameInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function ServerNameInput({ value, error, onChange }: ServerNameInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter server name"
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

