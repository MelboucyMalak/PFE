
import { useState } from "react"
import { GenericCardHeader, GenericCardFooter, GenericCardBodyHeader } from "./CardParts/CardParts" 
import { LocationPanel } from "./Panels/Location/LocationPanel"
import { SoilPanel } from "./Panels/Soil/SoilPanel"
 

import styles from "./GenericInfos.module.css"
import { ClimatePanel } from "./Panels/Climate/ClimatePanel"

export function GenericInfosCard({handleConfirmLocation}) {
 
  const [locationIsOn, setLocation] = useState(true)
  const [soilIsOn, setSoil] = useState(false)
  const [climateIsOn, setClimate] = useState(false)

  return (
    <div className={styles.genericInfosCard}
    >
      <GenericCardHeader />

      <div className={styles.cardBody}>
        <div className={styles.cardBck}>
        </div>
        <GenericCardBodyHeader locationIsOn={locationIsOn} soilIsOn={soilIsOn} climateIsOn={climateIsOn} setLocation={setLocation} setSoil={setSoil} setClimate={setClimate} />
 
        {locationIsOn && <LocationPanel/> }

        {soilIsOn && <SoilPanel/> }

        {climateIsOn && <ClimatePanel/>}
      </div>
      <GenericCardFooter handleConfirmLocation={handleConfirmLocation}/>
    </div>
  )
}