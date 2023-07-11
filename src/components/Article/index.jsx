import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const Article = ({ title, image, content }) => {
  return (      
    <Link className="article-link" to={`/article/${encodeURIComponent(title)}`}>
      <article className="article">
        <div className="article-image">
          <img src={image} alt={title} />
        </div>
        <h3 className='article-title'>{title}</h3>
        <p className='article-content'>{content}</p>
      </article>
    </Link>
  );
};

export default Article;
