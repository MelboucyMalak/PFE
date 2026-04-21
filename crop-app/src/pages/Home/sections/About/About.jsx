import { PersonCard } from './PersonCard/PersonCard';
import noufel from '../../images/About/noufel.png';
import malak from '../../images/About/malak.png';
import zineb from '../../images/About/zineb.png';
import fares from '../../images/About/fares.png';
import painting from '../../images/About/painting.png';
import db from '../../images/About/db.png';

import styles from './About.module.css';
import divider from '../../images/dividers/divider-2.png';

export function About() {
  return (
    <div className={styles.about}>

      <div className={styles.aboutTitle}>
        <p className={styles.aboutTitleText}>The People Behind Torbati  </p>
        <img className={styles.aboutDivider} src={divider} alt="" />
      </div>
      <p className={styles.aboutText}>
        Built by 4 passionate USTHB students under the supervision of <span>Mrs. Amira Karkad</span>, Torbati was created with one goal in mind — to put real, data-driven guidance in the hands of every Algerian farmer, no matter where they are.
      </p>
      <div className={styles.cards}>
        <PersonCard image={noufel} 
        name={"Embarek Noufel"} 
        roleName={"Front-end"} roleImg={painting} />

        <PersonCard image={malak} 
        name={"Melboucy Malak"} 
        roleName={"Front-end"} 
        roleImg={painting} />

        <PersonCard image={zineb} 
        name={"Berrachedi Zineb"} 
        roleName={"Back-end"} 
        roleImg={db} />

        <PersonCard image={fares} 
        name={"Tabet Fares"} 
        roleName={"Back-end"} 
        roleImg={db} />
      </div>





    </div>
  );
}