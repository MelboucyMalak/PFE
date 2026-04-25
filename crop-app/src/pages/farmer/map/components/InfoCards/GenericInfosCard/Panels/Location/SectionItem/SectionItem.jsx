import sectionStyles  from "./SectionItem.module.css"
import styles from "../LocationPanel.module.css"

export function SectionItem({label, icon, value}){
  return (
    <div className={`${styles.sectionItem} ${sectionStyles.sectionItem}`}>
      <div className={styles.bodyTitle}>
        <img src={icon} alt="" />
        <p className={sectionStyles.labelText
        } >{label} :</p> 
      </div>
      <p className={sectionStyles.itemValue}>
        {value}
      </p>
    </div>
  )
}