import { Link } from 'react-router-dom';
import "./styles.scss"

const LoginPage = () => {
  return (

    <div className='container'>
      <span className='home-link'><Link to="/">Retour à l'accueil</Link></span>

      <div className='login'>


        <h1 className='title' >Se connecter</h1>

        <form className='login-form'>
          <label htmlFor="email">E-mail :</label>
          <input type="email" id="email" />

          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" />

          <button type="submit">Se connecter</button>
          <p className='form-link'><Link to="/forgot">Mot de passe oublié. </Link></p>
          <p className='form-link'>
          Vous n&#8217;avez pas de compte?&nbsp;
          <Link to="/signin">
            Inscrivez-vous.
          </Link>
        </p>
        </form>

      </div>
    </div>  
  );
};

export default LoginPage;
