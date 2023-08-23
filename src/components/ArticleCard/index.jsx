import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Tag from '../../components/Tag/index.jsx';
import './styles.scss';

const ArticleCard = ({ id, title, image, content }) => {
  const [articleTags, setArticleTags] = useState([]);

  // Filtrer le contenu HTML avec DOMPurify
  const sanitizedContent = DOMPurify.sanitize(content);

  // Récupérer les tags associés à l'article par son ID
  useEffect(() => {
    const getArticleTags = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tags/article/${id}`);
        setArticleTags(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tags associés à l\'article', error);
      }
    };

    getArticleTags();
  }, [id]);

  // Construire le chemin d'accès relatif à partir du chemin absolu
  const relativeImagePath = image.replace(/\\/g, '/');

  return (
    <div className="article-card-container">
      <article className="article-card-format">
        <ul className="article-tags">
          {articleTags.map((tag) => (
            <Tag key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </ul>
        
        <Link to={`/article/${encodeURIComponent(title)}`}>
          <img className='article-card-picture' src={`http://localhost:3000/images/${encodeURIComponent(relativeImagePath)}`} alt={title} />
          <div className="article-card-title">
            <h2>{title}</h2>
          </div>
        </Link>

        <div className="article-card-content">
          <p dangerouslySetInnerHTML={{ __html: sanitizedContent }}></p>
        </div>
      </article>
    </div>
  );
};


export default ArticleCard;
