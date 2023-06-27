import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useCookies } from 'react-cookie';

const SignIN = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  // const [cookies, setCookie] = useCookies(['jwt']);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      fetch('http://localhost:3000/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword, provider: 'native' }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Login failed');
            return;
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
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
        <input type="email" id="email" onChange={(e) => setUserEmail(e.target.value)} />
        <label htmlFor="password">PassWord</label>
        <input type="password" id="password" onChange={(e) => setUserPassword(e.target.value)} />
        <button id="signInBtn" onClick={handleSubmit} style={{ margin: '20px 0px' }}>
          登入
        </button>
      </div>
    </div>
  );
};

export default SignIN;
