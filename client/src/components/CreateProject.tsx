import { useState } from 'react';
import { useParams } from 'react-router-dom';
import FailedMessage from './FailedMessage';

interface CreateProps {
  onClose: () => void;
  create: () => void;
}

const CreateProject: React.FC<CreateProps> = ({ onClose, create }) => {
  const jwt = localStorage.getItem('jwt');
  const params = useParams();
  const teamId = params.teamId;
  const [Name, setTeamName] = useState('');
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleCreate = () => {
    fetch(`http://localhost:3000/api/project/${teamId}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ name: Name }),
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
          Create Project
        </p>
        {message && <FailedMessage mgs={mgs} />}
        <input type="text" value={Name} onChange={handleNameChange} placeholder="Team Name" />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default CreateProject;
