import React, { useRef, useEffect } from 'react';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import MediumEditor, { CoreOptions } from 'medium-editor';
import { useParams } from 'react-router-dom';
import '../App.css';

const Edit: React.FC = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const id = params.id;
  const branch = params.branch || 'main';
  const project_id = '648c0c963da85c84f4292eae';
  const number = params.number;
  const url = `http://localhost:3000/api/article/${project_id}/${branch}/${id}?number=${number}`;

  const handleSave = async () => {
    const title = titleRef.current?.value;
    const story = editorRef.current?.innerHTML;
    console.log('Title:', title);
    console.log('Story:', story);
    try {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, story }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (error) {
      console.error('An error occurred while saving:', error);
    }
  };

  const handleCompare = async () => {
    try {
      fetch(`http://localhost:3000/api/article/compare/${branch}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (titleRef.current && editorRef.current) {
            titleRef.current.value = data.title;
            editorRef.current.innerHTML = data.story;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error('An error occurred while saving:', error);
    }
  };

  useEffect(() => {
    const editor = new MediumEditor(editorRef.current!, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor'],
      },
      anchor: {
        customClassOption: undefined, // Set it to undefined instead of null
        customClassOptionText: 'Button',
        linkValidation: false,
        placeholderText: 'Paste or type a link',
        targetCheckbox: false,
        targetCheckboxText: 'Open in new window',
      },
    } as CoreOptions);

    if (id) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (titleRef.current) {
            titleRef.current.value = data.title;
          }
          editor.setContent(data.story);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div className="edit">
      <div className="head">
        <h5 style={{ margin: 'auto 0' }}>Medium Editor</h5>
        <div style={{ margin: 'auto 0' }}>
          <button style={{ marginRight: '10px' }} onClick={handleCompare}>
            compare
          </button>
          <button onClick={handleSave}>save</button>
        </div>
      </div>
      <input id="title" type="text" ref={titleRef} placeholder="Title" />
      <div ref={editorRef} className="editable" />
    </div>
  );
};

export default Edit;
