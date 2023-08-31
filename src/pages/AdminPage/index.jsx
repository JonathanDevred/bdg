import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeLinkBlack from '../../components/HomeLink';
import frontBackendUrl from '../../config/config';


const AdminPage = () => {
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchTotalArticles = () => {
    axios
      .get(`${frontBackendUrl}/articles/total-articles`)
      .then((response) => {
        setTotalArticles(response.data.totalarticles); 
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du nombre total d\'articles', error);
      });
  };


  const fetchTotalUsers = () => {
    axios
      .get('${frontBackendUrl}/users/total-users')
      .then((response) => {
        setTotalUsers(response.data.totalusers); 
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du nombre total d\'utilisateurs', error);
      });
  };

  useEffect(() => {
    fetchTotalArticles();
    fetchTotalUsers();
  }, []);

return (
<div>
  <HomeLinkBlack />
  <Header />
  <div className="container-admin">
      <div className="admin-area">
        <div className="admin-section">
          <h2>Tableau de bord</h2>
          <div className="dashboard">
            <div className="dashboard-card">
              <h3>Nombre total d'articles</h3>
              <p>{totalArticles}</p>
            </div>

            <div className="dashboard-card">
              <h3>Nombre total d'utilisateurs</h3>
              <p>{totalUsers}</p>
          </div>

        </div>
      </div>

      <div className="admin-section">
        <h2>Gestion des articles</h2>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/article/new-article">Créer un article</Link>
            </li>
            <li>
              <Link to="/admin/articles">Liste des articles</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-section">
        <h2>Gestion des utilisateurs</h2>
        <nav className="admin-nav">
              <Link to="/admin/users">Liste des utilisateurs</Link>
        </nav>
      </div>

      <div className="admin-section">
        <h2>Gestion des commentaires</h2>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/comments">Liste des commentaires</Link>
            </li>

          </ul>
        </nav>
      </div>

      </div>
  </div>
  <Footer />

</div>
);}

export default AdminPage;
