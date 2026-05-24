import styles from './Navbar.module.css';
import logo from '../../../../assets/images/New-logo.png';

export function Navbar() {
  return (
    <header className={styles.navbar}  >
      <div className={styles.navLogo}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <p className={styles.logoText}>Torbati</p>
      </div>
      <ul className={styles.navSections}>
        <li><a href="#how">How</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <div className={styles.fullActionButtons}>
        <select className={styles.language} defaultValue="en">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
        <div className={styles.signinLoginButtons}>
          <button className={styles.signinBtn}><a href="/sign-up">Sign Up</a></button>
          <button className={styles.loginBtn}><a href="/login">Login</a></button>
        </div>
      </div>
      
    </header>
  );
}