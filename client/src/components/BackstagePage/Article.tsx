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
      <ul>
        {articles.map((article) => (
          <Link to={`/article/${teamId}-${team}/${project._id}-${project.name}/${currentBranch}/${article.article_id}`}>
            <li>{article.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Article;
