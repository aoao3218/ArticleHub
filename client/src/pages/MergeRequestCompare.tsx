import { useParams, useNavigate } from 'react-router-dom';
import ArticleList from '../components/ComparePage/ArticleList';
import { ArticleCtxProvider } from '../context/ArticleCtx';
import CompareContent from '../components/ComparePage/CompareContent';
import { useState } from 'react';
import MessagePOP from '../components/MessagePOP';

const MergeRequestCompare = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { branch } = useParams();
  const { projectId } = useParams();
  const [id, name]: string[] = projectId?.split('-') ?? [];
  const [message, setMessage] = useState(false);
  const [mgs, setMgs] = useState('');
  const [update, setUpdate] = useState(false);

  const back = () => {
    navigate(-1);
  };
  const mergeRequest = () => {
    fetch(`http://localhost:3000/api/branch/merge_request/${id}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setMessage(true);
          setUpdate(true);
          setMgs(data.errors);
          return;
        }
        navigate(-1);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = () => {
    fetch(`http://localhost:3000/api/branch/update/${id}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUpdate(false);
        setMessage(true);
        setMgs('update success');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {message && <MessagePOP msg={mgs} onClose={() => setMessage(false)} />}
      <div className="head">
        <div className="content" style={{ width: 'auto' }}>
          <div onClick={back} className="row">
            <span style={{ margin: 'auto 8px' }}>&lt;</span>
            <h5 style={{ margin: 'auto 0' }}>Back</h5>
            <p className="row" style={{ justifyContent: 'center', alignContent: 'center', marginLeft: '24px' }}>
              update branch
              <p style={{ margin: '0 8px', padding: '0 8px', backgroundColor: '#ececec', borderRadius: '4px' }}>
                {branch}
              </p>
              content to
              <p style={{ margin: '0 8px', padding: '0 8px', backgroundColor: '#ececec', borderRadius: '4px' }}>main</p>
            </p>
          </div>
          <div style={{ margin: 'auto 0' }}>
            {update && (
              <button style={{ marginRight: '12px' }} onClick={handleUpdate}>
                update
              </button>
            )}
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

export default MergeRequestCompare;
