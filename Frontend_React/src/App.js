import Board from "./components/Board";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Projects from "./components/Projects";
import Register from "./components/Register";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
