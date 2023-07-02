import { Link, NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { JWTCtx } from '../context/JWTCtx';

const Header = () => {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const [menu, setMenu] = useState(false);
  const { setJWT } = useContext(JWTCtx);
  const navigate = useNavigate();

  const handleAccountClick = () => {
    setMenu(!menu);
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setMenu(!menu);
    setJwt('');
    setJWT('');
    return navigate('/');
  };

  return (
    <div>
      <div className="header">
        <h3 style={{ margin: 'auto 0' }}>
          <Link to={'/'}>ArticleHub</Link>
        </h3>
        {jwt ? (
          <div className="row" style={{ margin: 'auto 0' }}>
            <NavLink to={`/publish`} style={{ margin: 'auto 20px' }}>
              Publish
            </NavLink>
            <NavLink to={`/profile`} style={{ margin: 'auto 20px' }}>
              Profile
            </NavLink>
            <div onClick={handleAccountClick} className="account">
              Account
            </div>
          </div>
        ) : (
          <div style={{ margin: 'auto 0' }}>
            <NavLink to={`/publish`} style={{ margin: 'auto 20px' }}>
              Publish
            </NavLink>
            <Link to={`/account`} style={{ color: '#ffff' }}>
              <button>Sign In</button>
            </Link>
          </div>
        )}
      </div>
      {menu && <Menu handleSignOut={handleSignOut} />}
    </div>
  );
};

export default Header;
