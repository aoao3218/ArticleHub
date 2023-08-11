import { useEffect, useContext } from 'react';
import { TeamCtx } from '../context/TeamCtx';
import TeamList from '../components/TeamList';
import Header from '../components/Header';

const Profile = () => {
  const { setTeams } = useContext(TeamCtx);

  useEffect(() => {
    const domain = window.location.host;
    const protocol = window.location.protocol;
    const jwt = localStorage.getItem('jwt');
    fetch(`${protocol}//${domain}/api/team`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          setTeams([]);
        }
      })
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
