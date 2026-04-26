import { NutrientItem, PropertyItem } from "./SectionItem/SectionItem"
import dot from "@/assets/images/soilWeatherRelated/listDot.png"
import N from "@/assets/images/soilWeatherRelated/N.png"
import P from "@/assets/images/soilWeatherRelated/P.png"
import K from "@/assets/images/soilWeatherRelated/K.png"
import PH from "@/assets/images/soilWeatherRelated/PH.png"
import soil from "@/assets/images/soilWeatherRelated/soil.png"
import styles from "./SoilPanel.module.css"

export function SoilPanel() {
  return (
    <div className={styles.soilPanel}>
      <section className={styles.nutrientSection}>
        <div className={styles.sectionTitle}>
          <img src={dot} alt=". " />
          <p className={styles.sectionTitleText}>NPK Nutrients</p>
        </div>

        <div className={styles.sectionBody}>
          <NutrientItem label="Nitrogen" icon={N} value={"90"} color="blue" />
          <NutrientItem label="Phosphorus" icon={P} value={"180"} color="green" />
          <NutrientItem label="Potassium" icon={K} value={"220"} color="orange" />
        </div>

      </section >
      <section className={styles.propertiesSection}>
        <div className={styles.sectionTitle}>
          <img src={dot} alt=". " />
          <p className={styles.sectionTitleText}>Soil Properties</p>
        </div>
        <div className={styles.sectionBody}>
          <PropertyItem label="PH" icon={PH} value={"6.5"} />
          <PropertyItem label="Soil texture" icon={soil} value={"Sandy loam"} />
        </div>


      </section>
    </div >
  )
}