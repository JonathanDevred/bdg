const Tag = ({ name, color, onClick, isSelected }) => {
  const tagStyle = {
    backgroundColor: color,
  };

  return (
    <div
      className={`tag ${isSelected ? 'selected' : ''} article-tag`}
      style={tagStyle}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default Tag;