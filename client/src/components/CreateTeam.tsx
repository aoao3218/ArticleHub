import { useState } from 'react';
import { EmailsCtx } from '../context/EmailCtx';
import MemberInput from './MemberInput';
import FailedMessage from './FailedMessage';
import { toast } from 'react-toastify';

interface CreateTeamProps {
  onClose: () => void;
  create: () => void;
}

const CreateTeam: React.FC<CreateTeamProps> = ({ onClose, create }) => {
  const [Name, setTeamName] = useState('');
  const [emails, setEmails] = useState<string[]>(['']);
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');

  const jwt = localStorage.getItem('jwt');

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleCreateTeam = () => {
    fetch('http://localhost:3000/api/team', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ name: Name, emails }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setMessage(true);
          toast.error(data.errors);
          return;
        }
        toast.success('Create Success');
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
          Create Team
        </p>
        {message && <FailedMessage mgs={mgs} />}
        <input type="text" value={Name} onChange={handleTeamNameChange} placeholder="Team Name" />
        <p style={{ margin: ' 20px auto 8px auto' }}>Member</p>
        <EmailsCtx.Provider value={{ emails, setEmails }}>
          <MemberInput />
        </EmailsCtx.Provider>
        <button onClick={handleCreateTeam}>Create</button>
      </div>
    </div>
  );
};

export default CreateTeam;
