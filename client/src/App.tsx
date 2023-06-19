import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFounds';
import PostEdit from './components/PostEdit';
import Editor from './components/Edit';
import MediumEditor from './components/MediumEditor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<PostEdit />} />
        <Route path="/edit2" element={<Editor />} />
        <Route path="/article/:branch?/:id?/:number?" element={<MediumEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
