import React, { useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

const PostEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleStoryChange = (content: string, editor: any) => {
    setStory(content);
  };

  const handleSave = () => {
    // Send the title and story to the backend
    // You can make an API call or perform any other action here
    console.log('Title:', title);
    console.log('Story:', story);
  };

  return (
    <div>
      <input type="text" value={title} onChange={handleTitleChange} placeholder="Title" />
      <TinyMCEEditor
        apiKey="ow306u38cfzup68ygxj2ige4vqafflcefywx24noftn0472n"
        value={story}
        onEditorChange={handleStoryChange}
        init={{
          height: 500,
          width: 800, // Set the width to 800 pixels
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
                   alignleft aligncenter alignright alignjustify | \
                   bullist numlist outdent indent | removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default PostEditor;
