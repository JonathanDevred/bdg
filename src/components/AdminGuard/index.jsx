import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import backendUrl from '../../../backend/config';

const AdminGuard = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(null); // null = état inconnu, false = utilisateur non administrateur, true = utilisateur administrateur
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
          setIsAdmin(user.is_admin); // Si le token est présent, définir l'état isAdmin à true ou false en fonction de la valeur de user.is_admin
        } else {
          setIsAdmin(false); // Si le token n'est pas présent, définir l'état isAdmin à false
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
        setIsAdmin(false); // En cas d'erreur, définir l'état isAdmin à false
      }
    };

    fetchUser();
  }, [token]);

  // Attendre que l'état isAdmin soit défini avant de prendre une décision
  if (isAdmin === null) {
    return null; 
  }

  // Si l'utilisateur n'est pas administrateur ou si le token n'est pas présent, redirigez l'utilisateur vers la page d'accueil
  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }

  // Si l'utilisateur est administrateur et le token est présent, affichez le composant passé en paramètre
  return element;
};

export default AdminGuard;
