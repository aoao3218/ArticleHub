import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { JWTCtx } from '../context/JWTCtx';

const SignUP = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { setJWT } = useContext(JWTCtx);
  const domain = window.location.host;
  const protocol = window.location.protocol;

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(userName, userEmail, userPassword);
    fetch(`${protocol}//${domain}/api/user/signup`, {
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
        setJWT(data.token);
        localStorage.setItem('jwt', data.token);
        return navigate('/');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  return (
    <div className="column">
      <h4>Join ArticleHub.</h4>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" onChange={(e) => setUserName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" onChange={(e) => setUserEmail(e.target.value)} />
        <label htmlFor="password">PassWord</label>
        <input type="password" name="password" onChange={(e) => setUserPassword(e.target.value)} />
        <button type="submit" style={{ margin: '20px 0px' }}>
          註冊
        </button>
      </form>
    </div>
  );
};

export default SignUP;
