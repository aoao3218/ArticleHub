interface MenuProps {
  handleSignOut: () => void;
}

const Menu = ({ handleSignOut }: MenuProps) => {
  return (
    <div className="menu">
      <div onClick={handleSignOut} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Logout
      </div>
    </div>
  );
};

export default Menu;
