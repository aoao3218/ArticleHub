import { Link } from 'react-router-dom';

interface Branch {
  name: string;
  createBy: string;
}

interface ArticleProps {
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

const Article = ({ articles, project, currentBranch }: ArticleProps) => {
  return (
    <div>
      <ul>
        {articles.map((article) => (
          <Link to={`/article/${project._id}/${currentBranch}/${article.article_id}`} key={article.article_id}>
            <li>{article.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Article;
