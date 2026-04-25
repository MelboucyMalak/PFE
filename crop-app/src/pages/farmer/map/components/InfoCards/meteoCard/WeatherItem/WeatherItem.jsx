import styles from "./WeatherItem.module.css"

export function WeatherItem({icon, label, value}){
  return(
    <div className={styles.weatherItem}>
      <img src={icon} alt="" />
      <p className={styles.weatherItemLabel}>{label}</p>
      <p className={styles.weatherItemValue}>{value}</p>
    </div>
  )
}