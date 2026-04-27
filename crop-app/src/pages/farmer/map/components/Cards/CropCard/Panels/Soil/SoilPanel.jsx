import { SoilItem } from "./SoilItem/SoilItem"
 
import PH from "@/assets/images/cropsRelated/soilPH.png"
import depth from "@/assets/images/cropsRelated/soilDepth.png"
import shape from "@/assets/images/cropsRelated/soilShape.png"
import texture from "@/assets/images/cropsRelated/soilTexture.png"
import trophy from "@/assets/images/cropsRelated/trophy.png"
import styles from "./SoilPanel.module.css"
import {determineRankName} from "../../../../../utils/determineRankName.js"

export function SoilPanel({soilContext}){
  const soilTexture = soilContext.texture
  const soilDepth = soilContext.depth
  const soilShape = soilContext.shape
  const soilPH = soilContext.PH
  const soilRank =determineRankName(soilContext.rank)


   return(
    <div className={styles.soilPanel}>
      <div className={styles.soilItems}>
        <div className={styles.soilItemsLine}> 
          <SoilItem icon={PH} label={"PH-Range:"} value={soilPH}/> 
          <SoilItem icon={depth} label={"Sampling depth"} value={soilDepth}/> 
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
            Rank {5 - soilContext.rank + 
            1} — {soilRank}
          </p>
      </div>
    </div>
   ) 
}