import { Link } from 'react-router-dom';
import "./styles.scss"
import { TextInput } from '../../components/Inputs';

const ForgotPage = () => {
  return (

    <div className='container'>
      <span className='home-link'><Link to="/">Retour à l'accueil</Link></span>

      <div className='forgot'>


        <h1 className='title' >Mot de passe oublié</h1>

        <form className='forgot-form'>
        <TextInput label="Email :" id="email" />


          <button type="submit">Créer un nouveau mot de passe</button>

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

export default ForgotPage;
