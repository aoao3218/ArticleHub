import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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
  const { teamId } = useParams();

  return (
    <div>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {project.branch.map((branch) => (
              <td className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ margin: 'auto 0' }}>{branch.name}</span>
                <div>
                  {branch.merge_request && (
                    <Link to={`/compare/merge/${teamId}/${project._id}-${project.name}/${branch.name}`}>
                      <button className="btn_third">merge</button>
                    </Link>
                  )}
                  <button style={{ marginLeft: '16px' }} className="btn_third">
                    delete
                  </button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Branch;
