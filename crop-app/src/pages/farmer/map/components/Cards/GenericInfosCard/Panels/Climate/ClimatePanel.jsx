import { useState } from "react"
import { WeatherItem } from "./WeatherItem/WeatherItem"
import { AverageItem } from "./AverageItem/AverageItem"
import dot from "@/assets/images/soilWeatherRelated/clearDot.png"
import marker from "@/assets/images/soilWeatherRelated/blueMarker.png"
import coloredWeather from "@/assets/images/soilWeatherRelated/coloredWeather.png"
import sunnyColor from "@/assets/images/soilWeatherRelated/Sunny-colored.png"
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

const getColoredWeatherIcon = (condition) => {
  if (!condition) return coloredWeather;
  const cond = condition.toLowerCase();
  if (cond.includes("clear") || cond.includes("sunny")) return sunnyColor;
  return coloredWeather;
};

export function ClimatePanel({ placeName, liveWeather, climContext }) {
  const [weatherItemsIsVisible, setWeatherItems] = useState(false)

  const translateKoppen = (code) => {
    if (!code) return "N/A";
    const clean = code.trim();
    const dict = {
      "Csa": "Hot-summer Mediterranean",
      "Bsh": "Hot semi-arid climate",
      "BSh": "Hot semi-arid climate",
      "Bsk": "Cold semi-arid climate",
      "BSk": "Cold semi-arid climate",
      "Bwh": "Hot desert climate",
      "BWh": "Hot desert climate"
    };
    return dict[clean] || dict[clean.toUpperCase()] || dict[clean.toLowerCase()] || clean;
  };

  return (
    <div className={styles.climatePanel}>
      <section 
        className={styles.liveWeatherContainer}
        onClick={() => setWeatherItems((e) => !e)}
      >
        <div className={styles.weatherTitle}>
          <span className={styles.bullet}>•</span>
          <p className={styles.weatherTitleText}>Live weather</p>
        </div>
        <div className={styles.liveWeather}>
          <div className={styles.metaWeather}>
            <div className={styles.metaHeader}>
              <div className={styles.region}>
                <img src={marker} alt="" />
                <p className={styles.regionName}>{placeName || "Sétif Region"}</p>
              </div>
              <p className={styles.date}>{liveWeather?.date || "April 7th ,14:32 pm"}</p>
            </div>
            <p className={styles.temp}>{liveWeather?.temp !== undefined ? `${liveWeather.temp}°C` : "35°C"}</p>
          </div>
          <div className={styles.briefWeather}>
            <img src={getColoredWeatherIcon(liveWeather?.condition)} alt="" />
            <p className={styles.briefText}>{liveWeather?.condition || "Partly Cloudy"}</p>
          </div>
        </div>
        <div 
          className={`${styles.weatherItemsContainer} ${weatherItemsIsVisible ? styles.expanded : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.weatherItems}>
            <WeatherItem icon={soilMoisture}
              label="Soil Moisture:"
              value={liveWeather?.soilMoisture || "8.37%"} />
            <WeatherItem icon={humidity}
              label="Relative Humidity:"
              value={liveWeather?.humidity || "55%"} />
            <WeatherItem icon={wind}
              label="Wind Speed:"
              value={liveWeather?.windSpeed || "20 m/s"} />
          </div>
        </div>
        <button className={styles.showWeatherItems}>
          <img src={weatherItemsIsVisible ? upArrow : downArrow} alt="" />
        </button>
      </section>
      <section className={styles.averagesSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.bullet}>•</span>
          <p className={styles.sectionTitleText}>Climate Averages</p>
        </div>

        <div className={styles.sectionBody}>
          <div className={styles.sectionLine}>
            <AverageItem icon={thermometer} label="Temperature" value={climContext?.temp !== undefined ? `${Math.round(climContext.temp)}°C` : "25°C"}  />
            <AverageItem icon={rainFall} label="Rainfall" value={climContext?.rain !== undefined ? `${climContext.rain} mm` : "440 mm "}  />
          </div>

          <div className={styles.sectionLine}>
            <AverageItem icon={avgHumidity} label="Humidity" value={climContext?.humidity || "80%"}  />
            <AverageItem icon={earth} label="Climate zone" value={translateKoppen(climContext?.koppen || "Csa")}  />
          </div>
        </div>
      </section>
    </div>
  )
}

