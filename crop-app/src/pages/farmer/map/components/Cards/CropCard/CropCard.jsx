import { CropCardHeader } from "./CardParts/CardParts"
import { CropCardBodyHeader } from "./CardParts/CardParts"
import { GeneralPanel } from "./Panels/General/GeneralPanel"
import { SoilPanel } from "./Panels/Soil/SoilPanel"
import { ClimatePanel } from "./Panels/Climate/ClimatePanel"
import { FertPanel } from "./Panels/Fert/FertPanel"
import styles from "./CropCard.module.css"
import { useState } from "react"

export function CropCard({ cropContext, soilContext, climContext, fertContext, handlePersonalizeReco }) {
  const [generalOn, setGeneral] = useState(true)
  const [cropSoilOn, setCropSoil] = useState(false)
  const [cropClimateOn, setCropClimate] = useState(false)
  const [fertilizationOn, setFertilization] = useState(false)
  return (
    <div className={styles.cropCard}>
      <CropCardHeader cropContext={cropContext} />


      <div className={styles.cardBody}>
        <div className={styles.cardBck}> </div>

        <CropCardBodyHeader
          generalOn={generalOn}
          cropSoilOn={cropSoilOn}
          cropClimateOn={cropClimateOn}
          fertilizationOn={fertilizationOn}
          setGeneral={setGeneral}
          setCropSoil={setCropSoil}
          setCropClimate={setCropClimate}
          setFertilization={setFertilization} />
        {generalOn && <GeneralPanel cropContext={cropContext} />}
        {cropSoilOn && <SoilPanel soilContext={soilContext} />}
        {cropClimateOn && <ClimatePanel climContext={climContext} />}
        {fertilizationOn && <FertPanel fertContext={fertContext} />}
        <button className={styles.personalizeBtn}
          onClick={handlePersonalizeReco}>Personalize Recommendation
        </button>
      </div>

    </div>
  )
}