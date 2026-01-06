'use client';

interface ImageSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  region?: string;
  disabled?: boolean;
}

export default function ImageSelector({ 
  value, 
  error, 
  onChange, 
  region,
  disabled = false 
}: ImageSelectorProps) {
  // TODO: Fetch images from API based on region
  const images = [
    { value: 'ubuntu-20.04', label: 'Ubuntu 20.04' },
    { value: 'centos-7.9', label: 'CentOS 7.9' },
    { value: 'windows-2019', label: 'Windows Server 2019' },
  ];

  return (
    <div>
      <label htmlFor="image-select" className="block text-sm font-semibold text-gray-700 mb-2">
        Operating System Image <span className="text-red-500">*</span>
      </label>
      <select
        id="image-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select operating system image"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'image-error' : undefined}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      >
        <option value="">Select an image</option>
        {images.map((image) => (
          <option key={image.value} value={image.value}>
            {image.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="image-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

