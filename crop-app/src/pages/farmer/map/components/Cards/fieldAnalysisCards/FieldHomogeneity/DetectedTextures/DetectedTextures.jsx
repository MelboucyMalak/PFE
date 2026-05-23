import { getScoreDisplay } from "../../../../../utils/getScoreDisplay"
import styles from "./DetectedTextures.module.css"

export function DetectedTextures({textures, nbr}){ 
  return(
    <div className={styles.detectedTextures}>
      <p className={styles.title}>Textures · soil sections</p>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.headerTitle}>Detected Textures</p>
          <p className={styles.nbrFound}>{textures ? textures.length : 0} found </p>
        </div>
        <div className={styles.textureItems}>
          {textures && textures.map((texture, i) => {
            const name = texture.name
            const score = texture.score
            const coverage = texture.coverage
            const scoreDisplay = getScoreDisplay(score)
            const colorClass = scoreDisplay.color
        
            return(
            <div key={i} className={styles.item}>
              <p className={styles.name}>{name}</p>
              <p className={`${styles.score} ${styles[colorClass]}`}>Crop Score : {score}%</p>
              <p className={styles.coverage}>{coverage}% of field</p>
            </div>
            ) 
          })}
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
    
  )
}