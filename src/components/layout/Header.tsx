'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Menu, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/app/identity/store/authStore';
import { useUIStore } from '@/store/useUIStore';
import { authApi } from '@/services/authApi';
import PasswordInput from '@/app/identity/components/PasswordInput';
import ErrorAlert from '@/app/identity/components/ErrorAlert';
import LoadingButton from '@/app/identity/components/LoadingButton';

/**
 * Global Header component
 */
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { user, token, isAuthenticated, setAuth, init } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  // Initialize auth state
  useEffect(() => {
    init();
  }, [init]);

  // Refresh user info when component mounts or token changes
  useEffect(() => {
    const refreshUserInfo = async () => {
      if (isAuthenticated && token) {
        try {
          const verifyData = await authApi.verifyToken();
          const userInfo = await authApi.getUserById(verifyData.user_id);
          const updatedUser = {
            id: String(userInfo.user_id || ''),
            username: userInfo.username || '',
            email: userInfo.email || '',
            createdAt: userInfo.created_at || new Date().toISOString(),
            updatedAt: userInfo.updated_at || new Date().toISOString(),
          };
          setAuth(updatedUser, token);
        } catch (error) {
          console.error('Failed to refresh user info:', error);
        }
      }
    };

    refreshUserInfo();
  }, [isAuthenticated, token, setAuth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-user');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
    }
    window.location.href = '/login';
  };

  /**
   * Handle password change form submission
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (!user?.id) {
      setPasswordError('User information not available');
      return;
    }

    setPasswordLoading(true);

    try {
      // Call API to reset password (requires old_password and new_password)
      await authApi.resetPassword(parseInt(user.id), currentPassword, newPassword);
      
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.detail 
        || error.message 
        || 'Failed to change password. Please try again.';
      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  /**
   * Close password modal and reset form
   */
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <>
      <header className="h-16 bg-primary-dark text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="h-full flex items-center justify-between px-6">
          {/* Left: Logo and Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-primary/20 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold">
                CR
              </div>
              <span className="font-semibold text-lg hidden md:block">
                Cloud Resource Management
              </span>
            </div>
          </div>

          {/* Center: Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, projects, resources, tasks..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
              />
            </div>
          </form>

          {/* Right: Notifications and User Menu */}
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-md hover:bg-primary/20 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/20 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden md:block">{user?.username || 'User'}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={handleClosePasswordModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              {passwordError && (
                <div className="mb-4">
                  <ErrorAlert message={passwordError} onDismiss={() => setPasswordError('')} />
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">{passwordSuccess}</p>
                </div>
              )}

              <div className="space-y-4">
                <PasswordInput
                  id="currentPassword"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex-1">
                  <LoadingButton type="submit" loading={passwordLoading}>
                    Change Password
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
