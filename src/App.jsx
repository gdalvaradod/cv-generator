import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Editor from './Editor';

function App() {
  return (
    // Agregamos el basename para que GitHub Pages reconozca el subdirectorio de tu repositorio
    <Router basename="/cv-generator">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;