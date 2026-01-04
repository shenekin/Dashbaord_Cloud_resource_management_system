'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className={cn('pt-16 pb-12 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <p className="text-gray-600">Project management interface coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

