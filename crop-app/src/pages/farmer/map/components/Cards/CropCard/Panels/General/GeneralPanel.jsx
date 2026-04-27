import calendar from "@/assets/images/cropsRelated/cardCalendar.png"
import duration from "@/assets/images/cropsRelated/cardDuration.png"
import roots from "@/assets/images/cropsRelated/roots.png"
import note from "@/assets/images/cropsRelated/generalNote.png"
import styles from "./GeneralPanel.module.css"

export function GeneralPanel({cropContext}){
  const cropMonths = cropContext.cropMonths
  const durationDays = cropContext.durationDays 

  return(
    <div className={styles.generalPanel}>
       <div className={styles.generalItems}>
         <div className={styles.generalItem}>
          <div className={styles.itemImgContainer}><img src={calendar} alt="" /></div>
          <div className={styles.textContainer}>
            <p className={styles.itemTitle}>
              Sowing Month:
            </p>
            <p className={styles.itemText}>{cropMonths}</p>
          </div>
         </div>
         <div className={styles.generalItem}>
          <div className={styles.itemImgContainer}><img src={duration} alt="" /></div>
          <div className={styles.textContainer}>
            <div className={styles.itemTitle}>
              Duration:
            </div>
            <p className={styles.itemText}>{durationDays}</p>
          </div>
         </div>
         <div className={styles.generalItem}>
          <div className={styles.itemImgContainer}><img src={roots} alt="" /></div>
          <div className={styles.textContainer}>
            <div className={styles.itemTitle}>
              Root Depth:
            </div>
            <p className={styles.itemText}>40-60</p>
          </div>
         </div>
       </div>

       <div className={styles.generalNote}>
        <div className={styles.noteTitle}>
          <img src={note} alt="" />
          <p>Note:</p>
        </div>
        <p className={styles.noteText}>
          Best grown in cool seasons. Avoid waterlogged soils. Requires hilling during growth.</p>
       </div> 
    </div>
  )
}