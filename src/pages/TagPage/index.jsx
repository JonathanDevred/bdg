import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from '../../components/ArticleCard';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import './styles.scss'; 
import HomeLinkBlack from '../../components/HomeLink';
import frontBackendUrl from '../../config/config';

const TagPage = () => {
  const params = useParams();
  const tag = params.tag;
  const [tagArticles, setTagArticles] = useState([]);

  useEffect(() => {
    axios
      .get(`${frontBackendUrl}/articles/tag/${tag}`)
      .then((response) => {
        const sortedArticles = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTagArticles(sortedArticles);
      })
      .catch((error) => {
        console.error(`Erreur lors de la récupération des articles avec le tag ${tag}`, error);
      });
  }, [tag]);

  return (
    <div>
      <HomeLinkBlack />
      <Header />
      <NavBar />
      <main className="tagpage">
        <h1 className='tagpage-title'>Articles avec le tag {tag} :</h1>
        <div className="article-list">
          {tagArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              image={article.image}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TagPage;
