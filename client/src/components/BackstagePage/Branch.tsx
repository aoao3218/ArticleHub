import { Link } from 'react-router-dom';

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
  return (
    <div>
      <ul>
        {project.branch.map((branch) => (
          <li className="row" style={{ justifyContent: 'space-between' }}>
            {branch.name}
            <div>
              {branch.merge_request && (
                <Link to={`/compare/merge/${project._id}-${project.name}/${branch.name}`}>
                  <button>merge</button>
                </Link>
              )}
              <button style={{ marginLeft: '16px' }}>delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Branch;
