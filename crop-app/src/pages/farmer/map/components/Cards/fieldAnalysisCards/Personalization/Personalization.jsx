import { useState } from "react"
import { FertCardHeader, PersonalizationFooter } from "../FertCardParts/FertCardParts"
import shapes from "@/assets/images/fieldRelated/shapes.png"
import nbrFound from "@/assets/images/fieldRelated/nbrFound.png"
import depthIcon from "@/assets/images/fieldRelated/depth.png"
import chemical from "@/assets/images/fieldRelated/chemical.png"
import styles from "./Personalization.module.css"

export function Personalization({ samplingContext, handleConfirmData, onClose }) {
  const [nitrogen, setNitrogen] = useState("")
  const [phosphorus, setPhosphorus] = useState("")
  const [potassium, setPotassium] = useState("")
  const [ph, setPh] = useState("")

  const nbr = samplingContext.nbr
  const displayNbr = nbr > 1 ? `${nbr} zones` : `${nbr} zone`
  const name = samplingContext.name
  const pattern = samplingContext.pattern
  const depth = samplingContext.depth

  const onSubmit = () => {
    handleConfirmData({
      n: nitrogen !== "" ? Number(nitrogen) : 50,
      p: phosphorus !== "" ? Number(phosphorus) : 50,
      k: potassium !== "" ? Number(potassium) : 50,
      ph: ph !== "" ? Number(ph) : 6.5
    });
  };

  return (
    <div className={styles.personalization}>
      <FertCardHeader name={name} onClose={onClose} />
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
            <div className={styles.bodyTitle}>
              <img src={nbrFound} alt="" /> 
              <p className={styles.labelText}>Zones : </p>
            </div>
              <p className={styles.itemValue}>{displayNbr}</p> 
          </div>
          <div className={styles.item}>
            <div className={styles.bodyTitle}>
              <img src={depthIcon} alt="" />
              <p className={styles.labelText}>Sampling depth : </p> 
            </div>
            <p className={styles.itemValue}>{depth} m</p>
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

        <form className={styles.nutrientsForm} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className={`${styles.nutrientItem} ${styles.itemGreen}`}>
            <p>Phosphorus P:</p>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                name="phosphorus" 
                placeholder="ppm" 
                value={phosphorus} 
                onChange={(e) => setPhosphorus(e.target.value)} 
              /> 
            </div>
          </div>
  
          <div className={`${styles.nutrientItem} ${styles.itemBlue}`}>
            <p>Nitrogen N:</p>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                name="nitrogen" 
                placeholder="ppm" 
                value={nitrogen} 
                onChange={(e) => setNitrogen(e.target.value)} 
              /> 
            </div>
          </div>
  
          <div className={`${styles.nutrientItem} ${styles.itemOrange}`}>
            <p>Potassium K:</p>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                name="potassium" 
                placeholder="ppm" 
                value={potassium} 
                onChange={(e) => setPotassium(e.target.value)} 
              /> 
            </div>
          </div>
  
          <div className={`${styles.nutrientItem} ${styles.itemRed}`}>
            <p>Soil pH :</p>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                name="ph" 
                step="0.1" 
                min="0" 
                max="14" 
                placeholder="4.0 - 10" 
                value={ph} 
                onChange={(e) => setPh(e.target.value)} 
              />
            </div>
          </div>

        </form>
      </div>
      <PersonalizationFooter handleConfirmData={onSubmit} />
    </div>
  )
}