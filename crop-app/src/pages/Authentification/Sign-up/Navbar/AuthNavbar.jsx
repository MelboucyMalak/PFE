
import logo from '../../../../assets/images/logo.png';
import exit from '../../images/exit.png'
import styles from './AuthNavbar.module.css'

export function AuthNavbar() {
  return (
    < header className={styles.navbar} >
      <div className={styles.navLogo}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <p className={styles.logoText}>Torbati</p>
      </div>
      <button className={styles.backHomeBtn}>
        <img className={styles.exit} src={exit} alt="exit-door" />
        <p className= {styles.backHomeText} >Back to home</p>
      </button>

    </header >
  )

}