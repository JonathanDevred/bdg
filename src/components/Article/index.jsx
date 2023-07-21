import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './styles.scss';

const Article = ({ title, image, content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (      
    <Link className="article-link" to={`/article/${encodeURIComponent(title)}`}>
      <article className="article">
        <div className="article-image">
        </div>
        <h3 className='article-title'>{title}</h3>
        <div className='article-content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </article>
    </Link>
  );
};

export default Article;
