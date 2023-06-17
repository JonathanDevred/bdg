import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.scss';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Helmet>
      <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet"/>
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<h1>Vous êtes perdu</h1>} />
      </Routes>
    </div>
  );
}

export default App;
