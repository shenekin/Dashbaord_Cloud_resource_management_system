'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface ResourceContextValue {
  resourceType: string;
  action: string;
  dryRun: boolean;
}

interface ResourceContextType {
  resource: ResourceContextValue;
  setResource: (resource: ResourceContextValue) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export function ResourceProvider({ 
  children, 
  resource, 
  setResource 
}: { 
  children: ReactNode; 
  resource: ResourceContextValue;
  setResource: (resource: ResourceContextValue) => void;
}) {
  return <ResourceContext.Provider value={{ resource, setResource }}>{children}</ResourceContext.Provider>;
}

export function useResource() {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
}

