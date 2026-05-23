import { FertCardHeader } from "../FertCardParts/FertCardParts"
import { NutrientItem } from "./NutrientItem/NutrientItem"
import N from "@/assets/images/cropsRelated/N.png"
import P from "@/assets/images/cropsRelated/P.png"
import K from "@/assets/images/cropsRelated/K.png" 
import note from "@/assets/images/cropsRelated/nutrientNote.png"
import styles from "./FinalResult.module.css"

export function FinalResult({ resultContext, onClose, isLoading }) {
  const name = resultContext.name
  const PContext = resultContext.P
  const NContext = resultContext.N
  const KContext = resultContext.K
  const PH = resultContext.PH
  const PHNote = resultContext.PHNote
  return (
    <div className={styles.finalResult}> 
      <FertCardHeader name={name} onClose={isLoading ? undefined : onClose} />
      <div className={styles.cardBody}>
        <p className={styles.bodyTitle}>{name}'s Personalized Fertilization</p>
        <div className={styles.cardBck}></div>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Calculating personalized recommendation...</p>
          </div>
        ) : (
          <>
            <div className={styles.nutrients}>
              <NutrientItem context={NContext} icon={N} />
              <NutrientItem context={PContext} icon={P} />
              <NutrientItem context={KContext} icon={K} />
            </div>
            <div className={styles.nutrientNote}>
              <div className={styles.title}>
                <img src={note} alt="" />
                <p className={styles.titleText}>
                  PH-Note:
                </p>
              </div>
              <p className={styles.noteText}>
                 PH {PH} : {PHNote}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}