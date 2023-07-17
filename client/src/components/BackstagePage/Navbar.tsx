import { useState, useContext, useEffect } from 'react';
import CreateProject from '../CreateProject';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TeamCtx } from '../../context/TeamCtx';
import { ProjectCtx } from '../../context/ProjectCtx';
import InviteMember from '../InviteMember';
import { useErrorBoundary } from 'react-error-boundary';
import MemberList from '../MemberList';

const Navbar = () => {
  const { showBoundary } = useErrorBoundary();
  const { teamId } = useParams();
  const { teams } = useContext(TeamCtx);
  const { projectId } = useParams();
  const { projects, setProjects } = useContext(ProjectCtx);
  const [isCreateProject, setCreateProject] = useState(false);
  const [invite, setInvite] = useState(false);
  const jwt = localStorage.getItem('jwt');
  const [tab, setTab] = useState(projectId);
  const [member, setMember] = useState(false);
  const navigate = useNavigate();
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => setTab(projectId), [projectId]);

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/project/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          showBoundary(res);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        if (data.length > 0) {
          setTab(data[0]._id);
          navigate(`/team/${teamId}/${data[0]._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [teamId]);

  const closeProject = () => {
    setCreateProject(false);
  };

  const createProject = () => {
    setCreateProject(false);
    fetch(`${protocol}//${domain}/api/project/${teamId}`, {
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

  const closeMember = () => {
    setMember(false);
  };

  const inviteSuccess = () => {
    setInvite(false);
  };

  const team = teams.find((team) => team._id == teamId);

  const exists = projects.some((obj) => obj._id === projectId);

  if (projectId && !exists) navigate('notfound');

  if (!team || !projects) {
    return <div>no team</div>;
  }
  return (
    <div className="navbar">
      {isCreateProject && <CreateProject onClose={closeProject} create={createProject} />}
      {invite && <InviteMember onClose={closeInvite} create={inviteSuccess} teamId={teamId} />}
      {member && <MemberList onClose={closeMember} teamId={teamId} />}
      <div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Link to={'/profile'}>
            <span style={{ marginRight: '8px' }}>&lt;</span>back to teams
          </Link>
          <img
            src="../Users.svg"
            alt="members"
            style={{ width: '20px', height: '20px', margin: 'auto 0' }}
            onClick={() => setMember(true)}
          />
        </div>
        <h2 style={{ margin: '24px 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</h2>
        <ul style={{ overflowY: 'scroll' }}>
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
