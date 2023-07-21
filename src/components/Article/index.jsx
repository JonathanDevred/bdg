import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './styles.scss';

const Article = ({ title, content, tags }) => {
  // Vérification des props
  if (!title || !content || !tags || !Array.isArray(tags)) {
    return null; // Si les props ne sont pas valides, on ne rend rien
  }

  const sanitizedContent = DOMPurify.sanitize(content);

  return (      
    <Link className="article-link" to={`/article/${encodeURIComponent(title)}`}>
      <article className="article">
        <div className="article-image">
        </div>
        <h3 className='article-title'>{title}</h3>
        <div className='article-content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        <ul className="article-tags">
          {tags.map((tag) => (
            <li key={tag.id} className="article-tag">{tag.name}</li>
          ))}
        </ul>
      </article>
    </Link>
  );
};

export default Article;
