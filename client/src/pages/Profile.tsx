import { useEffect, useContext } from 'react';
import { TeamCtx } from '../context/TeamCtx';
import TeamList from '../components/TeamList';
import Header from '../components/Header';

const Profile = () => {
  const { setTeams } = useContext(TeamCtx);
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    fetch('http://localhost:3000/api/team', {
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
