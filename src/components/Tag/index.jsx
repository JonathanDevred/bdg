import React from 'react';
import './styles.scss';


const Tag = ({ name, color }) => {
  const tagStyle = {
    backgroundColor: color,
  };

  return (
    <div className="article-tag" style={tagStyle}>
      {name}
    </div>
  );
};

export default Tag;
