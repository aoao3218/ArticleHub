import { useState, useContext, useEffect } from 'react';
import CreateProject from '../CreateProject';
import { Link, useParams } from 'react-router-dom';
import { TeamCtx } from '../../context/TeamCtx';
import { ProjectCtx } from '../../context/ProjectCtx';
import InviteMember from '../InviteMember';
import SuccessMessage from '../SuccessMessage';

const Navbar = () => {
  const { teamId } = useParams();
  const { teams } = useContext(TeamCtx);
  const { projects, setProjects } = useContext(ProjectCtx);
  const [isCreateProject, setCreateProject] = useState(false);
  const [invite, setInvite] = useState(false);
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    fetch(`http://localhost:3000/api/project/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.log(err));
  }, [teamId]);

  const closeProject = () => {
    setCreateProject(false);
  };

  const createProject = () => {
    setCreateProject(false);
    setMessage(true);
    setMgs('create project');
    fetch(`http://localhost:3000/api/project/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.log(err));
  };

  const closeInvite = () => {
    setInvite(false);
  };

  const inviteSuccess = () => {
    setInvite(false);
    setMessage(true);
    setMgs('invite success');
  };

  const team = teams.find((team) => team._id == teamId);

  if (!team) {
    return <div>no team</div>;
  }
  return (
    <div className="navbar">
      {isCreateProject && <CreateProject onClose={closeProject} create={createProject} />}
      {invite && <InviteMember onClose={closeInvite} create={inviteSuccess} teamId={teamId} />}
      {message && <SuccessMessage msg={mgs} onClose={() => setMessage(false)} />}
      <div>
        <h2 style={{ margin: '32px 0px' }}>{team.name}</h2>
        <ul>
          {projects.map((project) => (
            <Link to={`${project._id}`} key={project._id}>
              <li>{project.name}</li>
            </Link>
          ))}
        </ul>
      </div>
      {team.own && (
        <div className="nav_down">
          <button
            className="nav_btn"
            onClick={() => {
              setCreateProject(true);
            }}
          >
            create project
          </button>
          <button
            className="nav_btn"
            onClick={() => {
              setInvite(true);
            }}
          >
            invite member
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
