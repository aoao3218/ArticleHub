import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Publish {
  article_id: string;
  title: string;
  story: string;
  project_id: string;
  author: string;
}

const PublishList = () => {
  const [publish, setPublish] = useState<Publish[] | []>([]);
  const [searchKey, setSearchKey] = useState('');
  const domain = window.location.host;
  const protocol = window.location.protocol;
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const firstParagraph = (htmlString: string) => {
    const firstParagraph = htmlString.match(/<p>.*?<\/p>/)?.[0];
    return firstParagraph || '';
  };

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetch(`${protocol}//${domain}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: searchKey }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPublish(data);
        });
    }
  };

  const deleSearch = () => {
    setRefresh(!refresh);
    setSearchKey('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '800px', margin: 'auto', padding: '0 24px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="search"
          style={{ width: '-webkit-fill-available', marginTop: '24px' }}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyDown={search}
        />
        <div
          style={{
            position: 'absolute',
            right: '16px',
            top: '57%',
            margin: 'auto 0',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
          onClick={deleSearch}
        >
          x
        </div>
      </div>
      {publish.length > 0 ? (
        publish.map((obj) => (
          <div className="publishList">
            <Link to={`/publish/${obj.article_id}`}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', overflowWrap: 'anywhere' }}>
                {obj.title}
              </div>
              <div
                style={{ maxHeight: '72px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                dangerouslySetInnerHTML={{ __html: firstParagraph(obj.story) }}
              />
            </Link>
          </div>
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            textAlign: 'center',
            height: '300px',
            margin: 'auto',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          There are no posts
        </div>
      )}
    </div>
  );
};

export default PublishList;
