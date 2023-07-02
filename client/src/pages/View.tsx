import { useRef, useState, useEffect } from 'react';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import MediumEditor, { CoreOptions } from 'medium-editor';
import { useParams } from 'react-router-dom';
import '../App.css';

const View = () => {
  const [title, setTitle] = useState('');
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { url } = useParams();

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

    fetch(`http://localhost:3000/api/view/${url}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTitle(data.title);
        if (editorRef.current) {
          editorRef.current.innerHTML = data.story;
          editorRef.current.setAttribute('contentEditable', 'false');
        }
      })
      .catch((err) => console.log(err));

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#FAFAFA', height: '100%' }}>
      <div className="head">
        <div className="content">
          <div className="row">
            <span style={{ margin: 'auto 8px' }}>&lt;</span>
            <h5 style={{ margin: 'auto 0' }}>Back</h5>
          </div>
        </div>
      </div>

      <div className="edit">
        <div style={{ width: '800px', margin: '0 auto' }}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Name Here"
            required
          />
          <div
            className="row"
            style={{ width: '100%', minHeight: 'calc(100vh - 200px)', backgroundColor: '#FAFAFA', margin: '0 auto' }}
          >
            <div ref={editorRef} className="editable" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
