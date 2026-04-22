import divider from '../../images/dividers/divider-3.png';
import styles from './Faq.module.css';

export function Faq() {
  return (
    <div className={styles.faq} id='faq'>
      <div className={styles.faqTitle}>
        <p className={styles.faqTitleText}>Frequently Asked Questions</p>
        <img className={styles.faqDivider} src={divider} alt="" />
      </div>
      <p className={styles.faqText}>
        Everything you need to know before planting your first recommendation.
      </p>
      <div className={styles.faqContentContainer}>
        <div className={styles.faqContent}>
          <p className={styles.faqContentTitle}>How accurate are the reccomendations ?</p>
          <p className={styles.faqContentText}>
            Our recommendations are based on real agronomic data, soil science, and regional climate models. While no system is perfect, Torbati gives you data-driven guidance tailored to your exact location rather than generic advice.
          </p>
        </div>

        <div className={styles.faqContent}>
          <p className={styles.faqContentTitle}>Is my location data kept private ? 
          </p>
          <p className={styles.faqContentText}>
            Yes. Your location is only used to generate crop recommendations for your parcel. We do not share or sell your personal data. You can review our privacy policy for full details.
          </p>
        </div>

        <div className={styles.faqContent}>
          <p className={styles.faqContentTitle}>
            What happens after i get my reccomendation ?
          </p>
          <p className={styles.faqContentText}>
            Along with crop suggestions, Torbati provides a follow-up plan covering planting timelines, care tips, and seasonal guidance so you can farm smarter every step of the way.
          </p>
        </div>

        <div className={styles.faqContent}>
          <p className={styles.faqContentTitle}>
            Is Torbati free to use  ?
          </p>
          <p className={styles.faqContentText}>
            Torbati is currently free to access. Simply create an account, pin your location, and get your personalized crop plan right away — no payment required.
          </p>
        </div>
      </div>
    </div>
  );
}