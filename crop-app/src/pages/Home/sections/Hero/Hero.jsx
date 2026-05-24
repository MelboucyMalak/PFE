import { useNavigate } from 'react-router-dom';
import farmer from '../../images/farmer-hero.png';
import arrowDefault from '../../../../assets/images/Right-arrow.png';
import arrowHover from '../../../../assets/images/Right-arrow-hover.png';
import styles from './Hero.module.css';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className={styles.hero} id='hero'>
      <div className={styles.heroContent}>
        <p className={styles.heroTitle}>Know Your Soil, 
Grow Your Future</p>
        <p className={styles.heroDescription}><span>Torbati</span> gives you personalized crop recommendations based on your soil, climate and region — so you can farm smarter, not harder.</p>
        <button
          className={styles.heroButton}
          onClick={() => navigate('/sign-up')}
        >
          <span>Get My Recommendation</span>
          <div className={styles.arrowWrapper}>
            <img src={arrowDefault} alt="" className={`${styles.arrowIcon} ${styles.arrowDefault}`} />
            <img src={arrowHover}   alt="" className={`${styles.arrowIcon} ${styles.arrowHover}`}   />
          </div>
        </button>
      </div>
      <img className={styles.heroImage} src={farmer} alt="Farmer" />
    </div>
  );
}