import { Link } from 'react-router-dom';

import "./styles.scss";
import { TextInput , PasswordInput } from '../../components/Inputs';

const SigninPage = () => {
  return (
    <div className='container'>
      <span className='home-link'><Link to="/">Retour à l'accueil</Link></span>

      <div className='signin'>
        <h1 className='title'>S'inscrire</h1>

        <form className='signin-form'>
          <TextInput label="Email :" id="email" />
          <TextInput label="Pseudo :" id="username" />
          <PasswordInput label="Mot de passe :" id="password" />
          <PasswordInput label="Retapez votre mot de passe :" id="confirmPassword" />

          <button type="submit">Créer le compte</button>
        </form>
      </div>
    </div>  
  );
};

export default SigninPage;
