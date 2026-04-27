 

import styles from "./SectionItem.module.css"

export function NutrientItem({ label, icon, value, color }) {
  return(
  <div className={`${styles.nutrientItem} ${styles[color]}`}>
    <div className={styles.itemTitle}>
      <p className={styles.itemTitleText}>{label}</p>
      <img src={icon} alt="" />
      <p className={styles.itemTitleText}> :</p>
    </div>
    <p className={styles.itemValue}>{value} kg/ha</p>
  </div>
  ) 
}
 

export function PropertyItem({ icon,label,value }) {
  return(
  <div className= {styles.propertyItem} >
    <div className={styles.itemTitle}>
      <img src={icon} alt="" />
      <p className={styles.itemTitleText}>{label} :</p> 
    </div>
    <p className={styles.itemValue}>{value}</p>
  </div>
  ) 
}

