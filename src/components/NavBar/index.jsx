import { Link } from 'react-router-dom';
import './styles.scss';

const NavBar = ({ setSelectedTag }) => {
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div className="navbar">
      <Link className='nav-link' to="/" onClick={() => setSelectedTag(null)}> {/* Remet à zéro le tag sélectionné */}
        NEWS
      </Link>

      <Link className='nav-link' to="/articles/tag/nintendo">
        NINTENDO
      </Link>

      <Link className='nav-link' to="/articles/tag/sony">
        SONY
      </Link>

      <Link className='nav-link' to="/articles/tag/microsoft">
        MICROSOFT
      </Link>

      <Link className='nav-link' to="/articles/tag/pc">
        PC
      </Link>

      <Link className='nav-link' to="/articles/tag/retro">
        RETRO
      </Link>
    </div>
  );
};

export default NavBar;
