'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface Project {
  projectId: string;
  projectName: string;
  regionScope: string[];
  quota: {
    [key: string]: number;
  };
}

interface ProjectContextType {
  project: Project | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children, project }: { children: ReactNode; project: Project | null }) {
  return <ProjectContext.Provider value={{ project }}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

