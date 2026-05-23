import marker from "@/assets/images/soilWeatherRelated/marker.png"
import defaultWeather from "@/assets/images/soilWeatherRelated/weather.png"
import sunny from "@/assets/images/soilWeatherRelated/sunny.png"
import cloudy from "@/assets/images/soilWeatherRelated/cloudy.png"
import partly_cloudy from "@/assets/images/soilWeatherRelated/partly_cloudy.png"
import mostly_cloudy from "@/assets/images/soilWeatherRelated/mostly_cloudy.png"
import rainy from "@/assets/images/soilWeatherRelated/rainy.png"
import snowy from "@/assets/images/soilWeatherRelated/snowy.png"
import stormy from "@/assets/images/soilWeatherRelated/stormy.png"
import windy from "@/assets/images/soilWeatherRelated/windy.png"
import styles from "./CardParts.module.css"

const getWeatherIcon = (condition) => {
  if (!condition) return defaultWeather;
  const cond = condition.toLowerCase();
  if (cond.includes("clear") || cond.includes("sunny")) return sunny;
  if (cond.includes("partly cloudy")) return partly_cloudy;
  if (cond.includes("mostly cloudy")) return mostly_cloudy;
  if (cond.includes("cloudy") || cond.includes("overcast")) return cloudy;
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) return rainy;
  if (cond.includes("snow")) return snowy;
  if (cond.includes("storm") || cond.includes("thunderstorm")) return stormy;
  if (cond.includes("wind") || cond.includes("gale")) return windy;
  return defaultWeather;
};

export function MeteoCardHeader({ placeName, liveWeather, isMeteoLoading }){
  if (isMeteoLoading) {
    return (
      <div className={styles.meteoCardHeader}>
        <div className={styles.cardMeta}>
          <div className={styles.region}>
            <div className={styles.skeletonMarker} />
            <div className={styles.skeletonTextRegion} />
          </div>
          <div className={styles.skeletonTextDate} />
        </div>
        <div className={styles.currentMeteo}>
          <div className={styles.skeletonTemp} />
          <div className={styles.currentWeather}>
            <div className={styles.skeletonWeatherText} />
            <div className={styles.skeletonWeatherIcon} />
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className={styles.meteoCardHeader}>
      <div className={styles.cardMeta}>
        <div className={styles.region}>
          <img src={marker} alt="" />
          <p className={styles.regionName}>{placeName || "Sétif Region"}</p>
        </div>
        <p className={styles.date}>{liveWeather?.date || "April 7th ,14:32 pm"}</p>
      </div>
      <div className={styles.currentMeteo}>
        <p className={styles.currentTemp}>{liveWeather?.temp !== undefined ? `${liveWeather.temp}°C` : "25°C"}</p>
        <div className={styles.currentWeather}>
          <p className={styles.currentWeatherText}>{liveWeather?.condition || "Partly Cloudy"}</p>
          <img src={getWeatherIcon(liveWeather?.condition)} alt="" />
        </div>
      </div>
    </div>
  )
}

export function MeteoCardFooter({handleShowLocation, isLoading, isMeteoLoading}){ 
  const isFetching = isLoading || isMeteoLoading;
  return(
    <div className={styles.meteoCardFooter}>
    <button className={`${styles.showLocationBtn} ${isFetching ? styles.disabledBtn : ''}`}
    onClick={handleShowLocation} disabled={isFetching}>
      {isFetching ? (
        <span className={styles.btnLoadingWrapper}>
          <span className={styles.btnSpinner}></span>
          {isMeteoLoading ? "Fetching Weather..." : "Loading Infos..."}
        </span>
      ) : (
        "Show Location Infos"
      )}
    </button>
  </div>
  ) 
}