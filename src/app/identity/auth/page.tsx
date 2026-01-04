'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import AuthInput from '../components/AuthInput';
import PasswordInput from '../components/PasswordInput';
import ErrorAlert from '../components/ErrorAlert';
import LoadingButton from '../components/LoadingButton';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!agreeToTerms) {
        setError('Please agree to the Terms and Privacy Policy');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({
          username: username || undefined,
          email: email || undefined,
          password,
        });
        router.push('/');
      } else {
        await register({
          username,
          email,
          password,
          confirmPassword,
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setRememberMe(false);
    setAgreeToTerms(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Image Background with Welcome Text */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(59, 130, 246, 0.85), rgba(30, 58, 138, 0.85)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center px-12 text-white">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border-4 border-white/30">
              <span className="text-4xl font-bold text-white">CR</span>
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Welcome to Ekin's Cloud Resource Management
            </h2>
            <p className="text-2xl font-semibold text-white/90">
              ONE-STOP-MANAGE-MULTIPLECLOUD
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login/Register Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

            {isLogin ? (
              <>
                {/* Login Form */}
                <AuthInput
                  id="login-identifier"
                  type="text"
                  label="Username or Email"
                  value={username || email}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes('@')) {
                      setEmail(value);
                      setUsername('');
                    } else {
                      setUsername(value);
                      setEmail('');
                    }
                  }}
                  placeholder="Enter your username or email"
                  required
                />

                <PasswordInput
                  id="login-password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/identity/forgot-password"
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Forgot password?
                  </Link>
                </div>

                <LoadingButton type="submit" loading={loading} className="w-full">
                  Sign In
                </LoadingButton>
              </>
            ) : (
              <>
                {/* Register Form */}
                <AuthInput
                  id="register-username"
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />

                <AuthInput
                  id="register-email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />

                <PasswordInput
                  id="register-password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <PasswordInput
                  id="register-confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary-dark">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary-dark">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <LoadingButton type="submit" loading={loading} className="w-full">
                  Create Account
                </LoadingButton>
              </>
            )}

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading authentication page...</div>}>
      <AuthForm />
    </Suspense>
  );
}

