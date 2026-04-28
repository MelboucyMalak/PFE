import { determineColorClass } from "../../../../../../utils/determineColorClass"
import { determineScoreImg } from "../../../../../../utils/determineScoreImg"
determineColorClass
import styles from "./NutrientItem.module.css"

export function NutrientItem({ context, icon }) {

  const nutrient = context.nutrient
  const score = context.score
  const available = context.available
  const need = context.need
  const deficit = context.deficit
 
  const scoreImg = determineScoreImg(score)
  const colorClass = determineColorClass(scoreImg)
  return (
    <div className={`${styles.nutrientItem} ${styles[colorClass]}`}> 
        <p className={styles.nutrientTitle}>{nutrient}
          <img src={icon} alt={icon} /> :
        </p> 
      <div className={styles.scoreContainer}>
        <div className={styles.scoreImg}>
          <img src={`/ratingIcons/${scoreImg}.png`} alt="" />
          <span className={styles.score}>{score}%</span>
        </div>
        <p className={styles.scoreText}>
          Soil covers {score}% of crop's need
        </p>
      </div>
      <div className={styles.nutrientAnalysis}>
        <p className={styles.label}>{"Available : "}<span>{available}kg/ha</span></p>
        <p className={styles.label}>{"Crop’s need: "}<span>{need}kg/ha</span></p>
        <p className={styles.label}>{"Deficit — Add : "}<span className={styles.deficit}>{deficit}kg/ha</span></p>
      </div>
    </div>
  )
}