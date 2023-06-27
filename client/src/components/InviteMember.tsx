import React, { useState } from 'react';
import { EmailsCtx } from '../context/EmailCtx';
import MemberInput from './MemberInput';
import FailedMessage from './FailedMessage';

interface CreateProps {
  teamId?: string;
  onClose: () => void;
  create: () => void;
}

const InviteMember: React.FC<CreateProps> = ({ teamId, onClose, create }) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');
  const jwt = localStorage.getItem('jwt');

  const handleInvite = () => {
    fetch(`http://localhost:3000/api/team/${teamId}/member`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ emails }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setMessage(true);
          setMgs(data.errors);
          return;
        }
        create();
      })
      .catch((err) => {
        console.log(err);
        setMessage(true);
        setMgs(err.message);
      });
  };

  return (
    <div className="popup_bg">
      <div className="popup">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px auto 24px auto', alignContent: 'center' }}>
          Invite Member
        </p>
        {message && <FailedMessage mgs={mgs} />}
        <EmailsCtx.Provider value={{ emails, setEmails }}>
          <MemberInput />
        </EmailsCtx.Provider>
        <button onClick={handleInvite}>Invite</button>
      </div>
    </div>
  );
};

export default InviteMember;
