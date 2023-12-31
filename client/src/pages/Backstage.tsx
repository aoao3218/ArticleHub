import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ProjectCtxProvider } from '../context/ProjectCtx';
import { TeamCtx } from '../context/TeamCtx';
import Navbar from '../components/BackstagePage/Navbar';
import Header from '../components/Header';
import { ErrorBoundary } from 'react-error-boundary';
import NotFounds from './NotFounds';

const Backstage = () => {
  const { setTeams } = useContext(TeamCtx);
  const jwt = localStorage.getItem('jwt');
  const domain = window.location.host;
  const protocol = window.location.protocol;
  useEffect(() => {
    fetch(`${protocol}//${domain}/api/team`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <ErrorBoundary FallbackComponent={NotFounds}>
      <div>
        <Header />
        <div className="row">
          <ProjectCtxProvider>
            <Navbar />
            <Outlet />
          </ProjectCtxProvider>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Backstage;
