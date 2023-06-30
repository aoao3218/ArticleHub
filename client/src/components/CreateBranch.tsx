import { useState } from 'react';
import FailedMessage from './FailedMessage';
import { toast } from 'react-toastify';

interface CreateProps {
  projectId?: string;
  onClose: () => void;
  create: () => void;
}

const CreateBranch: React.FC<CreateProps> = ({ projectId, onClose, create }) => {
  const [Name, setName] = useState('');
  const jwt = localStorage.getItem('jwt');
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreate = () => {
    fetch(`http://localhost:3000/api/branch/${projectId}`, {
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
          Create Branch
        </p>
        {message && <FailedMessage mgs={mgs} />}
        <input type="text" value={Name} onChange={handleNameChange} placeholder="Branch Name" />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default CreateBranch;
