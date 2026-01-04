'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

/**
 * Dashboard home page
 */
export default function DashboardPage() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main
        className={cn(
          'pt-16 pb-12 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Dashboard is under development
              </h2>
              <p className="text-gray-600 mb-6">
                The dashboard functionality is currently being developed.
              </p>
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Available APIs:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Authentication API - Login, Register, Token Refresh</li>
                  <li>User Management API - Create, Read, Update, Delete Users</li>
                  <li>Role Management API - Create, Read, Update, Assign Roles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
