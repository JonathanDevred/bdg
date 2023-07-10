import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Article from '../../components/Article'; // Import du nouveau composant Article
import './styles.scss';

const ArticlePage = () => {
  const { title } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
    .get(`http://localhost:3000/article/${encodeURIComponent(title)}`)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'article', error);
      });
  }, [title]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <NavBar />
      <main className="article-page">
        <Article // Utilisation du composant Article
          id={article.id}
          title={article.title}
          image={article.image}
          content={article.content}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
