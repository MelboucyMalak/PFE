import duration from "@/assets/images/cropsRelated/duration.png"
import calendar from "@/assets/images/cropsRelated/calendar.png"
import styles from "./CardParts.module.css"

export function CropCardHeader({ cropContext }) {
  const { name, cropMonths, durationDays, rating, rank, colorClass, compatibility } = cropContext

  return (
    <div className={`${styles.cropCardHeader} ${styles[colorClass]}`}>
      <div className={styles.cropIcon}>
        <img src={`/crops/${name}.png`} alt="" />
      </div>
      <div className={styles.cropMeta}>
        <p className={styles.cropName}>
          {name}
        </p>
        <div className={styles.cropCycle}>
          <div className={styles.cropMonths}>
            <img src={calendar} alt="" />
            <p className={styles.months}>
              {cropMonths}
            </p>
          </div>
          <p>/</p>
          <div className={styles.cropDuration}>
            <img src={duration} alt="" />
            <div>
              <p className={styles.duration}>{durationDays}</p>
              <p>days</p>
            </div>
          </div>
        </div>
        <div className={styles.cropRating}>
          <div className={styles.ratingContainer}>
            <img src={`/ratingIcons/cup${rank}.png`} alt="" />
            <p>{rating}%{compatibility}</p>
          </div>
          <img src={`/ratingIcons/mood${rank}.png`} alt="" />
        </div>
      </div>

    </div>
  )
}

export function CropCardBodyHeader({ generalOn, cropSoilOn, cropClimateOn, fertilizationOn, setGeneral, setCropSoil, setCropClimate, setFertilization }) {

  const panels = { general: setGeneral, soil: setCropSoil, climate: setCropClimate, fertilization: setFertilization }

  function switchPanel(active) {
    Object.entries(panels).forEach(([key, set]) => set(key === active))
  }
  return (
    <div className={styles.bodyHeader}>
      <button className={`${styles.bodyHeaderBtn} ${generalOn ? styles.active : ""}`}
        onClick={() => switchPanel('general')}>General</button>
      <button className={`${styles.bodyHeaderBtn} ${cropSoilOn ? styles.active : ""}`}
        onClick={() => switchPanel('soil')}>Soil</button>
      <button className={`${styles.bodyHeaderBtn} ${cropClimateOn ? styles.active : ""}`}
        onClick={() => switchPanel('climate')}>Climate</button>
      <button className={`${styles.bodyHeaderBtn} ${fertilizationOn ? styles.active : ""}`}
        onClick={() => switchPanel('fertilization')}>Fertilization</button>
    </div>
  )
}
