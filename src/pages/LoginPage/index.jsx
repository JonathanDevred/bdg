import { Link } from 'react-router-dom';
import "./styles.scss"

const LoginPage = () => {
  return (
    <div className='login'>
      <form className='login-form'>
        <label htmlFor="username">E-mail :</label>
        <input type="text" id="username" />

        <label htmlFor="password">Mot de passe :</label>
        <input type="password" id="password" />

        <button type="submit">Se connecter</button>
        <p className='form-link'><Link to="/forgot">Mot de passe oublié. </Link></p>
        <p>
        Vous n&#8217;avez pas de compte?&nbsp;
        <Link to="/signin">
           Inscrivez-vous.
        </Link>
      </p>
      </form>

    </div>
  );
};

export default LoginPage;
