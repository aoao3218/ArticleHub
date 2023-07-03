import { useEffect, useContext } from 'react';
import { TeamCtx } from '../context/TeamCtx';
import TeamList from '../components/TeamList';
import Header from '../components/Header';

const Profile = () => {
  const { setTeams } = useContext(TeamCtx);
  const jwt = localStorage.getItem('jwt');
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/team`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Header />
      <TeamList />
    </div>
  );
};

export default Profile;
