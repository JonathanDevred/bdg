import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Article from '../../components/Article';
import './styles.scss';
import HomeLinkBlack from '../../components/HomeLink';

const ArticlePage = () => {
  const { title } = useParams();

  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false); //  state pour gérer le cas où l'article n'est pas trouvé

  useEffect(() => {
    const encodedTitle = encodeURIComponent(title);
    axios
      .get(`http://localhost:3000/articles/${encodedTitle}`)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'article', error);
        setNotFound(true); // Mettre la state notFound à true en cas d'erreur
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
        <Article
          id={article.id}
          title={article.title}
          image={article.image}
          content={article.content}
          tags={article.tags}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
