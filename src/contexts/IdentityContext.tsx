'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface Identity {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}

interface IdentityContextType {
  identity: Identity | null;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export function IdentityProvider({ children, identity }: { children: ReactNode; identity: Identity | null }) {
  return <IdentityContext.Provider value={{ identity }}>{children}</IdentityContext.Provider>;
}

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
}

