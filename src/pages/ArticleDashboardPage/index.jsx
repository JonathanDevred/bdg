import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.scss';
import Header from '../../components/Header';
import axios from 'axios';

const ArticleDashboardPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
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

  const handleSubmit = async () => {
    try {
      // Récupérer le token depuis le localStorage ou l'endroit où il est stocké
      const token = localStorage.getItem('token');
  
      // Vérifier si le token existe
      if (token) {
        // Extraire l'userId du token
        const tokenPayload = token.split('.')[1];
        const decodedToken = JSON.parse(atob(tokenPayload));
        const userId = decodedToken.userId; // Ici, on récupère l'ID de l'utilisateur depuis le token
        console.log(decodedToken); 
        console.log(typeof userId); 

        // Effectuer une requête vers le backend pour récupérer les informations de l'utilisateur
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const user = response.data;
  
        // Vérifier si l'utilisateur est administrateur
        if (user.is_admin) {
          // Soumission de l'article vers le backend
          const articleData = {
            title,
            content,
            user_id: userId, // Utiliser l'ID de l'utilisateur extrait du token
            tags: JSON.stringify(selectedTags.map(tag => tag.id)), // Convertir en JSON
          };
  
          console.log(articleData.tags);

          const submitResponse = await axios.post('http://localhost:3000/articles', articleData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // Vérifier si la soumission a réussi ou non
          if (submitResponse.status === 201) {
            setSubmitStatus('Article publié !');
          } else {
            setSubmitStatus('Problème lors de la création de l\'article.');
          }
        } else {
          setSubmitStatus('Vous n\'avez pas les autorisations pour publier un article.');
        }
      } else {
        setSubmitStatus('Token introuvable. Veuillez vous connecter.');
      }
    } catch (error) {
      setSubmitStatus('Problème lors de la création de l\'article.');
    }
  };
  
  
  return (
    <div className="container-admin">
      <span className="home-link-black">
        <Link to="/">Retour à l'accueil</Link>
      </span>
      <Header />

      <div className="article-form">
        <h2 className='article-subtitle'>Rédiger un article</h2>

        <div className="form-group">
            
            <input className='title-input' type="text" id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre de l'article" />
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
                <li className='tag-name' key={tag.id} onClick={() => handleTagClick(tag)}>
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
      {submitStatus && <p className="submit-message">{submitStatus}</p>}
      </div>
    </div>
  );
};

export default ArticleDashboardPage;
