import { useState } from 'react';
import FailedMessage from './FailedMessage';
import SuccessMessage from './SuccessMessage';

const SignUP = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mgs, setMgs] = useState('');

  const handleSubmit = async () => {
    fetch('http://localhost:3000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err);
        setFailed(true);
        setMgs(err.message);
      });
  };
  return (
    <div className="column">
      <h4>Join Medium.</h4>
      {success && <SuccessMessage msg={'create success'} onClose={() => setSuccess(false)} />}
      {failed && <FailedMessage mgs={mgs} />}
      <div className="form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" onChange={(e) => setUserName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={(e) => setUserEmail(e.target.value)} />
        <label htmlFor="password">PassWord</label>
        <input type="password" id="password" onChange={(e) => setUserPassword(e.target.value)} />
        <button id="signUpBtn" onClick={handleSubmit} style={{ margin: '20px 0px' }}>
          註冊
        </button>
      </div>
    </div>
  );
};

export default SignUP;
