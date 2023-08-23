import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextEditor from '../../components/TextEditor';
import './styles.scss';
import Header from '../../components/Header';
import axios from 'axios';
import HomeLinkBlack from '../../components/HomeLink';
import Tag from '../../components/Tag';

const ArticleEditPage = () => {
  const { articleTitle } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [tagsError, setTagsError] = useState('');

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

  const handleTitleChange = (value) => {
    setTitle(value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleAddTagClick = () => {
    setShowTagDialog((prevState) => !prevState);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.find((selectedTag) => selectedTag.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
    }
  };

  const handleSubmit = async () => {
    setTitleError('');
    setContentError('');
    setTagsError('');
  
    if (!title.trim()) {
      setTitleError('Le titre est obligatoire.');
      return;
    }
  
    if (!content.trim()) {
      setContentError('Le contenu est obligatoire.');
      return;
    }
  
    if (selectedTags.length === 0) {
      setTagsError('Veuillez sélectionner au moins un tag.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setSubmitStatus('Token introuvable. Veuillez vous connecter.');
        return;
      }
  
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));
      const userId = decodedToken.userId;
  
      const response = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const user = response.data;
  
      if (!user.is_admin) {
        setSubmitStatus('Vous n\'avez pas les autorisations pour publier un article.');
        return;
      }
  
      const articleData = {
        title,
        content,
        user_id: userId,
        tags: selectedTags.map(tag => tag.id),
      };
  
      try {
        const response = await axios.get(`http://localhost:3000/articles?title=${encodeURIComponent(articleTitle)}`);
        const article = response.data[0];
  
        if (!article) {
          setSubmitStatus('Article non trouvé.');
          return;
        }
  
        const articleId = article.id;
  
        // Envoyer la mise à jour de l'article avec les nouvelles données
        const submitResponse = await axios.patch(`http://localhost:3000/articles/${articleId}`, articleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Mettre à jour les tags associées à l'article dans la table articles_tags
        const updateTagsResponse = await axios.patch(`http://localhost:3000/tags/article/${articleId}`, {
          tags: selectedTags.map(tag => tag.id),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (submitResponse.status === 200 && updateTagsResponse.status === 200) {
          setSubmitStatus('Article modifié !');
          setHideButton(true);
          setTitle('');
          setContent('');
          setTimeout(() => {
            window.location.href = '/admin-dashboard';
          }, 2500);
        } else {
          setSubmitStatus('Problème lors de la modification de l\'article.');
        }
      } catch (error) {
        setSubmitStatus('Problème lors de la modification de l\'article.');
      }
    } catch (error) {
      setSubmitStatus('Problème lors de la récupération de l\'utilisateur.');
    }
  };
  

  const returnPreviousPage = () => {
    window.location.href = '/admin/articles';
  };

  return (
    <div className="container-dashboard">
      <HomeLinkBlack />
      <Header />

      <div className="article-form">
        <h2 className="article-subtitle">Modifier un article</h2>
        <input
          className="title-input"
          placeholder="Titre de l'article"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
        />
        <div className="form-group">
          <TextEditor value={content} onContentChange={handleContentChange} />
        </div>
        {titleError && <p className="error-message">{titleError}</p>}
        {contentError && <p className="error-message">{contentError}</p>}
        {tagsError && <p className="error-message">{tagsError}</p>}

        <div className="tag-section">
          <div className="add-tag" onClick={handleAddTagClick}>
            Ajouter un tag +
          </div>
          <div className="selected-tags">
            {selectedTags.map((tag) => (
              <Tag key={tag.id} name={tag.name} color={tag.color} onClick={() => handleTagClick(tag)} />
            ))}
          </div>
          {showTagDialog && (
            <div className="tag-dialog">
              <h3>Sélectionnez un tag :</h3>
              <ul className="tag-list">
                {tags?.map((tag) => (
                  <Tag key={tag.id} name={tag.name} color={tag.color} onClick={() => handleTagClick(tag)} />
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="submit-button" onClick={handleSubmit} style={{ display: hideButton ? 'none' : 'block' }}>
          Modifier l'article
        </button>
        <button className="return-button" onClick={returnPreviousPage} style={{ display: hideButton ? 'none' : 'block' }}>
          Retour
        </button>
        {submitStatus && <p className="submit-message">{submitStatus}</p>}
      </div>
    </div>
  );
};

export default ArticleEditPage;
