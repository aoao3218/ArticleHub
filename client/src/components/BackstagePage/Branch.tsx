import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProjectCtx } from '../../context/ProjectCtx';

interface Branch {
  _id: string;
  name: string;
  createBy: string;
  merge_request: boolean;
}

interface BranchProps {
  project: {
    _id: string;
    name: string;
    team_id: string;
    main: string;
    createBy: string;
    branch: Branch[];
  };
}

const Branch = ({ project }: BranchProps) => {
  const jwt = localStorage.getItem('jwt');
  const { setProjects } = useContext(ProjectCtx);
  const { teamId } = useParams();

  function getProject() {
    fetch(`http://localhost:3000/api/project/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));
  }

  const merge = (branch: string) => () => {
    fetch(`http://localhost:3000/api/branch/merge/${project._id}/${branch}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ teamId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        getProject();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <ul>
        {project.branch.map((branch) => (
          <li className="row" style={{ justifyContent: 'space-between' }}>
            {branch.name}
            <div>
              {branch.merge_request && <button onClick={merge(branch.name)}>merge</button>}
              <button style={{ marginLeft: '16px' }}>delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Branch;
