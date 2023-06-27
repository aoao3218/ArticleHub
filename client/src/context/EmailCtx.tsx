import React from 'react';

interface EmailsContextValue {
  emails: string[];
  setEmails: (emails: string[]) => void;
}

export const EmailsCtx = React.createContext<EmailsContextValue>({
  emails: [],
  setEmails: () => {},
});
