import { ClimItem } from "./ClimItem/ClimItem"

import earth from "@/assets/images/cropsRelated/climateEarth.png"
import temp from "@/assets/images/cropsRelated/climateTemp.png"
import rain from "@/assets/images/cropsRelated/climateRain.png"
import humidity from "@/assets/images/cropsRelated/climateHumidity.png"
import ratingIcon from "@/assets/images/cropsRelated/climateRating.png"
import styles from "./ClimatePanel.module.css"
import { determineRankName } from "../../../../../utils/determineRankName.js"

export function ClimatePanel({ climContext }) {
  const climTemp = climContext.temp
  const climRain = climContext.rain
  const climHumidity = climContext.humidity
  const climKoppen = climContext.koppen
  const climRank = determineRankName(climContext.rank)


  return (
    <div className={styles.climPanel}>
      <div className={styles.climItems}>
        <div className={styles.climItemsLine}>
          <ClimItem icon={temp} label={"Temperature Range:"} value={climTemp} />
          <ClimItem icon={rain} label={"Rainfall range:"} value={climRain} />
        </div>
        <div className={styles.climItemsLine}>
          <ClimItem icon={humidity} label={"Humidity range:"} value={climHumidity} />
          <ClimItem icon={earth} label={"Detected climate:"} value={climKoppen} />
        </div>

      </div>
      <div className={styles.koppenRating}>
        <div className={styles.title}>
          <img src={ratingIcon} alt="" />
          <p className={styles.titleText}>
            Suitability for this climate:
          </p>
        </div>
        <p className={styles.rank}>
          Rank {5 - climContext.rank +
            1} — {climRank}
        </p>
      </div>
    </div>
  )
}