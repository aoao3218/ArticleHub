import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFounds';
import Backstage from './pages/Backstage';
import MediumEditor from './pages/MediumEditor';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Project from './components/BackstagePage/Project';
import Compare from './pages/Compare';
import { TeamCtxProvider } from './context/TeamCtx';
import { ProjectCtxProvider } from './context/ProjectCtx';
const App = () => {
  return (
    <TeamCtxProvider>
      <ProjectCtxProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/team/:teamId" element={<Backstage />}>
              <Route path=":projectId" element={<Project />} />
            </Route>
            <Route path="/mergeCompare/:projectId/:branch" element={<Compare />} />
            <Route path="/article/:team/:projectId/:branch?/:id?/:number?" element={<MediumEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProjectCtxProvider>
    </TeamCtxProvider>
  );
};

export default App;
