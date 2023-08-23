import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './styles.scss';

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Fonction pour charger les commentaires associés à l'article
  const loadComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/comments/article/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const commentsWithPseudo = response.data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        pseudo: comment.username,
        created_at: comment.created_at,
      }));
      
      // Tri des commentaires du plus récent au plus ancien
      const sortedComments = commentsWithPseudo.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setComments(sortedComments);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires', error);
    }
  };

// Fonction pour récupérer l'utilisateur connecté
const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const decodedToken = jwt_decode(token);
      console.log('Informations du token:', decodedToken);

      // Trouver l'utilisateur actuellement connecté dans le tableau
      const loggedInUser = response.data.find(user => user.id === decodedToken.userId);
      setCurrentUser(loggedInUser);
      console.log(loggedInUser);      
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'utilisateur', error);
  }
};

  // Charger les commentaires associés à l'article et récupérer l'utilisateur connecté au chargement initial du composant
  useEffect(() => {
    loadComments();
    fetchCurrentUser();
  }, [articleId]);

  // Fonction pour ajouter un nouveau commentaire
  const handleAddComment = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!currentUser || !currentUser.id) {
        console.error('Vous devez être connecté pour ajouter un commentaire');
        return;
      }
      
      // Envoyer le nouveau commentaire au serveur
      await axios.post(`http://localhost:3000/comments/article/${articleId}`, {
        user_id: currentUser.id, // Utiliser l'ID de l'utilisateur connecté
        content: newComment,
      });
  
      // Mettre à jour l'utilisateur connecté après avoir ajouté le commentaire
      setCurrentUser(prevUser => ({ ...prevUser }));
  
      // Recharger les commentaires après avoir ajouté le nouveau commentaire
      loadComments();
  
      // Réinitialiser le champ de saisie du commentaire
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
    }
  };
  

  return (

    <div className="comment-container">
      <div className="comment-section">
        <h3>Commentaires</h3>
        {comments.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.pseudo}</span>
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </li>
            ))}
          </ul>
        )}

        {currentUser && (
          <div>
            <textarea
              placeholder="Votre commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className='comment-button' onClick={handleAddComment}>Ajouter un commentaire</button>
          </div>
        )}

        {!currentUser && (
          <p>
            Vous devez vous connecter pour laisser un commentaire.{' '}
            <a href="/login">Se connecter</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
