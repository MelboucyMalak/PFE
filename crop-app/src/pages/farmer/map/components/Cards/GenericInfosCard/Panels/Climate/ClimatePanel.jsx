import { useState } from "react"
import { WeatherItem } from "./WeatherItem/WeatherItem"
import { AverageItem } from "./AverageItem/AverageItem"
import dot from "@/assets/images/soilWeatherRelated/clearDot.png"
import marker from "@/assets/images/soilWeatherRelated/blueMarker.png"
import weather from "@/assets/images/soilWeatherRelated/coloredWeather.png"
import soilMoisture from "@/assets/images/soilWeatherRelated/blueSoilMoisture.png"
import humidity from "@/assets/images/soilWeatherRelated/blueHumidity.png"
import wind from "@/assets/images/soilWeatherRelated/blueWind.png"
import downArrow from "@/assets/images/soilWeatherRelated/downArrow.png"
import upArrow from "@/assets/images/soilWeatherRelated/upArrow.png"
import thermometer from "@/assets/images/soilWeatherRelated/blueThermometer.png"
import rainFall from "@/assets/images/soilWeatherRelated/blueRainFall.png"
import earth from "@/assets/images/soilWeatherRelated/earth.png"
import avgHumidity from "@/assets/images/soilWeatherRelated/blueAvgHumidity.png"
import styles from "./ClimatePanel.module.css"

export function ClimatePanel() {
  const [weatherItemsIsVisible, setWeatherItems] = useState(true)

  return (
    <div className={styles.climatePanel}>
      <section className={styles.liveWeatherContainer}>
        <div className={styles.weatherTitle}>
          <img src={dot} alt="" />
          <p className={styles.weatherTitleText}>Live weather</p>
        </div>
        <div className={styles.liveWeather}>
          <div className={styles.metaWeather}>
            <div className={styles.metaHeader}>
              <div className={styles.region}>
                <img src={marker} alt="" />
                <p className={styles.regionName}>Sétif Region</p>
              </div>
              <p className={styles.date}>April 7th ,14:32 pm </p>
            </div>
            <p className={styles.temp}>35°C</p>
          </div>
          <div className={styles.briefWeather}>
            <img src={weather} alt="" />
            <p className={styles.briefText}>Partly Cloudy</p>
          </div>
        </div>
        {weatherItemsIsVisible && <div className={styles.weatherItems}>
          <WeatherItem icon={soilMoisture}
            label="Soil Moisture:"
            value="8.37%" />
          <WeatherItem icon={humidity}
            label="Relative Humidity:"
            value="55%" />
          <WeatherItem icon={wind}
            label="Wind Speed:"
            value="20 m/s" />
        </div>}
        <button className={styles.showWeatherItems}>
          <img src={weatherItemsIsVisible ? upArrow : downArrow} alt=""
            onClick={() => setWeatherItems((e) => !e)} />
        </button>
      </section>
      <section className={styles.averagesSection}>
        <div className={styles.sectionTitle}>
          <img src={dot} alt=". " />
          <p className={styles.sectionTitleText}>Climate Averages</p>
        </div>

        <div className={styles.sectionBody}>
          <div className={styles.sectionLine}>
            <AverageItem icon={thermometer} label="Temperature" value={"25°C"}  />
            <AverageItem icon={rainFall} label="Rainfall" value={"440 mm "}  />
          </div>

          <div className={styles.sectionLine}>
            <AverageItem icon={avgHumidity} label="Humidity" value={"80%"}  />
            <AverageItem icon={earth} label="Climate zone" value={"Csa"}  />
          </div>
        </div>
      </section>
    </div>
  )
}

