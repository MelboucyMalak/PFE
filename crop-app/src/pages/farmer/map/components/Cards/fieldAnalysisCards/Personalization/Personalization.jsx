import { FertCardHeader, PersonalizationFooter } from "../FertCardParts/FertCardParts"
import shapes from "@/assets/images/fieldRelated/shapes.png"
import nbrFound from "@/assets/images/fieldRelated/nbrFound.png"
import depthIcon from "@/assets/images/fieldRelated/depth.png"
import chemical from "@/assets/images/fieldRelated/chemical.png"
import styles from "./Personalization.module.css"

export function Personalization({ samplingContext, handleConfirmData }) {
  const nbr = samplingContext.nbr
  const displayNbr = nbr > 1 ? `${nbr} zones` : `${nbr} zone`
  const name = samplingContext.name
  const pattern = samplingContext.pattern
  const depth = samplingContext.depth

  return (
    <div className={styles.personalization}>
      <FertCardHeader name={name} />
      <div className={styles.cardBody}>
        <div className={styles.cardBck}></div>
        <div className={styles.patternContainer}>
          <div className={styles.header}>
            <img src={shapes} alt="" />
            <p>Sampling pattern :{pattern} </p>
          </div>
          <div className={styles.pattern}>
            <img src={`/fieldAnalysis/${pattern}.png`} alt="W" />
          </div>
        </div>
        <div className={styles.soil}>
          <div className={styles.item}>
            <p className={styles.itemTitle}><img src={nbrFound} alt="" /> Zones : </p>
            <p className={styles.value}>{displayNbr}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemTitle}><img src={depthIcon} alt="" /> Sampling depth : </p>
            <p className={styles.value}>{depth} m</p>
          </div>
        </div>
        <div className={styles.guide}>
          <div className={styles.firstLine}>
            <img src={chemical} alt="" />
            <p>Enter your soil test results</p>
          </div>
          <p className={styles.secondLine}>
            Use the average values from your sampling
          </p>
        </div>
        <p className={styles.formLabel}>
          NPK Nutrients · soil PH
        </p>
        <form className={styles.nutrientsForm}>
          <div className={`${styles.nutrientCard} ${styles.cardGreen}`}>
            <p>Phosphorus P:</p>
            <div className={styles.inputGroup}>
              <input type="number" name="phosphorus" placeholder="0" />
              <span className={styles.unit}>ppm</span>
            </div>
          </div>
 
          <div className={`${styles.nutrientCard} ${styles.cardBlue}`}>
            <p>Nitrogen N:</p>
            <div className={styles.inputGroup}>
              <input type="number" name="nitrogen" placeholder="0" />
              <span className={styles.unit}>ppm</span>
            </div>
          </div>
 
          <div className={`${styles.nutrientCard} ${styles.cardOrange}`}>
            <p>Potassium K:</p>
            <div className={styles.inputGroup}>
              <input type="number" name="potassium" placeholder="0" />
              <span className={styles.unit}>ppm</span>
            </div>
          </div>
 
          <div className={`${styles.nutrientCard} ${styles.cardRed}`}>
            <p>Soil pH :</p>
            <div className={styles.inputGroup}>
              <input type="number" name="ph" step="0.1" min="0" max="14" placeholder="4.0 - 10" />
            </div>
          </div>

        </form>
      </div>
      <PersonalizationFooter handlePersonalizeFert={handleConfirmData} />
    </div>
  )
}