import { Link } from 'react-router-dom';
import { useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleAccountClick = () => {
    setMenu(!menu);
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setMenu(!menu);
    setJwt('');
    return navigate('/');
  };

  return (
    <div>
      <div className="header">
        <h3 style={{ margin: 'auto 0' }}>
          <Link to={'/'}>Medium</Link>
        </h3>
        {jwt ? (
          <button onClick={handleAccountClick}>Account</button>
        ) : (
          <button>
            <Link to={`/account`} style={{ color: '#ffff' }}>
              Sign In
            </Link>
          </button>
        )}
      </div>
      {menu && <Menu handleSignOut={handleSignOut} />}
    </div>
  );
};

export default Header;
