'use client';

interface ImageSelectorProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function ImageSelector({ value, error, onChange }: ImageSelectorProps) {
  // TODO: Fetch images from API
  const images = [
    { value: 'ubuntu-20.04', label: 'Ubuntu 20.04' },
    { value: 'centos-7.9', label: 'CentOS 7.9' },
    { value: 'windows-2019', label: 'Windows Server 2019' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select image</option>
        {images.map((image) => (
          <option key={image.value} value={image.value}>
            {image.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

