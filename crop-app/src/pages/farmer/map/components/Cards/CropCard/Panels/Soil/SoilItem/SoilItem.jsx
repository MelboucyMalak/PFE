import styles from "./SoilItem.module.css"

export function  SoilItem({icon,label, value}){
  return (
    <div className= {styles.soilItem}  >
      <div className={styles.bodyTitle}>
        <img src={icon} alt="" />
        <p className={styles.labelText
        } >{label} :</p> 
      </div>
      <p className={styles.itemValue}>
        {value}
      </p>
    </div>
  )
}