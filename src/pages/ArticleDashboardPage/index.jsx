import React, { useState, useEffect } from 'react';
import TextEditor from '../../components/TextEditor';
import './styles.scss';
import Header from '../../components/Header';
import axios from 'axios';
import HomeLinkBlack from '../../components/HomeLink';
import Tag from '../../components/Tag';
import config from '../config/config';

const backendUrl = config.backendURL;

const ArticleDashboardPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
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
        const response = await fetch(`${backendUrl}/tags`);
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

  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageFile(selectedFile);
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

      const response = await axios.get(`${backendUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;

      if (!user.is_admin) {
        setSubmitStatus('Vous n\'avez pas les autorisations pour publier un article.');
        return;
      }

      const articleData = new FormData();
      articleData.append('title', title);
      articleData.append('content', content);
      articleData.append('user_id', userId);
      articleData.append('image', imageFile);
      selectedTags.forEach(tag => {
        articleData.append('tags', tag.id);
      });

      const submitResponse = await axios.post('${backendUrl}/articles', articleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (submitResponse.status === 201) {
        setSubmitStatus('Article publié !');
        setHideButton(true);
        setTitle('');
        setContent('');
        setTimeout(() => {
          window.location.href = '/admin-dashboard';
        }, 2500);
      } else {
        setSubmitStatus('Problème lors de la création de l\'article.');
      }
    } catch (error) {
      setSubmitStatus('Problème lors de la création de l\'article.');
    }
  };

  const returnPreviousPage = () => 
    window.location.href = '/admin-dashboard'
  
  return (
    <div className="container-dashboard">
      <HomeLinkBlack />
      <Header />

      <div className="article-form">
        <h2 className="article-subtitle">Rédiger un article</h2>
        <input
          className="title-input"
          placeholder="Titre de l'article"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
        />
        <div className="image-upload">
          <input className='picture-input'
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleImageFileChange}
          />
        </div>
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
          Publier l'article
        </button>
        <button className='return-button' onClick={returnPreviousPage} style={{ display: hideButton ? 'none' : 'block' }} >Retour</button>
        {submitStatus && <p className="submit-message">{submitStatus}</p>}
      </div>
    </div>
  );
};

export default ArticleDashboardPage;
