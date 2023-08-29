import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../../pictures/Logo.png'
import './styles.scss';
import backendUrl from '../../../backend/config';


const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const tokenPayload = token.split('.')[1];
          const decodedToken = JSON.parse(atob(tokenPayload));
          const userId = decodedToken.userId;

          const response = await axios.get(`${backendUrl}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = response.data;
          setIsAdmin(user.is_admin);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <header className="header">

      <nav className="header-nav">
      {!token && (
        <Link className="header-login" to="/login">
          Se connecter
        </Link>
      )}

      {isAdmin && (
        <>
          <Link className="header-login" to="/admin-dashboard">
            Admin
          </Link>
          <Link className="header-login" to="/" onClick={handleLogout}>
            Se déconnecter
          </Link>
        </>
      )}

      {!isAdmin && token && (
        <Link className="header-login" to="/" onClick={handleLogout}>
          Se déconnecter
        </Link>
      )}
      </nav>

        <img src={Logo} alt='logo blog du gamer' />

    </header>
  );
};

export default Header;
