import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { JWTCtx } from '../context/JWTCtx';

const SignIN = () => {
  const [userEmail, setUserEmail] = useState('1234@gmail.com');
  const [userPassword, setUserPassword] = useState('1234');
  const { setJWT } = useContext(JWTCtx);
  const navigate = useNavigate();
  const protocol = window.location.protocol;
  const domain = window.location.host;

  const handleSubmit = async () => {
    try {
      fetch(`${protocol}//${domain}/api/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword, provider: 'native' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            toast.error(data.errors);
            return;
          }
          setJWT(data.token);
          localStorage.setItem('jwt', data.token);
          return navigate('/');
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="column">
      <h4>Welcome back.</h4>
      <div className="form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        <label htmlFor="password">PassWord</label>
        <input type="password" id="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
        <button id="signInBtn" onClick={handleSubmit} style={{ margin: '20px 0px' }}>
          登入
        </button>
      </div>
    </div>
  );
};

export default SignIN;
