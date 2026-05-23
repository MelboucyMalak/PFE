import duration from "@/assets/images/cropsRelated/duration.png"
import calendar from "@/assets/images/cropsRelated/calendar.png"
import styles from "./CardParts.module.css"

const getCropImageUrl = (name) => {
  if (!name) return '/crops/Wheat.png';
  
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

export function CropCardHeader({ cropContext, onClose }) {
  const { name, cropMonths, durationDays, rating, rank, colorClass, compatibility } = cropContext

  return (
    <div className={`${styles.cropCardHeader} ${styles[colorClass]}`}>
      <div className={styles.cropIcon}>
        <img 
          src={getCropImageUrl(name)} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/crops/Wheat.png';
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
        <div className={styles.cropRating}>
          <div className={styles.ratingContainer}>
            <img src={`/ratingIcons/cup${rank}.png`} alt="" />
            <p>{rating}%{compatibility}</p>
          </div>
          <img src={`/ratingIcons/mood${rank}.png`} alt="" />
        </div>
      </div>

      <button className={styles.closeBtn} onClick={onClose} title="Back to Crops List">
        <img className={styles.defaultExit} src="/guidePages/Exit-button.png" alt="close" />
        <img className={styles.hoverExit} src="/guidePages/Exit-button-hover.png" alt="close hover" />
      </button>
    </div>
  )
}

export function CropCardBodyHeader({ activeTab, setActiveTab }) {
  return (
    <div className={styles.bodyHeader}>
      <button className={`${styles.bodyHeaderBtn} ${activeTab === 'general' ? styles.active : ""}`}
        onClick={() => setActiveTab('general')}>General</button>
      <button className={`${styles.bodyHeaderBtn} ${activeTab === 'soil' ? styles.active : ""}`}
        onClick={() => setActiveTab('soil')}>Soil</button>
      <button className={`${styles.bodyHeaderBtn} ${activeTab === 'climate' ? styles.active : ""}`}
        onClick={() => setActiveTab('climate')}>Climate</button>
      <button className={`${styles.bodyHeaderBtn} ${activeTab === 'fertilization' ? styles.active : ""}`}
        onClick={() => setActiveTab('fertilization')}>Fertilization</button>
    </div>
  )
}
