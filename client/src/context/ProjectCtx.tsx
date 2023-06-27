import React, { useState } from 'react';

interface Branch {
  _id: string;
  name: string;
  createBy: string;
  merge_request: boolean;
}
interface Project {
  _id: string;
  name: string;
  team_id: string;
  main: string;
  createBy: string;
  branch: Branch[];
}

interface ProjectContextValue {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const ProjectCtx = React.createContext<ProjectContextValue>({
  projects: [],
  setProjects: () => {},
});

export const ProjectCtxProvider = ({ children }: any) => {
  const [projects, setProjects] = useState<Project[]>([]);

  return <ProjectCtx.Provider value={{ projects, setProjects }}>{children}</ProjectCtx.Provider>;
};
