import React, { useState } from 'react';

interface JWTContextValue {
  jwt: string;
  setJWT: (jwt: string) => void;
}

export const JWTCtx = React.createContext<JWTContextValue>({
  jwt: '',
  setJWT: () => {},
});

export const JWTCtxProvider = ({ children }: any) => {
  const [jwt, setJWT] = useState<string>('');

  return <JWTCtx.Provider value={{ jwt, setJWT }}>{children}</JWTCtx.Provider>;
};
