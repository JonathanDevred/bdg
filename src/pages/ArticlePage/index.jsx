// ArticlePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Article from '../../components/Article';
import CommentSection from '../../components/CommentSection';
import './styles.scss';
import HomeLinkBlack from '../../components/HomeLink';
import DOMPurify from 'dompurify';
import frontBackendUrl from '../../config/config';

const ArticlePage = () => {
  const { title } = useParams();

  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const encodedTitle = encodeURIComponent(title);
    axios
      .get(`${frontBackendUrl}/articles/${encodedTitle}`)
      .then((response) => {
        const articleData = response.data;
        const sanitizedContent = DOMPurify.sanitize(articleData.content);
        setArticle({ ...articleData, content: sanitizedContent });
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'article', error);
        setNotFound(true);
      });
  }, [title]);

  if (notFound) {
    return (
      <div>
        <HomeLinkBlack />
        <Header />
        <NavBar />
        <main className="article-page">
          <p>L'article que vous recherchez n'a pas été trouvé.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <span className="home-link-black">
        <Link to="/">Retour à l'accueil</Link>
      </span>
      <Header />
      <NavBar />
      <main className="article-page">
      <div className="article-page-container">
      <Article
        id={article.id}
        title={article.title}
        image={encodeURI(`${article.image}`)}
        content={article.content}
        tags={article.tags}
      />
      <CommentSection articleId={article.id} />
     </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
