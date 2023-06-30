import { useState } from 'react';
import { toast } from 'react-toastify';
interface Props {
  toSignIn: () => void;
}

const SignUP = ({ toSignIn }: Props) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = async () => {
    fetch('http://localhost:3000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        toast.success('Create Success!!');
        toSignIn();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  return (
    <div className="column">
      <h4>Join Medium.</h4>
      {/* {message && <MessagePOP msg={mgs} onClose={() => setMessage(false)} />} */}
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
