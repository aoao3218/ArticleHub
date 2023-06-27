import { useParams, useNavigate } from 'react-router-dom';
import ArticleList from '../components/ComparePage/ArticleList';
import { ArticleCtxProvider } from '../context/ArticleCtx';
import CompareContent from '../components/ComparePage/CompareContent';

const Compare = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { branch } = useParams();
  const { projectId } = useParams();

  const back = () => {
    navigate(-1);
  };
  const mergeRequest = () => {
    fetch(`http://localhost:3000/api/branch/merge_request/${projectId}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate(-1);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="head">
        <div className="content" style={{ width: 'auto' }}>
          <div onClick={back} className="row">
            <span style={{ margin: 'auto 8px' }}>&lt;</span>
            <h5 style={{ margin: 'auto 0' }}>Back</h5>
          </div>
          <div style={{ margin: 'auto 0' }}>
            <button onClick={mergeRequest}>merge request</button>
          </div>
        </div>
      </div>
      <div className="row" style={{ width: '100%' }}>
        <ArticleCtxProvider>
          <ArticleList />
          <CompareContent />
        </ArticleCtxProvider>
      </div>
    </div>
  );
};

export default Compare;
