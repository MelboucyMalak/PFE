import { NutrientItem, PropertyItem } from "./SectionItem/SectionItem"
import dot from "@/assets/images/soilWeatherRelated/listDot.png"
import N from "@/assets/images/soilWeatherRelated/N.png"
import P from "@/assets/images/soilWeatherRelated/P.png"
import K from "@/assets/images/soilWeatherRelated/K.png"
import PH from "@/assets/images/soilWeatherRelated/PH.png"
import soil from "@/assets/images/soilWeatherRelated/soil.png"
import styles from "./SoilPanel.module.css"

export function SoilPanel({ soilContext }) {
  const n = soilContext?.n !== undefined ? soilContext.n : "90";
  const p = soilContext?.p !== undefined ? soilContext.p : "180";
  const k = soilContext?.k !== undefined ? soilContext.k : "220";
  const ph = soilContext?.PH !== undefined ? soilContext.PH : "6.5";
  const texture = soilContext?.texture || "Sandy loam";

  return (
    <div className={styles.soilPanel}>
      <section className={styles.nutrientSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.bullet}>•</span>
          <p className={styles.sectionTitleText}>NPK Nutrients</p>
        </div>

        <div className={styles.sectionBody}>
          <NutrientItem label="Nitrogen" icon={N} value={`${n}`} color="blue" />
          <NutrientItem label="Phosphorus" icon={P} value={`${p}`} color="green" />
          <NutrientItem label="Potassium" icon={K} value={`${k}`} color="orange" />
        </div>

      </section >
      <section className={styles.propertiesSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.bullet}>•</span>
          <p className={styles.sectionTitleText}>Soil Properties</p>
        </div>
        <div className={styles.sectionBody}>
          <PropertyItem label="PH" icon={PH} value={`${ph}`} />
          <PropertyItem label="Soil texture" icon={soil} value={texture} />
        </div>


      </section>
    </div >
  )
}