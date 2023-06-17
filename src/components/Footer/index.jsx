import { Link } from 'react-router-dom';
import './styles.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <h3 className='footer-subtitle'>Je sais pas quoi mettre en footer lol</h3>
      <Link className='footer-link' to="/about">
        À Propos
      </Link>
    </footer>
  );
};

export default Footer;
