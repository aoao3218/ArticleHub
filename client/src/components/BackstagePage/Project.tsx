import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectCtx } from '../../context/ProjectCtx';
import { Link } from 'react-router-dom';
import { TeamCtx } from '../../context/TeamCtx';
import CreateBranch from '../CreateBranch';
import Article from './Article';
import Branch from './Branch';
import Publish from './Publish';
import { useErrorBoundary } from 'react-error-boundary';

interface Article {
  article_id: string;
  title: string;
}

const Project = () => {
  const { showBoundary } = useErrorBoundary();
  const jwt = localStorage.getItem('jwt');
  const { projectId } = useParams();
  const { teamId } = useParams();
  const { teams } = useContext(TeamCtx);
  const team = teams.find((team) => team._id == teamId);
  const { projects, setProjects } = useContext(ProjectCtx);
  const [openBranch, setCreateBranch] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState<string>('article');
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/article/all/${projectId}/${currentBranch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          showBoundary(res);
          return;
        }
        return res.json();
      })
      .then((data) => setArticles(data))
      .catch((err) => console.log(err));
  }, [projectId, currentBranch]);

  const closeCreateBranch = () => {
    setCreateBranch(false);
  };

  const createBranch = () => {
    setCreateBranch(false);
    fetch(`${protocol}//${domain}/api/project/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));
  };

  const project = projects.find((item) => item._id === projectId);

  if (!team || !project) {
    return <div>no projects</div>;
  }
  return (
    <div className="content" style={{ width: '100%', margin: 'auto', backgroundColor: '#FAFAFA', overflowY: 'scroll' }}>
      {openBranch && <CreateBranch onClose={closeCreateBranch} create={createBranch} projectId={projectId} />}
      <div className="row btw" style={{ marginBottom: '32px' }}>
        <div className="row" style={{ margin: '32px 0' }}>
          <h2 style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h2>
          <span style={{ margin: 'auto 8px' }}>&gt;</span>
          <select name="branch" value={currentBranch} onChange={(e) => setCurrentBranch(e.target.value)}>
            <option key="main" value={'main'}>
              main
            </option>
            {project.branch.map((obj) => (
              <option key={obj.name} value={obj.name}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          {currentBranch !== 'main' && (
            <Link
              to={`/compare/mergeRequest/${projectId}-${project.name}/${currentBranch}`}
              style={{ color: '#ffff', margin: 'auto' }}
            >
              <button style={{ marginLeft: '12px' }}>combine to main</button>
            </Link>
          )}
          <button
            style={{ marginLeft: '12px' }}
            onClick={() => {
              setCreateBranch(true);
            }}
          >
            new branch
          </button>
          <Link
            to={`/article/${teamId}-${team.name}/${projectId}-${project.name}/${currentBranch}`}
            style={{ color: '#ffff', margin: 'auto' }}
          >
            <button style={{ marginLeft: '12px' }}>+ new draft</button>
          </Link>
        </div>
      </div>
      <div className="tabs" style={{ textAlign: 'left' }}>
        <span
          className={`tab ${tab === 'article' ? 'tabActive' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setTab('article')}
        >
          Draft
        </span>
        {team.own && (
          <span
            className={`tab ${tab === 'branch' ? 'tabActive' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setTab('branch')}
          >
            Branch Control
          </span>
        )}
        {team.own && (
          <span
            className={`tab ${tab === 'publish' ? 'tabActive' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setTab('publish')}
          >
            Publish
          </span>
        )}
      </div>
      {tab == 'article' && (
        <Article team={team.name} articles={articles} project={project} currentBranch={currentBranch} />
      )}
      {tab === 'branch' && <Branch project={project} />}
      {tab === 'publish' && <Publish />}
    </div>
  );
};

export default Project;
