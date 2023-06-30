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
              <td>
                <Link
                  to={`/article/${teamId}-${team}/${project._id}-${project.name}/${currentBranch}/${article.article_id}`}
                  style={{ display: 'block', width: '100%', cursor: 'pointer' }}
                >
                  {article.title}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Article;
