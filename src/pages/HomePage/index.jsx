import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header/index';
import NavBar from '../../components/NavBar';
import axios from 'axios';
import Article from '../../components/Article';
import './styles.scss';

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/articles')
      .then((response) => {
        // Tri des articles du plus récent au plus ancien
        const sortedArticles = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setArticles(sortedArticles);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des articles', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <NavBar />
      <main className="homepage">
  <h1>Dernières news :</h1>
  {articles.map((article) => (
    <Article
      key={article.id}
      id={article.id}
      title={article.title}
      content={article.content}
      tags={article.tags} 
    />
  ))}
</main>

      <Footer />
    </div>
  );
};

export default HomePage;
