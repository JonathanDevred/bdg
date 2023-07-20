import { Link } from 'react-router-dom';
import './styles.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminPage = () => (
  <div className="container-admin">
      <span className="home-link-black">
        <Link to="/">Retour à l'accueil</Link>
      </span>
    <Header />
    <div className="admin-area">
    <div className="admin-section">
      <h2>Tableau de bord</h2>
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>Nombre total d'articles</h3>
          <p>50</p>
        </div>
        <div className="dashboard-card">
          <h3>Articles les plus populaires</h3>
          <ul>
            <li>Article 1</li>
            <li>Article 2</li>
            <li>Article 3</li>
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Nombre total d'utilisateurs</h3>
          <p>100</p>
        </div>

      </div>
    </div>

    <div className="admin-section">
      <h2>Gestion des articles</h2>
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/article-dashboard">Créer un article</Link>
          </li>
          <li>
            <Link to="/articles">Liste des articles</Link>
          </li>
        </ul>
      </nav>
    </div>

    <div className="admin-section">
      <h2>Gestion des utilisateurs</h2>
      <nav className="admin-nav">
            <Link to="/users">Liste des utilisateurs</Link>
      </nav>
    </div>

    <div className="admin-section">
      <h2>Gestion des commentaires</h2>
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/comments">Liste des commentaires</Link>
          </li>
          <li>
            <Link to="/reported-comments">Commentaires signalés</Link>
          </li>
        </ul>
      </nav>
    </div>

    <div className="admin-section">
      <h2>Statistiques et analytics</h2>
      <div className="analytics">
        {/* Graphiques et chiffres pour les statistiques */}
      </div>
    </div>

    <div className="admin-section">
      <h2>Paramètres du site</h2>
      <div className="site-settings">
        {/* Options de personnalisation du site */}
      </div>
    </div>

    <div className="admin-section">
      <h2>Système de notifications</h2>
      <div className="notifications">
        {/* Notifications importantes */}
      </div>
    </div>

    <div className="admin-section">
      <h2>Recherche et filtrage</h2>
      <div className="search-filter">
        {/* Options de recherche et de filtrage */}
      </div>
    </div>

    <div className="admin-section">
      <h2>Intégration de médias sociaux</h2>
      <div className="social-media">
        {/* Options d'intégration avec les médias sociaux */}
      </div>
    </div>
    </div>
    <Footer />
  </div>
);

export default AdminPage;
