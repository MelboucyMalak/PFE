import { NutrientItem } from "./NutrientItem/NutrientItem"
import N from "@/assets/images/cropsRelated/N.png"
import P from "@/assets/images/cropsRelated/P.png"
import K from "@/assets/images/cropsRelated/K.png"
import note from "@/assets/images/cropsRelated/nutrientNote.png"
import styles from "./FertPanel.module.css"

export function FertPanel({ fertContext }) {
  const NContext = fertContext.N
  const PContext = fertContext.P
  const KContext = fertContext.K

  return (
    <div className={styles.fertPanel}>
      <div className={styles.nutrients}>
        <NutrientItem context={NContext} icon={N} />
        <NutrientItem context={PContext} icon={P} />
        <NutrientItem context={KContext} icon={K} />
      </div>
      <div className={styles.nutrientNote}>
        <div className={styles.title}>
          <img src={note} alt="" />
          <p className={styles.titleText}>
            Note:
          </p>
        </div>
        <p className={styles.noteText}>
          These are generic doses per hectare based on your location data. Personalize for precise doses based on your actual parcel.
        </p>
      </div>
    </div>
  )
}