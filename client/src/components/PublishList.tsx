import { useState, useEffect } from 'react';

interface Publish {
  article_id: string;
  title: string;
  story: string;
  project_id: string;
  author: string;
}

const PublishList = () => {
  const [publish, setPublish] = useState<Publish[] | []>([]);
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/publish`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          return;
        }
        setPublish(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const firstParagraph = (htmlString: string) => {
    const firstParagraph = htmlString.match(/<p>.*?<\/p>/)?.[0];
    return firstParagraph || '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '800px', margin: 'auto', padding: '0 24px' }}>
      {publish.map((obj) => (
        <div className="publishList">
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{obj.title}</div>
          <div
            style={{ maxHeight: '72px', overflow: 'inherit' }}
            dangerouslySetInnerHTML={{ __html: firstParagraph(obj.story) }}
          />
        </div>
      ))}
    </div>
  );
};

export default PublishList;
