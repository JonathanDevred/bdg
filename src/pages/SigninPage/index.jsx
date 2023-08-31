import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.scss';

import config from '../config/config';

const backendUrl = config.backendURL;

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const isValidEmail = (email) => {
    // Expression régulière pour valider le format de l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du format de l'adresse e-mail
    if (!isValidEmail(email)) {
      setErrorMessage("Adresse e-mail invalide");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await axios.post(`${backendUrl}/users`, {
        email,
        username,
        password,
      });

      // Afficher le message de succès
      setSuccessMessage('Compte créé avec succès');

      // Vider les champs du formulaire
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Erreur lors de la création du compte');
      }
    }
  };

  return (
    <div className='container'>
      <span className='home-link'><Link to="/">Retour à l'accueil</Link></span>

      <div className='signin'>
        <h1 className='title'>S'inscrire</h1>

        <form className='signin-form' onSubmit={handleSubmit}>
          <label htmlFor="Email">Email : </label>
          <input label="Email :" id="email" value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="Pseudo">Pseudo : </label>
          <input label="Pseudo :" id="username" value={username} onChange={e => setUsername(e.target.value)} />

          <label htmlFor="Password">Mot de passe : </label>
          <input label="Mot de passe :" id="password" value={password} onChange={e => setPassword(e.target.value)} />

          <label htmlFor="Password">Confirmation mot de passe : </label>
          <input label="Retapez votre mot de passe :" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

          <button type="submit">Créer le compte</button>

          <p className="form-link">
            Vous avez déjà un compte?&nbsp;
            <Link to="/login">Connectez-vous.</Link>
          </p>
        </form>
        

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SigninPage;
