
import styles from './PersonCard.module.css';

export function PersonCard({ image, name, roleName, roleImg }) {
  return ( 
    <div className={styles.personCard}>
      <img className={styles.personImg} src={image} alt={`${name}'s profile`} />
      <p className={styles.personName}>{name}</p>
      <div className={`${styles.personRole} 
        ${roleName === 'Front-end' ? styles.frontendRole : styles.backendRole}`}>
        <p className={styles.personRoleName}>
          {roleName}
        </p>
        <img className={styles.roleImg} src={roleImg} alt={`${roleName}'s icon`} />
      </div>
      
    </div>
  );
}