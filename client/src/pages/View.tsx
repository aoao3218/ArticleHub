import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import NotFounds from './NotFounds';
import { useParams } from 'react-router-dom';

const View = () => {
  const { showBoundary } = useErrorBoundary();
  const domain = window.location.host;
  const protocol = window.location.protocol;
  const { articleId } = useParams();
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/publish/${articleId}`)
      .then((res) => {
        if (res.status !== 200) {
          showBoundary(res);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTitle(data.title);
        setStory(data.story);
      });
  }, []);
  return (
    <ErrorBoundary FallbackComponent={NotFounds}>
      <div>
        <Header />
        <div className="content" style={{ width: '780px', margin: 'auto' }}>
          <h1 style={{ fontSize: '42px', margin: '0', padding: '40px 0px' }}>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: story }}></div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default View;
