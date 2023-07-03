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
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/article/publish/${projectId}`, {
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
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {publish.map((ele) => (
              <td>{ele.title}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Publish;
