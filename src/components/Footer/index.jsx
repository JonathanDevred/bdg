import { Link } from "react-router-dom";
import Logo from "../../pictures/Logo.png"
import Insta from "../../pictures/Insta.png"
import Tiktok from "../../pictures/Tiktok.png"
import X from "../../pictures/X.png"

import './styles.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={Logo} alt="Logo du blog" />
        </div>
        <div className="footer-links">
          <h2>Liens utiles</h2>
          <ul>
            <li><Link to="/">Accueil</Link ></li>
            <li><Link to="/about">À propos</Link ></li>
            <li><Link to="/contact">Contact</Link ></li>
          </ul>
        </div>
        <div className="footer-social">
          <h2>Rejoignez-nous sur les réseaux sociaux</h2>
          <ul>
            <li><Link to="#"><img src={Tiktok} alt="TikTok" /></Link >TikTok</li>
            <li><Link to="#"><img src={X} alt="X" /></Link >X</li>
            <li><Link to="/test"><img src={Insta} alt="Instagram" /></Link >Instagram</li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Le Blog du Gamer. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
