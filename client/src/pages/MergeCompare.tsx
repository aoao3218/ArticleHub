import { useParams, useNavigate } from 'react-router-dom';
import ArticleList from '../components/ComparePage/ArticleList';
import { ArticleCtxProvider } from '../context/ArticleCtx';
import CompareContent from '../components/ComparePage/CompareContent';
import { useState, useContext } from 'react';
import { ProjectCtx } from '../context/ProjectCtx';
import { toast } from 'react-toastify';

const MergeCompare = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { branch } = useParams();
  const { projectId } = useParams();
  const { setProjects } = useContext(ProjectCtx);
  const [id, name]: string[] = projectId?.split('-') ?? [];
  const updateCount = 0;

  // function getProject() {
  //   fetch(`http://localhost:3000/api/project/${teamId}`, {
  //     headers: new Headers({
  //       Authorization: `Bearer ${jwt}`,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setProjects(data))
  //     .catch((err) => console.log(err));
  // }

  const back = () => {
    navigate(-1);
  };

  const merge = (branch: string | undefined) => () => {
    fetch(`http://localhost:3000/api/branch/merge/${id}/${branch}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ teamId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        navigate(-1);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* {message && <MessagePOP msg={mgs} onClose={() => setMessage(false)} />} */}
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
              <p style={{ margin: '0 8px', padding: '0 8px', backgroundColor: '#ececec', borderRadius: '4px' }}>main</p>
            </div>
          </div>
          <div style={{ margin: 'auto 0' }}>
            <button onClick={merge(branch)}>merge</button>
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
  );
};

export default MergeCompare;
