import { useContext, useState, useEffect } from 'react';
import { TeamCtx } from '../context/TeamCtx';
import { Link } from 'react-router-dom';
import CreateTeam from './CreateTeam';

const TeamList = () => {
  const { teams, setTeams } = useContext(TeamCtx);
  const [user, setUser] = useState<string | null>(null);
  const [isOpen, setCreateTeam] = useState(false);
  const jwt = localStorage.getItem('jwt');
  const domain = window.location.host;
  const protocol = window.location.protocol;

  function getTeams() {
    fetch(`${protocol}//${domain}/api/team`, {
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
    fetch(`${protocol}//${domain}/api/user/profile`, {
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
    getTeams();
  };

  const closeCreateTeam = () => {
    setCreateTeam(false);
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', height: 'calc(100vh - 61px)' }}>
      {isOpen && <CreateTeam onClose={closeCreateTeam} create={createSuccess} />}
      <div className="profile">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="user">{user}</p>
          <button onClick={() => setCreateTeam(true)}>create Team</button>
        </div>
        <div className="tabs">
          <span className="tab tabActive">Teams</span>
        </div>
        {teams.length !== 0 ? (
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                {teams.map((team) => (
                  <td key={team._id}>
                    <Link to={`/team/${team._id}`} style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
                      {team.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div
            style={{
              width: 'auto',
              height: '320px',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            You Don't Have any Teams
            <br />
            Please Create Your Team
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
