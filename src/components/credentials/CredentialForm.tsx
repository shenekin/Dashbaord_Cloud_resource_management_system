'use client';

import { useState } from 'react';

interface CredentialFormProps {
  customer: string;
  provider: string;
  onSubmit: (accessKey: string, secretKey: string) => void;
}

/**
 * Credential Form Component
 * Form for entering Access Key (AK) and Secret Key (SK)
 */
export default function CredentialForm({ customer, provider, onSubmit }: CredentialFormProps) {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [errors, setErrors] = useState<{ accessKey?: string; secretKey?: string }>({});

  const validate = () => {
    const newErrors: { accessKey?: string; secretKey?: string } = {};
    
    if (!accessKey.trim()) {
      newErrors.accessKey = 'Access Key is required';
    }
    
    if (!secretKey.trim()) {
      newErrors.secretKey = 'Secret Key is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(accessKey.trim(), secretKey.trim());
      setAccessKey('');
      setSecretKey('');
      setErrors({});
    }
  };

  const handleReset = () => {
    setAccessKey('');
    setSecretKey('');
    setErrors({});
    setShowSecretKey(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Credential Form</h2>
        <p className="text-sm text-gray-600">
          Enter Access Key (AK) and Secret Key (SK) for <span className="font-semibold">{customer}</span> - <span className="font-semibold">{provider}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Access Key Input */}
        <div>
          <label htmlFor="access-key" className="block text-sm font-semibold text-gray-700 mb-2">
            Access Key (AK) <span className="text-red-500">*</span>
          </label>
          <input
            id="access-key"
            type="text"
            value={accessKey}
            onChange={(e) => {
              setAccessKey(e.target.value);
              if (errors.accessKey) {
                setErrors((prev) => ({ ...prev, accessKey: undefined }));
              }
            }}
            placeholder="Enter Access Key"
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              bg-white text-gray-900 transition-all duration-200 shadow-sm
              ${errors.accessKey ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
            `}
            aria-label="Access Key input"
            aria-invalid={!!errors.accessKey}
            aria-describedby={errors.accessKey ? 'access-key-error' : undefined}
          />
          {errors.accessKey && (
            <p id="access-key-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.accessKey}
            </p>
          )}
        </div>

        {/* Secret Key Input */}
        <div>
          <label htmlFor="secret-key" className="block text-sm font-semibold text-gray-700 mb-2">
            Secret Key (SK) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="secret-key"
              type={showSecretKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                if (errors.secretKey) {
                  setErrors((prev) => ({ ...prev, secretKey: undefined }));
                }
              }}
              placeholder="Enter Secret Key"
              className={`
                w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white text-gray-900 transition-all duration-200 shadow-sm
                ${errors.secretKey ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
              `}
              aria-label="Secret Key input"
              aria-invalid={!!errors.secretKey}
              aria-describedby={errors.secretKey ? 'secret-key-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
            >
              {showSecretKey ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.secretKey && (
            <p id="secret-key-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.secretKey}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Credentials
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

