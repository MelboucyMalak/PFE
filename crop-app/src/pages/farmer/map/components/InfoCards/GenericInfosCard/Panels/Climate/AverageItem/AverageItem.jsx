import styles from "./AverageItem.module.css"

export function  AverageItem({icon,label,  value}){
  return (
    <div className= {styles.  averageItem}  >
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