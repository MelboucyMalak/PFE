 
import { MeteoCardHeader, MeteoCardFooter } from "./CardParts/CardParts"
import { WeatherItem } from "./WeatherItem/WeatherItem"
import compass from "@/assets/images/soilWeatherRelated/darkCompass.png"
import soilMoisture from "@/assets/images/soilWeatherRelated/soilMoisture.png"
import humidityMeteo from "@/assets/images/soilWeatherRelated/humidityMeteo.png"
import wind from "@/assets/images/soilWeatherRelated/wind.png"
import { disableMapInteractions, enableMapInteractions } from "../../../utils/MapOverlay"
import styles from "./MeteoCard.module.css"

export function MeteoCard({setViewOn, map, handleShowLocation }) {

   

  return (
    <div className={ styles.meteoCard }
     onMouseEnter={() => disableMapInteractions(map, setViewOn)}
  onMouseLeave={() => enableMapInteractions(map, setViewOn)}>
      <MeteoCardHeader/>
      <div className={styles.cardBody}>
        <div className={styles.cardBck}>
        </div>
        <div className={styles.coordSection}>
          <div className={styles.sectionTitle}>Coordinates</div>
          <div className={styles.coordBody}>
            <div className={styles.bodyTitle}>
              <img src={compass} alt="" />
              <p className={styles.coordTitleText}>Latitude · Longitude:</p>
            </div>
            <p className={styles.coordText}>Lat:36.1°N, Long:5.4°E</p>
          </div>
        </div>
        <div className={styles.weatherSection}>
          <p className={styles.sectionTitle}>Weather Status</p>
          <div className={styles.weatherBody}>
            <WeatherItem icon={soilMoisture}
              label="Soil Moisture:"
              value="8.37%" />
            <WeatherItem icon={humidityMeteo}
              label="Relative Humidity:"
              value="55%" />
            <WeatherItem icon={wind}
              label="Wind Speed:"
              value="20 m/s" />
          </div>
        </div>
      </div>
      <MeteoCardFooter handleShowLocation={handleShowLocation}  />
    </div>
  )
}