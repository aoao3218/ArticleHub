import { Link } from 'react-router-dom';

interface MenuProps {
  handleSignOut: () => void;
}

const Menu = ({ handleSignOut }: MenuProps) => {
  return (
    <div className="menu">
      <Link to={`/profile`}>
        <div style={{ padding: '8px 16px' }}>Profile</div>
      </Link>
      <div onClick={handleSignOut} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Logout
      </div>
    </div>
  );
};

export default Menu;
