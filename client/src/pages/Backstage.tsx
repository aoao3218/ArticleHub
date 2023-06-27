import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import { ProjectCtxProvider } from '../context/ProjectCtx';
import { TeamCtx } from '../context/TeamCtx';
import Header from '../components/Header';
import Navbar from '../components/BackstagePage/Navbar';

const Backstage = () => {
  const { setTeams } = useContext(TeamCtx);
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    fetch('http://localhost:3000/api/team', {
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
    <div>
      <Header />
      <div className="row">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Backstage;
