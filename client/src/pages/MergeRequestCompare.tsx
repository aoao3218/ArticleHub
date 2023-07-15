import { useParams, useNavigate } from 'react-router-dom';
import ArticleList from '../components/ComparePage/ArticleList';
import { ArticleCtxProvider } from '../context/ArticleCtx';
import CompareContent from '../components/ComparePage/CompareContent';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import NotFounds from './NotFounds';

const MergeRequestCompare = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { branch } = useParams();
  const { projectId } = useParams();
  const id: string = projectId?.split('-')[0] ?? '';
  const [update, setUpdate] = useState(false);
  const [updateCount, setCount] = useState(0);
  const domain = window.location.host;
  const protocol = window.location.protocol;

  const back = () => {
    navigate(-1);
  };
  const mergeRequest = () => {
    fetch(`${protocol}//${domain}/api/branch/merge_request/${id}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setUpdate(true);
          toast.error(data.errors);
          return;
        }
        navigate(-1);
        toast.success('approve request');
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = () => {
    fetch(`${protocol}//${domain}/api/branch/update/${id}/${branch}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setUpdate(true);
          toast.error(data.errors);
          return;
        }
        setUpdate(false);
        toast.success('update success');
        setCount(updateCount + 1);
      })
      .catch((err) => console.log(err));
  };

  return (
    <ErrorBoundary FallbackComponent={NotFounds}>
      <div>
        <div className="head">
          <div className="content" style={{ width: 'auto' }}>
            <div onClick={back} className="row">
              <span style={{ margin: 'auto 8px' }}>&lt;</span>
              <h5 style={{ margin: 'auto 0' }}>Back</h5>
              <div
                className="row"
                style={{ justifyContent: 'center', alignContent: 'center', margin: 'auto', paddingLeft: '24px' }}
              >
                update branch
                <p style={{ margin: '0 8px', padding: '0 8px', backgroundColor: '#ececec', borderRadius: '4px' }}>
                  {branch}
                </p>
                content to
                <p style={{ margin: '0 8px', padding: '0 8px', backgroundColor: '#ececec', borderRadius: '4px' }}>
                  main
                </p>
              </div>
            </div>

            <div className="row" style={{ margin: 'auto 0' }}>
              <div className="row" style={{ marginRight: '20px', color: 'rgb(22, 159, 54)' }}>
                <div className="row" style={{ margin: 'auto 0' }}>
                  <div
                    style={{
                      backgroundColor: 'rgb(22, 159, 54)',
                      width: '8px',
                      height: '10px',
                      margin: 'auto',
                      marginRight: '4px',
                    }}
                  ></div>
                  add
                </div>
                <div className="row" style={{ margin: 'auto 0', marginLeft: '12px', color: 'rgb(195, 34, 34)' }}>
                  <div
                    style={{
                      backgroundColor: 'rgb(195, 34, 34)',
                      width: '8px',
                      height: '10px',
                      margin: 'auto',
                      marginRight: '4px',
                    }}
                  ></div>
                  delete
                </div>
              </div>
              {update && (
                <button style={{ marginRight: '12px' }} onClick={handleUpdate}>
                  sync
                </button>
              )}
              <button onClick={mergeRequest}>combine request</button>
            </div>
          </div>
        </div>
        <div className="row" style={{ width: '100%' }}>
          <ArticleCtxProvider>
            <ArticleList />
            <CompareContent update={updateCount} />
          </ArticleCtxProvider>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MergeRequestCompare;
