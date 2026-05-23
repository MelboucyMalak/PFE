import { SoilItem } from "./SoilItem/SoilItem"
 
import PH from "@/assets/images/cropsRelated/soilPH.png"
import depth from "@/assets/images/cropsRelated/soilDepth.png"
import shape from "@/assets/images/cropsRelated/soilShape.png"
import texture from "@/assets/images/cropsRelated/soilTexture.png"
import trophy from "@/assets/images/cropsRelated/trophy.png"
import styles from "./SoilPanel.module.css"
import {determineRankName} from "../../../../../utils/determineRankName.js"

export function SoilPanel({ soilContext, cropContext }) {
  const crop = cropContext?.rawItem?.crop || {};
  
  const phMin = crop.ph_min !== undefined ? crop.ph_min : "N/A";
  const phMax = crop.ph_max !== undefined ? crop.ph_max : "N/A";
  const soilPH = (phMin !== "N/A" && phMax !== "N/A") ? `${phMin} - ${phMax}` : (phMin || phMax || "N/A");
  
  const soilDepth = crop.sampling_depth_cm !== undefined ? crop.sampling_depth_cm : (soilContext?.depth || "N/A");
  const soilShape = crop.sampling_shape || soilContext?.shape || "zigzag";
  const soilTexture = soilContext?.texture || "Sandy loam";
  
  const textureList = crop.crop_soil_textures || [];
  const foundTexture = textureList.find(
    t => t.texture_name?.toLowerCase() === soilTexture.toLowerCase()
  );
  const suitabilityRank = foundTexture ? Number(foundTexture.suitability_rank) : 1;
  const soilRank = determineRankName(suitabilityRank);

   return(
    <div className={styles.soilPanel}>
      <div className={styles.soilItems}>
        <div className={styles.soilItemsLine}> 
          <SoilItem icon={PH} label={"PH-Range:"} value={soilPH}/> 
          <SoilItem icon={depth} label={"Sampling depth"} value={`${soilDepth} cm`}/> 
        </div>
        <div className={styles.soilItemsLine}> 
          <SoilItem icon={shape} label={"Sampling shape"} value={soilShape}/> 
          <SoilItem icon={texture} label={"Detected Texture"} value={soilTexture}/> 
        </div>
        
      </div>
      <div className={styles.textureRating}>
        <div className={styles.title}>
          <img src={trophy} alt="" />
          <p className={styles.titleText}>
            Suitability for this texture:
          </p> 
        </div>
         <p className={styles.rank}>
            Rank {5 - suitabilityRank + 1} — {soilRank}
          </p>
      </div>
    </div>
   ) 
}