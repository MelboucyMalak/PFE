import farmer from '../../images/farmer-hero.png';
import styles from './Hero.module.css';


export function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.heroTitle}>Know Your Soil, 
Grow Your Future</p>
        <p className={styles.heroDescription}><span>Torbati</span> gives you personalized crop recommendations based on your soil, climate and region — so you can farm smarter, not harder.</p>
        <button className={styles.heroButton}>Get My Recommendation <div> →</div></button>
      </div>
      <img className={styles.heroImage} src={farmer} alt="Farmer" />
    </div>
   ) 
};