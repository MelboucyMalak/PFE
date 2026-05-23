import { SectionItem } from "./SectionItem/SectionItem"
import compass from "@/assets/images/soilWeatherRelated/clearCompass.png"
import sessionId from "@/assets/images/soilWeatherRelated/sessionId.png"
import date from "@/assets/images/soilWeatherRelated/date.png"
import angle from "@/assets/images/soilWeatherRelated/angle.png"
import land from "@/assets/images/soilWeatherRelated/landCover.png"
import styles from "./LocationPanel.module.css"

export function LocationPanel({ position, placeName, sessionInfo }) {
  const formatCoords = (lat, lng) => {
    if (lat === undefined || lng === undefined) return "Lat: N/A, Long: N/A";
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `Lat: ${Math.abs(lat).toFixed(4)}°${latDir}, Long: ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  };

  return (
    <div className={styles.locationPanel}>
      <section className={styles.coordSection}>
        <p className={styles.sectionTitle}>
          Coordinates
        </p>
        <div className={styles.coordBody}>
          <div className={styles.bodyTitle}>
            <img src={compass} alt="" />
            <p className={styles.coordTitleText}>Latitude · Longitude:</p>
          </div>
          <p className={styles.coordText}>{formatCoords(position?.lat, position?.lng)}</p>
        </div>
      </section>

      <section className={styles.sessionSection}>
        <p className={styles.sectionTitle}>Session</p>
        <div className={styles.sectionBody}>
          <SectionItem label="Session"
            icon={sessionId}
            value={sessionInfo?.id || "#RS-00142"} />
          <SectionItem label="Date·Time"
            icon={date}
            value={sessionInfo?.date || "2024-04-07,14:32"} />
        </div>
      </section>

      <section className={styles.landSection}>
        <p className={styles.sectionTitle}> LandDetails</p>
        <div className={styles.sectionBody}>
          <SectionItem label="Slope angle"
            icon={angle}
            value={sessionInfo?.slopeAngle || "3.2°"} />
          <SectionItem label="Land cover"
            icon={land}
            value={sessionInfo?.landCover || "Cropland"} />
        </div>
      </section>
    </div>
  )
}