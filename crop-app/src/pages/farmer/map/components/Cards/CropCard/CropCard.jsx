import { CropCardHeader } from "./CardParts/CardParts"
import { CropCardBodyHeader } from "./CardParts/CardParts"
import { GeneralPanel } from "./Panels/General/GeneralPanel"
import { SoilPanel } from "./Panels/Soil/SoilPanel"
import { ClimatePanel } from "./Panels/Climate/ClimatePanel"
import { FertPanel } from "./Panels/Fert/FertPanel"
import styles from "./CropCard.module.css"
import { useState } from "react"

export function CropCard({ cropContext, soilContext, climContext, fertContext, handlePersonalizeReco, onClose }) {
  const [activeTab, setActiveTab] = useState('general')
  return (
    <div className={styles.cropCard}>
      <CropCardHeader cropContext={cropContext} onClose={onClose} />


      <div className={styles.cardBody}>
        <div className={styles.cardBck}> </div>

        <CropCardBodyHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab} />
        {activeTab === 'general' && <GeneralPanel cropContext={cropContext} />}
        {activeTab === 'soil' && <SoilPanel soilContext={soilContext} cropContext={cropContext} />}
        {activeTab === 'climate' && <ClimatePanel climContext={climContext} cropContext={cropContext} />}
        {activeTab === 'fertilization' && <FertPanel fertContext={fertContext} />}
        <button className={styles.personalizeBtn}
          onClick={handlePersonalizeReco}>Personalize Recommendation
        </button>
      </div>

    </div>
  )
}