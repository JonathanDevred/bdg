import { Link } from 'react-router-dom';
import './styles.scss';


const HomeLinkBlack = () => {
   
  
    return (
        <span className="home-link-black">
          <Link to="/">Retour à l'accueil</Link>
        </span>
    );
  };
  
  export default HomeLinkBlack;
  