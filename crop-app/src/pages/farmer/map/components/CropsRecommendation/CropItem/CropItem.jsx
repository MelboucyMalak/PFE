import { getScoreDisplay } from "../../../utils/getScoreDisplay"
import duration from "@/assets/images/cropsRelated/duration.png"
import calendar from "@/assets/images/cropsRelated/calendar.png"

import styles from "./CropItem.module.css"

const getCropImageUrl = (name) => {
  if (!name) return '/placeholder-crop.png';
  
  const lowerName = name.toLowerCase().trim();
  if (lowerName === 'chow chow' || lowerName === 'chow-chow' || lowerName === 'chowchow') {
    return '/crops/Chayote.png';
  }
  if (lowerName === 'chili' || lowerName === 'chilli' || lowerName === 'chillies') {
    return '/crops/Chilie.png';
  }

  const formattedName = name.trim().replace(/[-\s]+/g, '_');
  const parts = formattedName.split('_');
  const capitalized = parts.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase();
    }
  }).join('_');

  return `/crops/${capitalized}.png`;
};

export function CropItem({ id, name, cropMonths, durationDays,  rating,  handleCropChoice, setCropContext, rawItem  }) {
  const scoreDisplay = getScoreDisplay(Number(rating)) 
     const rank = scoreDisplay.rank
     const colorClass = scoreDisplay.color 
     const compatibility = scoreDisplay.compatibility
  return (
    <div 
      className={`${styles.cropItem} ${styles[colorClass]}`}
      onClick={() => { 
        handleCropChoice()
        setCropContext({ id, name, cropMonths, durationDays, rating, rank, colorClass, compatibility, rawItem })
      }}
    >
      <div className={styles.cropIcon}>
        <img 
          src={getCropImageUrl(name)} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-crop.png';
          }}
        />
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
        <div className={styles.ratingLabel}>
          Compatibility: {compatibility}
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.cropRating}>
          <div className={styles.ratingContainer}>
            <img src={`/ratingIcons/cup${rank}.png`} alt="" />
            <p>{rating}%</p>
          </div>
          <img src={`/ratingIcons/mood${rank}.png`} alt="" />
        </div>
        <div className={styles.arrowBtn}>
          <img src={`/ratingIcons/arrow${rank}.png`} alt="" />
        </div>
      </div>
    </div>

  )
}