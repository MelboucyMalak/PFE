
import styles from ".CropCard.module.css"
import { useState } from "react"

export function CropCard({ cropContext }) {
  const [generalOn, setGeneral] = useState(true)
  const [soilOn, setSoil] = useState(false)
  const [climateOn, setClimate] = useState(false)
  const [fertilizationOn, setFertilization] = useState(false)
  return (
    <div className={styles.cropCard}>
      <CropCardHeader/>
      <CropCardBodyHeader
        generalOn={generalOn}
        soilOn={soilOn}
        climateOn={climateOn}
        fertilizationOn={fertilizationOn}
        setGeneral={setGeneral}
        setSoil={setSoil}
        setClimate={setClimate}
        setFertilization={setFertilization}
        />
      { generalOn && <GeneralPanle /> }
        { soilOn && <SoilPanel /> }
        { climateOn && <ClimatePanel /> }
        { fertilizationOn && <FertilizationPanel /> }

        <button className={styles.personalizeBtn}>Personalize Recommendation</button>
    </div>
  )
}