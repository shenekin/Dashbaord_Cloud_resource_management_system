'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import PasswordInput from '../components/PasswordInput';
import ErrorAlert from '../components/ErrorAlert';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../hooks/useAuth';

/**
 * Settings page - Account settings
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait a bit for auth state to initialize from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (user) {
        setUsername(user.username);
        setEmail(user.email);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, user]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({ username, email });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Account Settings">
      <div className="space-y-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Update Profile */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <AuthInput
              id="username"
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <AuthInput
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <LoadingButton type="submit" loading={loading}>
              Update Profile
            </LoadingButton>
          </form>
        </div>

        {/* Change Password */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <PasswordInput
              id="currentPassword"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <LoadingButton type="submit" loading={loading}>
              Change Password
            </LoadingButton>
          </form>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Link
            href="/identity/profile"
            className="text-primary hover:underline text-sm font-medium"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
