'use client';

import { useState } from 'react';
import { generateSecurePassword } from '@/lib/utils';

interface AdminPasswordInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Administrator Password Input Component
 * 
 * Displays password input field with auto-generation capability.
 * Users can modify the generated password or regenerate a new one.
 * 
 * Features:
 * - Auto-generated secure password on page load
 * - Regenerate button for creating new passwords
 * - Show/Hide password toggle
 * - User can manually edit the generated password
 * - Backend-independent generation (no API calls)
 * - Password exists only in memory (never stored)
 */
export default function AdminPasswordInput({ 
  value, 
  error, 
  onChange, 
  disabled = false 
}: AdminPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle regenerate button click
   * Generates a new secure password and updates the form
   * Password is generated instantly without API calls
   */
  const handleRegenerate = () => {
    const newPassword = generateSecurePassword(16);
    onChange(newPassword);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700">
          Administrator Password <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={disabled}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Regenerate administrator password"
        >
          Regenerate
        </button>
      </div>
      <div className="relative">
        <input
          id="admin-password"
          type={showPassword ? 'text' : 'password'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a strong password (min 8 characters)"
          disabled={disabled}
          aria-label="Administrator password input"
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'admin-password-error' : undefined}
          className={`w-full px-4 py-3 border-2 rounded-xl pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 placeholder:text-gray-400 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 font-medium text-sm px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Must contain uppercase, lowercase, number, and special character
      </p>
      {error && (
        <p id="admin-password-error" className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

