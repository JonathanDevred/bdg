import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';
import axios from 'axios';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setErrorMessage('L\'adresse e-mail n\'est pas valide.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/forgot', { email });

      if (response.data.message) {
        setSuccessMessage('Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.');
        setErrorMessage('');
      } else {
        setErrorMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      setSuccessMessage('');
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <span className="home-link">
        <Link to="/">Retour à l'accueil</Link>
      </span>

      <div className="forgot">
        <h1 className="title">Mot de passe oublié</h1>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label htmlFor="email">Email :</label>
            <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button type="submit">Réinitialiser le mot de passe</button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="form-link">
            Vous n'avez pas de compte?&nbsp;
            <Link to="/signin">Inscrivez-vous.</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPage;
