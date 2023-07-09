import { useRef, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArticleCtx } from '../../context/ArticleCtx';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import MediumEditor, { CoreOptions } from 'medium-editor';

interface Branch {
  branch?: string;
  update: number;
}

const Text = ({ branch, update }: Branch) => {
  const jwt = localStorage.getItem('jwt');
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { projectId } = useParams();
  const id: string = projectId?.split('-')[0] ?? '';
  const { articleId } = useContext(ArticleCtx);
  const [title, setTitle] = useState('');
  const number = undefined;
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    if (articleId) {
      fetch(`${protocol}//${domain}/api/article/${id}/${branch}/${articleId}?number=${number}`, {
        headers: new Headers({
          Authorization: `Bearer ${jwt}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (editorRef.current) {
            setTitle(data.title);
            editorRef.current.innerHTML = data.story;
            editorRef.current.setAttribute('contentEditable', 'false');
          }
        });
    }
  }, [projectId, branch, articleId, update]);

  useEffect(() => {
    const editor = new MediumEditor(editorRef.current!, {
      placeholder: false,
      anchor: {
        customClassOption: undefined,
        customClassOptionText: 'Button',
        linkValidation: false,
        targetCheckbox: false,
        targetCheckboxText: 'Open in new window',
      },
    } as CoreOptions);
    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div style={{ width: '100%', borderRight: '1px solid #ececec' }}>
      <p style={{ textAlign: 'center', borderBottom: '1px solid #ececec', padding: '8px', margin: 'auto' }}>{branch}</p>
      <div style={{ margin: '0 24px' }}>
        <input id="title" type="text" value={title} readOnly />
        <div ref={editorRef} className="editable" contentEditable="false" />
      </div>
    </div>
  );
};

export default Text;
