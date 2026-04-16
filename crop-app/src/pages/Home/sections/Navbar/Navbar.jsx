import './Navbar.css';
import logo from '../../../../assets/images/logo.png';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-logo">
        <img className='logo' src={logo} alt="Logo" />
        <p className='logo-text'>Torbati</p>
      </div>
      <ul className="nav-sections">
        <li><a href="">Home</a></li>
        <li><a href="">About</a></li>
        <li><a href="">FAQ</a></li>
      </ul>
      <div className="full-action-buttons">
        <select className="language" defaultValue="en">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
        <div className="signin-login-buttons">
          <button className="signin-btn">Sign In</button>
          <button className="login-btn">Login</button>
        </div>
      </div>
      
    </header>
  );
}