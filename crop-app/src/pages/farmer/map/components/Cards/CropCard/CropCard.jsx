import { CropCardHeader } from "./CardParts/CardParts"
import { CropCardBodyHeader } from "./CardParts/CardParts"
import { GeneralPanel } from "./Panels/General/GeneralPanel"
import { SoilPanel } from "./Panels/Soil/SoilPanel"
import { ClimatePanel } from "./Panels/Climate/ClimatePanel"
import { FertPanel } from "./Panels/Fert/FertPanel"
import styles from "./CropCard.module.css"
import { useState } from "react"

export function CropCard({ cropContext, soilContext, climContext, fertContext, handlePersonalizeReco, onClose, genericHistory = [], personalizedHistory = [], onViewPersonalizedClick, hasPersonalized = false, loadingPersonalized = false }) {
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
        {activeTab === 'fertilization' && (
          <FertPanel 
            fertContext={fertContext} 
            genericHistory={genericHistory} 
            personalizedHistory={personalizedHistory} 
          />
        )}
        {handlePersonalizeReco && (
          <button className={styles.personalizeBtn}
            onClick={handlePersonalizeReco}>Personalize Recommendation
          </button>
        )}
        {onViewPersonalizedClick && (
          <button 
            className={`${styles.personalizeBtn} ${(loadingPersonalized || !hasPersonalized) ? styles.disabledBtn : ""}`}
            onClick={(!loadingPersonalized && hasPersonalized) ? onViewPersonalizedClick : undefined}
            disabled={loadingPersonalized || !hasPersonalized}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            {loadingPersonalized ? (
              <>
                <span className={styles.loaderSpinner}></span>
                Loading Personalization...
              </>
            ) : "View Personalized Fertilization"}
          </button>
        )}
      </div>

    </div>
  )
}