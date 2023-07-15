import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface Branch {
  name: string;
  createBy: string;
}

interface ArticleProps {
  team: string;
  articles: Array<{
    article_id: string;
    title: string;
  }>;
  project: {
    _id: string;
    name: string;
    team_id: string;
    main: string;
    createBy: string;
    branch: Branch[];
  };
  currentBranch: string;
}

const Article = ({ team, articles, project, currentBranch }: ArticleProps) => {
  const { teamId } = useParams();
  return (
    <div>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {articles.map((article) => (
              <Link
                to={`/article/${teamId}-${team}/${project._id}-${project.name}/${currentBranch}/${article.article_id}`}
                style={{ display: 'block', width: '100%', cursor: 'pointer' }}
              >
                <td>
                  <div style={{ margin: '0', overflowWrap: 'anywhere' }}>{article.title}</div>
                </td>
              </Link>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Article;
