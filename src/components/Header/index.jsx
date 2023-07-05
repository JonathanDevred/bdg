import { Link } from 'react-router-dom';
import './styles.scss';

const Header = () => {
  return (
    <header className="header">

      <Link className='header-login' to="/login">Se connecter</Link>
    
      <h1 className="title">
        <span>Le</span>
        <span> BLOG du GAMER</span>
      </h1>
      <h3 className='subtitle'>La nouvelle référence de l&#8217;actu gaming</h3>
      <Link to="/">
      </Link>
    </header>
  );
};

export default Header;
