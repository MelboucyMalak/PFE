import divider from '../../images/dividers/divider-1.png';
import signInImg from '../../images/features/sign-in.png';
import pinLocationImg from '../../images/features/pin-location.png';
import dataAnalysisImg from '../../images/features/data-analysis.png';
import styles from './Features.module.css';

export function Features() {
  return (
    <div className={styles.features}>

      <div className={styles.featuresTitle}>
        <p className={styles.featuresTitleText}>How does it work?</p>
        <img className={styles.featuresDivider} src={divider} alt="" />
      </div>

      <div className={`${styles.featuresContent} ${styles.featuresContentSignIn}`}>
        <p className={styles.featuresContentText}>
          1.  First of all Sign in and make a new  account or simply Log in
        </p>
        <img className={styles.featuresContentImage} src={signInImg} alt="Sign In" />
      </div>

      <div className={`${styles.featuresContent} ${styles.featuresContentLocation}` }>
        <img className={styles.featuresContentImage} src={pinLocationImg} alt="Pin Location" />
        <p className={styles.featuresContentText}>
          2. Pin your Location on the map,and allow our system to guide you towards the next Data gathering steps
        </p> 
      </div>

      <div className={`${styles.featuresContent} ${styles.featuresContentDataAnalysis}`}>
        <p className={styles.featuresContentText}>
          3.Torbati analyzes everything and suggests the best permanent crops for your exact  parcel —instantly, while also providing a  follow plan .
        </p>
        <img className={styles.featuresContentImage} src={dataAnalysisImg} alt="Data Analysis" />
      </div>

    </div>
  );
}