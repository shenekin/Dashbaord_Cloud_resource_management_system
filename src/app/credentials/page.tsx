'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn, saveCredentialToLocalStorage, getCredentialsFromLocalStorage, deleteCredentialFromLocalStorage, LocalCredential } from '@/lib/utils';
import CustomerSelector from '@/components/credentials/CustomerSelector';
import ProviderSelector from '@/components/credentials/ProviderSelector';
import CredentialForm from '@/components/credentials/CredentialForm';
import CredentialList from '@/components/credentials/CredentialList';

export interface Credential {
  id: string;
  customer: string;
  provider: string;
  accessKey: string;
  secretKey: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Credentials Management Page
 * Manages cloud provider credentials (AK/SK) for different customers and providers
 * Credentials are saved to local storage for use in ECS creation
 */
export default function CredentialsPage() {
  const { sidebarCollapsed } = useUIStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Ekin');
  const [selectedProvider, setSelectedProvider] = useState<string>('Huawei');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Load credentials from local storage on component mount
   */
  useEffect(() => {
    const storedCredentials = getCredentialsFromLocalStorage();
    setCredentials(storedCredentials);
  }, []);

  /**
   * Handle credential submission
   * Saves credential to local storage and updates state
   */
  const handleCredentialSubmit = (accessKey: string, secretKey: string) => {
    const newCredential: LocalCredential = {
      id: `cred-${Date.now()}`,
      customer: selectedCustomer,
      provider: selectedProvider,
      accessKey,
      secretKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveCredentialToLocalStorage(newCredential);
    const updatedCredentials = getCredentialsFromLocalStorage();
    setCredentials(updatedCredentials);
    setRefreshKey((prev) => prev + 1);
  };

  /**
   * Handle credential deletion
   * Removes credential from local storage and updates state
   */
  const handleDeleteCredential = (id: string) => {
    deleteCredentialFromLocalStorage(id);
    const updatedCredentials = getCredentialsFromLocalStorage();
    setCredentials(updatedCredentials);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Credentials Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage cloud provider credentials (Access Key / Secret Key) for customers
                </p>
              </div>
            </div>
          </div>

          {/* Selectors Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <CustomerSelector
                value={selectedCustomer}
                onChange={setSelectedCustomer}
              />
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <ProviderSelector
                value={selectedProvider}
                onChange={setSelectedProvider}
              />
            </div>
          </div>

          {/* Credential Form Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
            <CredentialForm
              customer={selectedCustomer}
              provider={selectedProvider}
              onSubmit={handleCredentialSubmit}
            />
          </div>

          {/* Credential List Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <CredentialList
              credentials={credentials.filter(
                (cred) => cred.customer === selectedCustomer && cred.provider === selectedProvider
              )}
              onDelete={handleDeleteCredential}
              key={refreshKey}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

