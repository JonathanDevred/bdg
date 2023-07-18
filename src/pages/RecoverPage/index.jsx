import { Link, useParams } from 'react-router-dom';
import './styles.scss';
import { TextInput } from '../../components/Inputs';
import { useState } from 'react';
import axios from 'axios';

const RecoverPage = () => {
  const { token } = useParams();

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
      const response = await axios.post('http://localhost:3000/recover-psw', { token, password });

      setSuccessMessage('Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
      setErrorMessage('');
      // Rediriger vers la page de connexion
      history.push('/signin');
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <span className="home-link">
        <Link to="/">Retour à l'accueil</Link>
      </span>

      <div className="forgot">
        <h1 className="title">Nouveau mot de passe</h1>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe :</label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />

            <label htmlFor="passwordConfirm">Confirmer le nouveau mot de passe :</label>
            <TextInput
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

          <p className="form-link">
            Vous n'avez pas de compte?&nbsp;
            <Link to="/signin">Inscrivez-vous.</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RecoverPage;
