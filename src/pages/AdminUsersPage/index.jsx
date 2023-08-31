import React, { useState, useEffect } from 'react';
import './styles.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeLinkBlack from '../../components/HomeLink';
import axios from 'axios';
import frontBackendUrl from '../../config/config';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const loadUsers = async () => {
    try {
      const response = await axios.get(`${frontBackendUrl}/users`); 
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const fetchUsers = () => {
    axios
      .get(`${frontBackendUrl}/users`)
      .then((response) => {
        const sortedUsers = [...response.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des commentaires', error);
      });
  };

  const handleDeleteComment = (userId) => {
    axios
      .delete(`${frontBackendUrl}/users/${userId}`)
      .then(() => {
        fetchUsers(); 
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
            <h2>Gestion des utilisateurs :</h2>
            <div className="admin-nav">
              <ul>
                {users.map((user) => (
                  <li className='user' key={user.id}>
                    <p>Pseudo: <span className='user-name'>{user.username}</span></p> 
                    <p>Compte créé le : <span className='user-date'> {new Date(user.created_at).toLocaleString()} </span> </p>
                    <button
                      className="button-delete"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
                          handleDeleteComment(user.id);
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
export default AdminUsersPage;
