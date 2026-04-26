import { SectionItem } from "./SectionItem/SectionItem"
import compass from "@/assets/images/soilWeatherRelated/clearCompass.png"
import sessionId from "@/assets/images/soilWeatherRelated/sessionId.png"
import date from "@/assets/images/soilWeatherRelated/date.png"
import angle from "@/assets/images/soilWeatherRelated/angle.png"
import land from "@/assets/images/soilWeatherRelated/landCover.png"
import styles from "./LocationPanel.module.css"

export function LocationPanel() {
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
          <p className={styles.coordText}>Lat:36.1°N, Long:5.4°E</p>
        </div>
      </section>

      <section className={styles.sessionSection}>
        <p className={styles.sectionTitle}>Session</p>
        <div className={styles.sectionBody}>
          <SectionItem label="Session"
            icon={sessionId}
            value="#RS-00142" />
          <SectionItem label="Date·Time"
            icon={date}
            value="2024-04-07,14:32" />
        </div>
      </section>

      <section className={styles.landSection}>
        <p className={styles.sectionTitle}> LandDetails</p>
        <div className={styles.sectionBody}>
          <SectionItem label="Slope angle"
            icon={angle}
            value="3.2°" />
          <SectionItem label="Land cover"
            icon={land}
            value="Cropland" />
        </div>
      </section>
    </div>
  )
}