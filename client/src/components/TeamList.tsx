import { useContext, useState, useEffect } from 'react';
import { TeamCtx } from '../context/TeamCtx';
import { Link } from 'react-router-dom';
import CreateTeam from './CreateTeam';
import MessagePOP from './MessagePOP';

const TeamList = () => {
  const { teams, setTeams } = useContext(TeamCtx);
  const [user, setUser] = useState<string | null>(null);
  const [isOpen, setCreateTeam] = useState(false);
  const jwt = localStorage.getItem('jwt');
  const [message, setMessage] = useState(false);

  function getTeams() {
    fetch('http://localhost:3000/api/team', {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/user/profile', {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => setUser(data.name))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createSuccess = () => {
    setCreateTeam(false);
    setMessage(true);
    getTeams();
  };

  const closeCreateTeam = () => {
    setCreateTeam(false);
  };

  return (
    <div>
      {isOpen && <CreateTeam onClose={closeCreateTeam} create={createSuccess} />}
      {message && <MessagePOP msg={'create success'} onClose={() => setMessage(false)} />}
      <div className="profile">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="user">{user}</p>
          <button onClick={() => setCreateTeam(true)}>create Team</button>
        </div>
        <div className="tabs">
          <span className="tab">Teams</span>
        </div>
        <ul>
          {teams.map((team) => (
            <Link to={`/team/${team._id}`} key={team._id}>
              <li>{team.name}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamList;
