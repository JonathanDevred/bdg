import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.scss';
import Header from '../../components/Header';

const ArticleDashboardPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDialog, setShowTagDialog] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:3000/tags');
        const data = await response.json();
        if (response.ok) {
          setTags(data);
        } else {
          console.error('Erreur lors de la récupération des tags:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des tags:', error);
      }
    };
  
    fetchTags();
  }, []);
  

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleAddTagClick = () => {
    setShowTagDialog(true);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.find((selectedTag) => selectedTag.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
    }
  };
  

  const handleSubmit = () => {
    // Logique pour soumettre l'article avec les tags sélectionnés
  };

  return (
    <div className="container">
      <span className="home-link-black">
        <Link to="/">Retour à l'accueil</Link>
      </span>
      <Header />

      <div className="article-form">
        <h2>Rédiger un article</h2>

        <div className="form-group">
            
            <input type="text" id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre de l'article" />
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="Contenu de l'article"
            style={{ width: '70%', height: '300px',paddingBottom: '50px'}}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'link'],
                [{ color: [] }, { background: [] }],
                ['blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['image', 'video'],
              ],
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
              'bold',
              'italic',
              'underline',
              'strike',
              'link',
              'color',
              'background',
              'blockquote',
              'list',
              'image',
              'video',
            ]}
          />
        </div>

        <div className="tag-section">
          <div className="add-tag" onClick={handleAddTagClick}>
            Ajouter un tag +
          </div>
          {showTagDialog && (
            <div className="tag-dialog">
              <h3>Sélectionnez un tag :</h3>
              <ul className="tag-list">
              {tags?.map((tag) => (
  <li key={tag.id} onClick={() => handleTagClick(tag)}>
    {tag.name}
  </li>
))}

              </ul>
            </div>
          )}
            <div className="selected-tags">
            {selectedTags.map((tag) => (
                <div key={tag.id} className="tag" onClick={() => handleTagClick(tag)}>
                {tag.name}
                </div>
            ))}
            </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Publier l'article
        </button>
      </div>
    </div>
  );
};

export default ArticleDashboardPage;
