import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFounds';
import Backstage from './pages/Backstage';
import MediumEditor from './pages/MediumEditor';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Project from './components/BackstagePage/Project';
import MergeRequestCompare from './pages/MergeRequestCompare';
import MergeCompare from './pages/MergeCompare';
import { TeamCtxProvider } from './context/TeamCtx';

const App = () => {
  return (
    <TeamCtxProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team/:teamId" element={<Backstage />}>
            <Route path=":projectId" element={<Project />} />
          </Route>
          <Route path="/compare/mergeRequest/:projectId/:branch" element={<MergeRequestCompare />} />
          <Route path="/compare/merge/:teamId/:projectId/:branch" element={<MergeCompare />} />
          <Route path="/article/:team/:projectId/:branch?/:id?/:number?" element={<MediumEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TeamCtxProvider>
  );
};

export default App;
