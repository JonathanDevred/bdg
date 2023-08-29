import { Link, useParams } from 'react-router-dom';
import './styles.scss';
import { useState } from 'react';
import axios from 'axios';
import backendUrl from '../../../backend/config';


const RecoverPage = () => {
  const { user_id, token } = useParams();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (password !== passwordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    } else {
      setPasswordError('');
    }

    try {
      // Envoyer la demande de changement de mot de passe au serveur
      const response = await axios.post(`${backendUrl}/recover/${user_id}/${token}`, { password });

      setSuccessMessage('Votre mot de passe a été modifié avec succès. Redirection vers la page de connexion.');
      setErrorMessage('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000)
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="recover-container">
      <span className="home-link">
        <Link to="/">Retour à l'accueil</Link>
      </span>

      <div className="recover">
        <h1 className="title">Nouveau mot de passe</h1>

        <form className="recover-form" onSubmit={handleSubmit}>
          <div className="form">
            <label htmlFor="password">Nouveau mot de passe :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />

            <label htmlFor="passwordConfirm">Confirmer le nouveau mot de passe :</label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              error={passwordConfirmError}
            />
          </div>

          <button type="submit">Valider le nouveau mot de passe</button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

        </form>
      </div>
    </div>
  );
};

export default RecoverPage;
