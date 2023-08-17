import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import './App.scss';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPage from './pages/ForgotPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import ArticlePage from './pages/ArticlePage';
import AdminPage from './pages/AdminPage';
import ArticleDashboardPage from './pages/ArticleDashboardPage';
import AdminGuard from './components/AdminGuard';
import AllArticlesPage from './pages/AllArticlesPage';
import EditArticlePage from './pages/ArticleEditPage';
import GameConsole from './pages/404';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet" />
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/article/:title" element={<ArticlePage />} />
        <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/recover/:token" element={<RecoverPage />} />
        <Route path="/admin-dashboard" element={<AdminGuard element={<AdminPage />} />} />
        <Route path="/article-dashboard" element={<AdminGuard element={<ArticleDashboardPage />} />} />
        <Route path="/articles-list" element={<AdminGuard element={<AllArticlesPage />} />} />
        <Route path="/edit-article/:articleId" element={<AdminGuard element={<EditArticlePage />} />} />


        <Route path="*" element={<GameConsole />} />
      </Routes>
    </div>
  );
}


export default App;
