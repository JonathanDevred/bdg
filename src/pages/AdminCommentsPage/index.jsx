import React, { useState, useEffect } from 'react';
import './styles.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeLinkBlack from '../../components/HomeLink';
import axios from 'axios';
import backendUrl from '../../../backend/config';


const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const loadComments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/comments` ); 
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);
  const fetchComments = () => {
    axios
      .get(`${backendUrl}/comments`)
      .then((response) => {
        const sortedComments = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setComments(sortedComments);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des commentaires', error);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`${backendUrl}/comments/${commentId}`)
      .then(() => {
        fetchComments(); // Met à jour la liste des commentaires après la suppression
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du commentaire', error);
      });
  };

  return (
    <div>
      <HomeLinkBlack />
      <Header />
      <div className="container-admin">
        <div className="admin-area">
          <div className="admin-section">
            <h2>Gestion des commentaires :</h2>
            <div className="admin-nav">
              <ul>
                {comments.map((comment) => (
                  <li className='comment' key={comment.id}>
                    <p  className="comment-content">{comment.content}</p>
                    <p >Posté par : <span className='comment-author'>{comment.user_pseudo}</span></p> 
                    <p className='comment-date'>Date : {new Date(comment.created_at).toLocaleString()}</p>
                    <button
                      className="button-delete"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
                          handleDeleteComment(comment.id);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default AdminCommentsPage;
