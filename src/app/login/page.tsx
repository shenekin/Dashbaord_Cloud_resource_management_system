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
 * Login page
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);

    try {
      const isEmail = usernameOrEmail.includes('@');
      if (isEmail) {
        await login({ email: usernameOrEmail, password });
      } else {
        await login({ username: usernameOrEmail, password });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your account">
      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="usernameOrEmail"
          type="text"
          label="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          autoComplete="username"
          placeholder="Enter your username or email"
        />

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <LoadingButton type="submit" loading={loading}>
          Sign In
        </LoadingButton>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
