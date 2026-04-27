 
 import marker from "@/assets/images/soilWeatherRelated/marker.png"
import weather from "@/assets/images/soilWeatherRelated/weather.png"
import styles from "./CardParts.module.css"

export function MeteoCardHeader(){
  
  return(
    <div className={
      styles.meteoCardHeader
    }>
      <div className={styles.cardMeta}>
        <div className={styles.region}>
          <img src={marker} alt="" />
          <p className={styles.regionName}>Sétif Region</p>
        </div>
        <p className={styles.date}>April 7th ,14:32 pm</p>
      </div>
      <div className={styles.currentMeteo}>
        <p className={styles.currentTemp}>25°C</p>
        <div className={styles.currentWeather}>
          <p className={styles.currentWeatherText}>Partly Cloudy</p>
          <img src={weather} alt="" />
        </div>
      </div>
    </div>
  )
}

export function MeteoCardFooter({handleShowLocation}){ 
  return(
    <div className={styles.meteoCardFooter}>
    <button className={styles.showLocationBtn}
    onClick={handleShowLocation}>Show Location Infos</button>
  </div>
  ) 
}