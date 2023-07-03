import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  team?: string;
  project?: string;
  articleId?: string;
  branch?: string;
  version?: number;
  setShoeUrl: () => void;
}

const ShareUrl = ({ team, project, articleId, branch, version, setShoeUrl }: Props) => {
  const [url, setUrl] = useState('');
  const protocol = window.location.protocol;

  useEffect(() => {
    setUrl(`${protocol}//localhost:5173/article/${team}/${project}/${branch}/${articleId}/${version}`);
    // fetch(`${protocol}//localhost:3000/api/article/share`, {
    //   method: 'POST',
    //   headers: new Headers({
    //     Authorization: `Bearer ${jwt}`,
    //     'Content-Type': 'application/json',
    //   }),
    //   body: JSON.stringify({ team, project, articleId, branch }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.errors) {
    //       console.log(data);
    //       return;
    //     }
    //     console.log(data);
    //     setUrl(`${protocol}//localhost:3000/api/view/${data}`);
    //   })
    //   .catch((err) => console.log(err));
  }, [team, project, articleId, branch]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShoeUrl();
      toast.success('copied link to clipboard');
      console.log('copied:', url);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="shareLink">
      <div className="row">
        <div style={{ width: '70%', overflow: 'scroll', padding: '4px 8px' }}>{url}</div>
        <div style={{ width: '30%', textAlign: 'center', margin: 'auto' }} onClick={handleCopyLink}>
          <button style={{ backgroundColor: '#fff', margin: '2px', padding: '2px 8px', color: '#000' }}>
            copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareUrl;
