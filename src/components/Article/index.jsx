import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './styles.scss';
import axios from 'axios';
import Tag from '../../components/Tag/index.jsx';

const Article = ({ id, title, content, tags, showButtons }) => {
  // Vérification des props
  if (!id || !title || !content || !tags || !Array.isArray(tags)) {
    return null; // Si les props ne sont pas valides, on ne rend rien
  }

  // Filtrer le contenu HTML avec DOMPurify
  const sanitizedContent = DOMPurify.sanitize(content);

  const [articleTags, setArticleTags] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState('');

  const sanitizedContentWithVideos = sanitizedContent.replace(
    /<img src="https:\/\/img.youtube.com\/vi\/([A-Za-z0-9_-]+)\/.*?>/,
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
  );

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

  const handleDelete = async () => {
    try {
      // Récupérer le token depuis le localStorage ou l'endroit où il est stocké
      const token = localStorage.getItem('token');

      // Vérifier si le token existe
      if (token) {
        // Effectuer une requête DELETE vers le backend pour supprimer l'article
        const response = await axios.delete(`http://localhost:3000/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifier si la suppression a réussi ou non
        if (response.status === 200) {
          setDeleteMessage('Article supprimé, rechargement...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setDeleteMessage('Problème lors de la suppression de l\'article.');
        }
      } else {
        setDeleteMessage('Token introuvable. Veuillez vous connecter.');
      }
    } catch (error) {
      console.error('Problème lors de la suppression de l\'article.', error);
      setDeleteMessage('Problème lors de la suppression de l\'article.');
    }
  };

  return (
    <div className="article-container">
      <ul className="article-tags">
        {articleTags.map((tag) => (
          <Tag key={tag.id} name={tag.name} color={tag.color} />
        ))}
      </ul>
      <article className="article">
      <h2 className="article-title">
        <Link to={`/article/${encodeURIComponent(title)}`}>{title}</Link> 
      </h2>
        
        <div className="article-content" dangerouslySetInnerHTML={{ __html: sanitizedContentWithVideos }} />
        {showButtons && (
          <div className="article-buttons">
        <Link to={`/edit-article/${encodeURIComponent(title)}`} className="button">
          Modifier
        </Link>

            <button onClick={handleDelete} className="button">
              Supprimer
            </button>
          </div>
        )}
        {deleteMessage && <p>{deleteMessage}</p>}
      </article>
    </div>
  );
};

export default Article;
