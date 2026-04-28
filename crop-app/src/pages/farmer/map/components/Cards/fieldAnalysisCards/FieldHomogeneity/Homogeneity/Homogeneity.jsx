import { determineScoreImg } from "../../../../../utils/determineScoreImg"
import styles from "./Homogeneity.module.css"

export function Homogeneity({winner}){
  const name = winner.name
  const coverage= winner.coverage
  const circle = coverage >50 ? determineScoreImg(coverage) : 0
  console.log(coverage)
  const homoScore =  circle !== 0 ? 
                    `${coverage}%\nHomogenous` : ""
  const homoStatus = circle !== 0 ? 
                    `Homogenous` : "Not Homogenous"  
  const coverageText = circle !== 0 ?   
                      `${name} covers most of the land space` : ""    
  return(
    <div className={styles.homogeneity}>
      <p className={styles.containerTitle}>Field Homogeneity</p>
      <div className={styles.homoAnalysis}>
        <div className={styles.scoreContainer}>
          <img src={`/ratingIcons/${circle}.png`} alt="" />
          <p>{homoScore}</p>
        </div>
        <div className={styles.textAnalysis}>
          <p className={styles.homoStatus}>{homoStatus}</p>
          <p className={styles.coverageText}>{coverageText}</p>
        </div>
      </div>

    </div>
  )
}