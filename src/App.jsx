import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.scss';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPage from './pages/ForgotPage';
import SigninPage from './pages/SigninPage';

function App() {
  return (
    <div className="App">
      <Helmet>
      <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet"/>
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/forgot' element={<ForgotPage />} />
        <Route path="*" element={<h1>Vous êtes perdu</h1>} />
      </Routes>
    </div>
  );
}

export default App;
