import React, { useState, useRef, useEffect } from 'react';
import EditorJs from '@editorjs/editorjs';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const editorInstance = useRef<EditorJs | null>(null);

  useEffect(() => {
    editorInstance.current = new EditorJs({
      holder: 'editor',
      tools: {},
      placeholder: 'Write...',
    });

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    const story = await editorInstance.current?.save();
    console.log('Title:', title);
    console.log('Story:', story);

    //     try {
    //       const response = await fetch('/api/save', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data),
    //       });

    //       if (response.ok) {
    //         console.log('Saved successfully!');
    //       } else {
    //         console.error('Save failed!');
    //       }
    //     } catch (error) {
    //       console.error('An error occurred while saving:', error);
    //     }
  };

  return (
    <div>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div id="editor"></div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Editor;
