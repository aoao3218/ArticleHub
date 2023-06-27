import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Publish {
  article_id: string;
  title: string;
  story: string;
  project_id: string;
  author: string;
}

const Publish = () => {
  const jwt = localStorage.getItem('jwt');
  const { projectId } = useParams();
  const [publish, setPublish] = useState<Publish[] | []>([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/article/publish/${projectId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          return;
        }
        setPublish(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [projectId]);

  return (
    <div>
      <ul>
        {publish.map((ele) => (
          <li>{ele.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Publish;
