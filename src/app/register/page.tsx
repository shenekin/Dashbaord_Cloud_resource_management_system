'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '../identity/components/AuthCard';
import AuthInput from '../identity/components/AuthInput';
import PasswordInput from '../identity/components/PasswordInput';
import ErrorAlert from '../identity/components/ErrorAlert';
import LoadingButton from '../identity/components/LoadingButton';
import { useAuth } from '../identity/hooks/useAuth';

/**
 * Register page
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/identity/profile');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password, confirmPassword });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account" subtitle="Sign up to get started">
      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="username"
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <AuthInput
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <div className="mb-4">
          <label className="flex items-start text-sm">
            <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" required />
            <span className="ml-2 text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <LoadingButton type="submit" loading={loading}>
          Create Account
        </LoadingButton>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
