import { useState, useContext, useEffect } from 'react';
import CreateProject from '../CreateProject';
import { Link, useParams } from 'react-router-dom';
import { TeamCtx } from '../../context/TeamCtx';
import { ProjectCtx } from '../../context/ProjectCtx';
import InviteMember from '../InviteMember';
import MessagePOP from '../MessagePOP';

const Navbar = () => {
  const { teamId } = useParams();
  const { teams } = useContext(TeamCtx);
  const { projectId } = useParams();
  const { projects, setProjects } = useContext(ProjectCtx);
  const [isCreateProject, setCreateProject] = useState(false);
  const [invite, setInvite] = useState(false);
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');
  const jwt = localStorage.getItem('jwt');
  const [tab, setTab] = useState(projectId);

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
        console.log(data);
        setProjects(data);
      })
      .catch((err) => console.log(err));
  };

  const closeInvite = () => {
    setInvite(false);
  };

  const inviteSuccess = () => {
    setInvite(false);
  };

  const team = teams.find((team) => team._id == teamId);

  if (!team || !projects) {
    return <div>no team</div>;
  }
  return (
    <div className="navbar">
      {isCreateProject && <CreateProject onClose={closeProject} create={createProject} />}
      {invite && <InviteMember onClose={closeInvite} create={inviteSuccess} teamId={teamId} />}
      {message && <MessagePOP msg={mgs} onClose={() => setMessage(false)} />}
      <div>
        <div style={{ marginTop: '20px' }}>
          <Link to={'/profile'}>
            <span style={{ marginRight: '8px' }}>&lt;</span>back to teams
          </Link>
        </div>
        <h2 style={{ margin: '24px 0' }}>{team.name}</h2>
        <ul>
          {projects.map((project) => (
            <Link to={`${project._id}`} key={project._id}>
              <li
                className={`nav ${tab === `${project._id}` ? 'navbarActive' : ''}`}
                onClick={() => setTab(project._id)}
              >
                {project.name}
              </li>
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
