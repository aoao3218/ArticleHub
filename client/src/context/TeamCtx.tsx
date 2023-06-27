import React, { useState } from 'react';

interface Member {
  id: string;
  role: 'admin' | 'user';
}

interface Team {
  _id: string;
  name: string;
  owner: string;
  member: Member[];
  own: boolean;
}

interface TeamContextValue {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

export const TeamCtx = React.createContext<TeamContextValue>({
  teams: [],
  setTeams: () => {},
});

export const TeamCtxProvider = ({ children }: any) => {
  const [teams, setTeams] = useState<Team[] | []>([]);

  return <TeamCtx.Provider value={{ teams, setTeams }}>{children}</TeamCtx.Provider>;
};
