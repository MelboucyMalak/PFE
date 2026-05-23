import { ClimItem } from "./ClimItem/ClimItem"

import earth from "@/assets/images/cropsRelated/climateEarth.png"
import temp from "@/assets/images/cropsRelated/climateTemp.png"
import rain from "@/assets/images/cropsRelated/climateRain.png"
import humidity from "@/assets/images/cropsRelated/climateHumidity.png"
import ratingIcon from "@/assets/images/cropsRelated/climateRating.png"
import styles from "./ClimatePanel.module.css"
import { determineRankName } from "../../../../../utils/determineRankName.js"

export function ClimatePanel({ climContext, cropContext }) {
  const crop = cropContext?.rawItem?.crop || {};

  const translateKoppen = (code) => {
    if (!code) return "N/A";
    const clean = code.trim();
    const dict = {
      "Csa": "Hot-summer Mediterranean",
      "Bsh": "Hot semi-arid climate",
      "BSh": "Hot semi-arid climate",
      "Bsk": "Cold semi-arid climate",
      "BSk": "Cold semi-arid climate",
      "Bwh": "Hot desert climate",
      "BWh": "Hot desert climate"
    };
    return dict[clean] || dict[clean.toUpperCase()] || dict[clean.toLowerCase()] || clean;
  };

  const tMin = crop.temp_min !== undefined ? crop.temp_min : "N/A";
  const tMax = crop.temp_max !== undefined ? crop.temp_max : "N/A";
  const climTemp = (tMin !== "N/A" && tMax !== "N/A") ? `${tMin} - ${tMax} °C` : "N/A";

  const rMin = crop.water_min_mm !== undefined ? crop.water_min_mm : "N/A";
  const rMax = crop.water_max_mm !== undefined ? crop.water_max_mm : "N/A";
  const climRain = (rMin !== "N/A" && rMax !== "N/A") ? `${rMin} - ${rMax} mm` : "N/A";

  const hMin = crop.humidity_min !== undefined ? crop.humidity_min : "N/A";
  const hMax = crop.humidity_max !== undefined ? crop.humidity_max : "N/A";
  const climHumidity = (hMin !== "N/A" && hMax !== "N/A") ? `${hMin} - ${hMax}%` : "N/A";

  const rawKoppen = climContext?.koppen || "Csa";
  const climKoppen = translateKoppen(rawKoppen);

  const climateList = crop.crop_climates || [];
  const foundClimate = climateList.find(
    c => c.climate?.toLowerCase() === rawKoppen.toLowerCase()
  );
  const climateSuitabilityRank = foundClimate ? Number(foundClimate.rating) : 1;
  const climRank = determineRankName(climateSuitabilityRank);


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
          Rank {5 - climateSuitabilityRank +
            1} — {climRank}
        </p>
      </div>
    </div>
  )
}