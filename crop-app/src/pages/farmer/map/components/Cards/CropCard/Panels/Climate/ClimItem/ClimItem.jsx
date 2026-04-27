import styles from "./ClimItem.module.css"

export function  ClimItem({icon,label, value}){
  return (
    <div className= {styles.climItem}  >
      <div className={styles.bodyTitle}>
        <img src={icon} alt="" />
        <p className={styles.labelText
        } >{label} </p> 
      </div>
      <p className={styles.itemValue}>
        {value}
      </p>
    </div>
  )
}