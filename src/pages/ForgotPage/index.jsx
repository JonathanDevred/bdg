import { Link } from 'react-router-dom';
import './styles.scss';
import { TextInput } from '../../components/Inputs';
import { useState } from 'react';
import axios from 'axios';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoyer la demande de réinitialisation de mot de passe au serveur
      const response = await axios.post('http://localhost:3000/forgot', { email });

      setSuccessMessage('Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.');
      setErrorMessage('');
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
        <h1 className="title">Mot de passe oublié</h1>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <TextInput id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button type="submit">Créer un nouveau mot de passe</button>

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
