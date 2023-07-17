import { useRef, useState, useEffect } from 'react';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import MediumEditor, { CoreOptions } from 'medium-editor';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../App.css';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const Edit = () => {
  const [socket] = useState(() => {
    return io();
  });
  const jwt = localStorage.getItem('jwt');
  const domain = window.location.host;
  const protocol = window.location.protocol;
  const navigate = useNavigate();
  const { team } = useParams();
  const [teamId, teamName]: string[] = team?.split('-') ?? [];
  const { branch } = useParams();
  const { projectId } = useParams();
  const { articleId } = useParams();
  const { number } = useParams();
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState<number>(0);
  const [currentVersion, setCurrentVersion] = useState<number>();
  const [branchUpdateYet, setBranchUpdate] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const compareRef = useRef<HTMLDivElement | null>(null);
  const [id, name]: string[] = projectId?.split('-') ?? [];
  const url = `${protocol}//${domain}/api/article/${id}/${branch}/${articleId}?number=${
    number || (currentVersion ? currentVersion - 1 : undefined)
  }`;
  const [compare, setCompare] = useState<boolean>(false);
  const [visitor, setVisitor] = useState(0);

  const handleSave = () => {
    const story = editorRef.current?.innerHTML;
    // console.log('Title:', title);
    // console.log('Story:', story);
    try {
      fetch(url, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ title, story }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            toast.error(data.errors);
            return;
          }
          if (!articleId) {
            const newUrl = `/article/${team}/${projectId}/${branch}/${data.article_id}`;
            navigate(newUrl);
          }
          toast.success('Save Success!!');
          setBranchUpdate(false);
          setCurrentVersion(data.history.length + 1);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error('An error occurred while saving:', error);
    }
  };

  const handleCompare = () => {
    const compare = new MediumEditor(compareRef.current!, {
      placeholder: false,
    } as CoreOptions);

    compare.destroy();
    setCompare(true);

    fetch(
      `${protocol}//${domain}/api/article/compare/${branch}/${articleId}/${
        currentVersion ? currentVersion - 1 : undefined
      }`,
      {
        headers: new Headers({
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        if (compareRef.current) {
          compareRef.current.innerHTML = data.story;
          compareRef.current.setAttribute('contentEditable', 'false');
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePublish = () => {
    const story = editorRef.current?.innerHTML;
    fetch(`${protocol}//${domain}/api/article/publish/${id}/${articleId}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ title, story }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        toast.success('publish success');
      })
      .catch((err) => console.log(err));
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${protocol}//${domain}/article/${team}/${projectId}/${branch}/${articleId}/${currentVersion}`
    );
    toast.success('copied link to clipboard');
  };

  useEffect(() => {
    const editor = new MediumEditor(editorRef.current!, {
      placeholder: false,
      // toolbar: {
      //   buttons: ['bold', 'italic', 'underline', 'anchor'],
      // },
      toolbar: false,
      // anchor: {
      //   customClassOption: undefined,
      //   customClassOptionText: 'Button',
      //   linkValidation: false,
      //   placeholderText: 'Paste or type a link',
      //   targetCheckbox: false,
      //   targetCheckboxText: 'Open in new window',
      // },
    } as CoreOptions);

    if (articleId) {
      if (!jwt) {
        fetch(url)
          .then((res) => {
            if (res.status !== 200) {
              navigate('/notfound');
            }
            return res.json();
          })
          .then((data) => {
            setTitle(data.title);
            setVersion(data.version);
            setCurrentVersion(data.version);
            if (data.noUpdate) {
              setBranchUpdate(true);
            }
            if (editorRef.current) {
              editorRef.current.innerHTML = data.story;
            }
            if (data.edit == false && editorRef.current) {
              const titleInput = document.getElementById('title') as HTMLInputElement;
              const btn = document.querySelectorAll('button');
              titleInput.readOnly = true;
              btn.forEach((button) => {
                (button as HTMLButtonElement).disabled = true;
              });
              const select = document.querySelector('select');
              select && (select.disabled = true);
              editorRef.current.setAttribute('contentEditable', 'false');
              const compareBtn = document.querySelector('#compareBtn');
              (compareBtn as HTMLButtonElement).removeAttribute('disabled');
            }
          })
          .catch((err) => console.log(err));
      } else {
        fetch(url, {
          headers: new Headers({
            Authorization: `Bearer ${jwt}`,
          }),
        })
          .then((res) => {
            if (res.status !== 200) {
              navigate('/notfound');
            }
            return res.json();
          })
          .then((data) => {
            setTitle(data.title);
            setVersion(data.version + 1);
            setCurrentVersion(data.version + 1);
            if (data.noUpdate) {
              setBranchUpdate(true);
            }
            if (editorRef.current) {
              editorRef.current.innerHTML = data.story;
            }
            if (data.edit == false && editorRef.current) {
              const titleInput = document.getElementById('title') as HTMLInputElement;
              const btn = document.querySelectorAll('button');
              titleInput.readOnly = true;
              btn.forEach((button) => {
                (button as HTMLButtonElement).disabled = true;
              });
              const compareBtn = document.querySelector('#compareBtn');
              (compareBtn as HTMLButtonElement).removeAttribute('disabled');
              editorRef.current.setAttribute('contentEditable', 'false');
            }
          })
          .catch((err) => console.log(err));
      }
    }

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    if (articleId) {
      if (!jwt) {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (number) setCurrentVersion(parseInt(number || ''));
            setTitle(data.title);
            setVersion(data.version + 1);
            if (editorRef.current) {
              editorRef.current.innerHTML = data.story;
            }
            if (data.noUpdate) {
              setBranchUpdate(true);
            }
            if (data.edit == false && editorRef.current) {
              const titleInput = document.getElementById('title') as HTMLInputElement;
              const btn = document.querySelectorAll('button');
              titleInput.readOnly = true;
              btn.forEach((button) => {
                (button as HTMLButtonElement).disabled = true;
              });
              editorRef.current.setAttribute('contentEditable', 'false');
              const compareBtn = document.querySelector('#compareBtn');
              (compareBtn as HTMLButtonElement).removeAttribute('disabled');
            }
            return;
          })
          .catch((err) => console.log(err));
      } else {
        fetch(url, {
          headers: new Headers({
            Authorization: `Bearer ${jwt}`,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setTitle(data.title);
            setVersion(data.version + 1);
            if (editorRef.current) {
              editorRef.current.innerHTML = data.story;
            }
            if (data.noUpdate) {
              setBranchUpdate(true);
            }
            if (data.edit == false && editorRef.current) {
              const titleInput = document.getElementById('title') as HTMLInputElement;
              const btn = document.querySelectorAll('button');
              titleInput.readOnly = true;
              btn.forEach((button) => {
                (button as HTMLButtonElement).disabled = true;
              });
              editorRef.current.setAttribute('contentEditable', 'false');
              const compareBtn = document.querySelector('#compareBtn');
              (compareBtn as HTMLButtonElement).removeAttribute('disabled');
            }
            return;
          })
          .catch((err) => console.log(err));
      }
    }
  }, [currentVersion]);

  useEffect(() => {
    socket.emit('join', { projectId: id, articleId, branch });
    socket.on('visitors', ({ visitors }) => setVisitor(visitors));
    socket.on('leave', ({ visitors }) => setVisitor(visitors));
    return () => {
      socket.off('visitors', ({ visitors }) => setVisitor(visitors));
      socket.off('leave', ({ visitors }) => setVisitor(visitors));
    };
  }, []);

  const back = () => {
    socket.emit('disconnect');
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', height: '100%' }}>
      <div className="head">
        <div className="content" style={{ position: 'relative' }}>
          {jwt ? (
            <Link to={`/team/${teamId}/${id}`} style={{ margin: 'auto 0' }} onClick={back}>
              <div className="row">
                <span style={{ margin: 'auto 8px' }}>&lt;</span>
                <h5 style={{ margin: 'auto 0' }}>Back</h5>
              </div>
            </Link>
          ) : (
            <h3 style={{ margin: 'auto 0' }}>
              <Link to={'/'}>ArticleHub</Link>
            </h3>
          )}
          <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'row' }}>
            <img src="/Users.svg" alt="visitors" style={{ width: '20px', marginRight: '4px' }} />
            <p style={{ margin: 'auto', marginRight: '12px', fontSize: '14px' }}>{visitor}</p>
            {branch !== 'main' && (
              <button id="compareBtn" style={{ marginRight: '10px' }} onClick={handleCompare} className="btn_second">
                compare with main
              </button>
            )}
            {articleId && branch == 'main' && (
              <button style={{ marginRight: '10px' }} onClick={handlePublish} className="btn_second">
                publish
              </button>
            )}
            {articleId && (
              <button onClick={copyLink} style={{ marginRight: '10px' }} className="btn_second">
                Share
              </button>
            )}
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>

      <div className="edit">
        <div style={{ width: '800px', margin: '0 auto' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
            <div className="row">
              <p className="text-hidden" style={{ margin: '0 4px', maxWidth: '100px' }}>
                {teamName}
              </p>
              &gt;
              <p className="text-hidden" style={{ margin: '0 4px', maxWidth: '100px' }}>
                {name}
              </p>
              &gt;
              <p className="text-hidden" style={{ margin: '0 4px', maxWidth: '100px' }}>
                {branch}
              </p>
            </div>
            {articleId && (
              <div className="row">
                {compare && (
                  <div className="row" style={{ marginRight: '20px', color: 'rgb(22, 159, 54)' }}>
                    <div className="row">
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
                    <div className="row" style={{ marginLeft: '12px', color: 'rgb(195, 34, 34)' }}>
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
                )}
                version:
                <select
                  name="version"
                  value={currentVersion}
                  onChange={(e) => setCurrentVersion(Number(e.target.value))}
                  style={{ padding: '2px 12px', marginLeft: '12px' }}
                >
                  {branchUpdateYet && <option>1</option>}
                  {!branchUpdateYet && Array.from({ length: version }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </div>
            )}
          </div>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Name Here"
            style={{ whiteSpace: 'pre-wrap' }}
            required
          />
          <div
            className="row"
            style={{ width: '100%', minHeight: 'calc(100vh - 200px)', backgroundColor: '#FAFAFA', margin: '0 auto' }}
          >
            <div ref={editorRef} className="editable" />
            {compare && (
              <div style={{ width: '100%', position: 'relative', marginLeft: '20px' }}>
                <span
                  style={{ position: 'absolute', top: '2px', right: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setCompare(false);
                  }}
                >
                  &times;
                </span>
                <div
                  ref={compareRef}
                  className="editable"
                  style={{ border: '1px solid #ececec', borderRadius: '4px' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
