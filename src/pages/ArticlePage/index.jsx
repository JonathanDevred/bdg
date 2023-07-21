import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Article from '../../components/Article';
import './styles.scss';

const ArticlePage = () => {
  const { title } = useParams();
  console.log(title); // Vérifiez la valeur de title dans la console

  const [article, setArticle] = useState(null);

  useEffect(() => {
    const encodedTitle = encodeURIComponent(title);
    axios
      .get(`http://localhost:3000/articles/${encodedTitle}`)
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
