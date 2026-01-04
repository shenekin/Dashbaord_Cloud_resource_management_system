'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../hooks/useAuth';

/**
 * Profile page - User profile (authenticated)
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Wait a bit for auth state to initialize from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Auto redirect to dashboard after 5 seconds
  useEffect(() => {
    if (isAuthenticated && !isChecking) {
      const redirectTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(redirectTimer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(redirectTimer);
    }
  }, [isAuthenticated, isChecking, router]);

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

  return (
    <AuthCard title="Profile">
      <div className="space-y-6">
        <div className="text-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Username</span>
            <span className="text-sm text-gray-900">{user.username}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <span className="text-sm text-gray-900">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Member Since</span>
            <span className="text-sm text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="text-center text-sm text-gray-600 mb-4">
            Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/identity/settings"
            className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Account Settings
          </Link>
          <button
            onClick={logout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
