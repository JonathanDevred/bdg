import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header/index';
import NavBar from '../../components/NavBar';
import axios from 'axios';
import './styles.scss';
import ArticleCard from '../../components/ArticleCard';

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  const fetchArticleTags = async (articleId) => {
    try {
      const response = await axios.get(`http://localhost:3000/tags/article/${articleId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tags pour l'article ${articleId}`, error);
      return [];
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:3000/articles')
      .then(async (response) => {
        // Tri des articles du plus récent au plus ancien
        const sortedArticles = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Récupération des tags pour chaque article
        const articlesWithTags = await Promise.all(
          sortedArticles.map(async (article) => {
            const tags = await fetchArticleTags(article.id);
            return { ...article, tags };
          })
        );

        setArticles(articlesWithTags);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des articles', error);
      });
  }, []);

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div>
      <Header />
      <NavBar />
      <main className="homepage">
        <h1 className='news-title'>Dernières news :</h1>
        {articles.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          title={article.title}
          content={truncateContent(article.content, 200)}
          image={article.image}
        />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
