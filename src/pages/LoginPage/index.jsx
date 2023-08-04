import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './styles.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const token = response.data.token;

      if (token) {
        // Connexion réussie, stocker le token dans le localStorage
        localStorage.setItem('token', token);

        // Connexion réussie, rediriger vers la page d'accueil
        window.location.href = '/';
      } else {
        setErrorMessage('Utilisateur non trouvé ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setErrorMessage('Erreur lors de la connexion');
    }
  };

  return (
    <div className="container">
      <span className="home-link">
        <Link to="/">Retour à l'accueil</Link>
      </span>

      <div className="login">
        <h1 className="title">Se connecter</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail :</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Se connecter</button>
          <p className="form-link">
            <Link to="/forgot">Mot de passe oublié</Link>
          </p>
          <p className="form-link">
            Vous n'avez pas de compte?&nbsp;
            <Link to="/signin">Inscrivez-vous</Link>
          </p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
