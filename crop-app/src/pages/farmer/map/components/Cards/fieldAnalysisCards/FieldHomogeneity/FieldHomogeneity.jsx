import {FertCardHeader, FieldHomoFooter} from "../FertCardParts/FertCardParts"
import { Homogeneity } from "./Homogeneity/Homogeneity"
import { DetectedTextures } from "./DetectedTextures/DetectedTextures"
import cuts from "@/assets/images/fieldRelated/cuts.png"
import styles from "./FieldHomogeneity.module.css"

export function FieldHomogeneity({texturesContext, handlePersonalizeFert, onClose}){
  const winner = texturesContext.winner
  const name = texturesContext.name
  const textures = Object.entries(texturesContext.textures).map(([key, value]) => ({
    name: key,            
    coverage: value.coverage,
    score: value.score
  })); 
  const nbr = texturesContext.nbr
  return(
    <div className={styles.fieldHomogeneity}>
      <FertCardHeader name={name} onClose={onClose} />
      <div className={styles.cardBody}>
        <div className={styles.cardBck}></div>
        <Homogeneity winner={winner}/>
        <DetectedTextures textures={textures} nbr={nbr}/> 
        <div className={styles.plotCuts}>
          <div className={styles.imgContainer}><img src={cuts} alt="" /></div>
          <p>
            Split your soil into {nbr} different zones
          </p>
        </div>
      </div>
      <FieldHomoFooter handlePersonalizeFert={handlePersonalizeFert} /> 
    </div>
  )
}