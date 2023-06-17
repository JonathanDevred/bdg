import { Link } from 'react-router-dom';
import './styles.scss';

const NavBar = () => {
  return (
    <div className="navbar">
      <Link className='nav-link' to="/switch">
        SWITCH
      </Link>

      <Link className='nav-link' to="/playstation">
        PS4/PS5
      </Link>

      <Link className='nav-link' to="/xbox">
        XBOX ONE S/X
      </Link>

      <Link className='nav-link' to="/pc">
        PC
      </Link>
    </div>
  );
};

export default NavBar;
