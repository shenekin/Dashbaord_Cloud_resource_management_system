'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { IdentityProvider } from '@/contexts/IdentityContext';
import { Project } from '@/contexts/ProjectContext';
import { Identity } from '@/contexts/IdentityContext';

/**
 * Global Providers
 * Includes QueryClient, ProjectProvider, and IdentityProvider
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [project, setProject] = useState<Project | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);

  // Load project and identity from localStorage or API
  useEffect(() => {
    // Load project from localStorage or fetch from API
    if (typeof window !== 'undefined') {
      const storedProject = localStorage.getItem('current-project');
      if (storedProject) {
        try {
          setProject(JSON.parse(storedProject));
        } catch (e) {
          console.error('Failed to parse stored project:', e);
        }
      } else {
        // Set default project for development
        setProject({
          projectId: 'default-project',
          projectName: 'Default Project',
          regionScope: ['cn-north-1', 'cn-east-2', 'cn-south-1'],
          quota: {
            instanceCount: 100,
            cpu: 1000,
            memory: 2048,
          },
        });
      }

      // Load identity from localStorage or fetch from API
      const storedUser = localStorage.getItem('auth-user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIdentity({
            userId: user.id || '',
            username: user.username || '',
            roles: user.roles || [],
            permissions: user.permissions || [],
          });
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      } else {
        // Set default identity for development
        setIdentity({
          userId: 'default-user',
          username: 'admin',
          roles: ['admin'],
          permissions: ['*'],
        });
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider project={project}>
        <IdentityProvider identity={identity}>
          {children}
        </IdentityProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

