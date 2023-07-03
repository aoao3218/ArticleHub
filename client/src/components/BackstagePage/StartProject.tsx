import CreateProject from '../CreateProject';
import { useState, useContext } from 'react';
import { ProjectCtx } from '../../context/ProjectCtx';
import { useParams } from 'react-router-dom';
import { TeamCtx } from '../../context/TeamCtx';

const StartProject = () => {
  const [isCreateProject, setCreateProject] = useState(false);
  const { setProjects } = useContext(ProjectCtx);
  const { teamId } = useParams();
  const { teams } = useContext(TeamCtx);
  const team = teams.find((team) => team._id == teamId);
  const jwt = localStorage.getItem('jwt');
  const domain = window.location.host;
  const protocol = window.location.protocol;

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

  return (
    <div
      className="content"
      style={{
        width: '100%',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'calc(100vh - 61px)',
      }}
    >
      {isCreateProject && <CreateProject onClose={closeProject} create={createProject} />}
      {team?.own && (
        <div style={{ textAlign: 'center', marginTop: '35vh' }}>
          <div style={{ margin: '24px auto', fontSize: '24px' }}>Please Create Project to Manage Your Articles</div>
          <div>
            <button
              onClick={() => {
                setCreateProject(true);
              }}
            >
              Create Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartProject;
