import { useState, useContext, useEffect } from 'react';
import { ArticleCtx } from '../../context/ArticleCtx';
import { useParams } from 'react-router-dom';

interface Article {
  article_id: string;
  title: string;
}

const ArticleList = () => {
  const jwt = localStorage.getItem('jwt');
  const { branch } = useParams();
  const { projectId } = useParams();
  const { setArticleId } = useContext(ArticleCtx);
  const [id, name]: string[] = projectId?.split('-') ?? [];
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState('');
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/branch/compare/${id}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setArticles(data);
        setArticleId(data[0].article_id);
        setTab(data[0].article_id);
      })
      .catch((err) => console.log(err));
  }, [projectId, branch]);

  return (
    <div className="navbar">
      <div>
        <h2 style={{ margin: '32px 0px' }}>{name}</h2>
        <p>change articles</p>
        <ul>
          {articles.map((article) => (
            <li
              onClick={() => {
                setArticleId(article.article_id);
                setTab(article.article_id);
              }}
              className={`nav ${tab === `${article.article_id}` ? 'navbarActive' : ''}`}
            >
              {article.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticleList;
