import { useRef, useState, useEffect } from 'react';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import MediumEditor, { CoreOptions } from 'medium-editor';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../App.css';
import { toast } from 'react-toastify';

const Edit = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState<number>(0);
  const [currentVersion, setCurrentVersion] = useState<number>();
  const [branchUpdateYet, setBranchUpdate] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const compareRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const articleId = params.id;
  const branch = params.branch || 'main';
  const { team } = useParams();
  const [teamId, teamName]: string[] = team?.split('-') ?? [];
  const { projectId } = useParams();
  const [id, name]: string[] = projectId?.split('-') ?? [];
  const url = `http://localhost:3000/api/article/${id}/${branch}/${articleId}?number=${currentVersion}`;
  const [saveCount, setSaveCount] = useState<number>(0);
  const [compare, setCompare] = useState<boolean>(false);

  const handleSave = () => {
    const story = editorRef.current?.innerHTML;
    console.log('Title:', title);
    console.log('Story:', story);
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
          console.log(data);
          if (data.errors) {
            toast.error(data.errors);
            return;
          }
          if (!articleId) {
            const newUrl = `/article/${team}/${projectId}/${branch}/${data.article_id}`;
            navigate(newUrl);
          }
          toast.success('Save Success!!');
          setSaveCount(saveCount + 1);
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

    fetch(`http://localhost:3000/api/article/compare/${branch}/${articleId}/${currentVersion}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        console.log(data);
        if (compareRef.current) {
          compareRef.current.innerHTML = data.story;
          compareRef.current.setAttribute('contentEditable', 'false');
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePublish = () => {
    fetch(`http://localhost:3000/api/article/publish/${id}/${articleId}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          toast.error(data.errors);
          return;
        }
        toast.success('publish success');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const editor = new MediumEditor(editorRef.current!, {
      placeholder: false,
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor'],
      },
      anchor: {
        customClassOption: undefined,
        customClassOptionText: 'Button',
        linkValidation: false,
        placeholderText: 'Paste or type a link',
        targetCheckbox: false,
        targetCheckboxText: 'Open in new window',
      },
    } as CoreOptions);

    if (articleId) {
      fetch(url, {
        headers: new Headers({
          Authorization: `Bearer ${jwt}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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
            editorRef.current.setAttribute('contentEditable', 'false');
          }
        })
        .catch((err) => console.log(err));
    }

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTitle(data.title);
        setVersion(data.version);
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
        }
      })
      .catch((err) => console.log(err));
  }, [currentVersion, saveCount]);

  return (
    <div style={{ backgroundColor: '#FAFAFA', height: '100%' }}>
      {/* {message && <MessagePOP msg={mgs} onClose={() => setMessage(false)} />} */}
      <div className="head">
        <div className="content">
          <Link to={`/team/${teamId}/${id}`} style={{ margin: 'auto 0' }}>
            <div className="row">
              <span style={{ margin: 'auto 8px' }}>&lt;</span>
              <h5 style={{ margin: 'auto 0' }}>Back</h5>
            </div>
          </Link>
          <div style={{ margin: 'auto 0' }}>
            {branch !== 'main' && (
              <button style={{ marginRight: '10px' }} onClick={handleCompare} className="btn_second">
                compare
              </button>
            )}
            {branch == 'main' && (
              <button style={{ marginRight: '10px' }} onClick={handlePublish} className="btn_second">
                publish
              </button>
            )}
            <button onClick={handleSave}>save</button>
          </div>
        </div>
      </div>

      <div className="edit">
        <div style={{ width: '800px', margin: '0 auto' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
            <div className="row">
              <p style={{ margin: '0 4px' }}>{teamName}</p>&gt;<p style={{ margin: '0 4px' }}>{name}</p>
              &gt;
              <p style={{ margin: '0 4px' }}>{branch}</p>
              &gt;
              <p style={{ margin: '0 4px' }}>{title}</p>
            </div>
            {articleId && (
              <div>
                version:
                <select
                  name="version"
                  value={currentVersion}
                  onChange={(e) => setCurrentVersion(Number(e.target.value))}
                  style={{ padding: '2px 12px', marginLeft: '12px' }}
                >
                  {branchUpdateYet && <option>0</option>}
                  {!branchUpdateYet && Array.from({ length: version + 1 }, (_, i) => <option key={i}>{i}</option>)}
                </select>
              </div>
            )}
          </div>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Name Here"
            // style={{ backgroundColor: '#FAFAFA' }}
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
