
import { useState } from "react"
import { GenericCardHeader, GenericCardFooter, GenericCardBodyHeader } from "./CardParts/CardParts" 
import { LocationPanel } from "./Panels/Location/LocationPanel"
import { SoilPanel } from "./Panels/Soil/SoilPanel"
 

import styles from "./GenericInfos.module.css"
import { ClimatePanel } from "./Panels/Climate/ClimatePanel"

export function GenericInfosCard({handleConfirmLocation, closeCard, position, placeName, liveWeather, sessionInfo, soilContext, climContext}) {
 
  const [locationIsOn, setLocation] = useState(true)
  const [soilIsOn, setSoil] = useState(false)
  const [climateIsOn, setClimate] = useState(false)

  return (
    <div className={styles.genericInfosCard}
    >
      <GenericCardHeader closeCard={closeCard} />

      <div className={styles.cardBody}>
        <div className={styles.cardBck}>
        </div>
        <GenericCardBodyHeader locationIsOn={locationIsOn} soilIsOn={soilIsOn} climateIsOn={climateIsOn} setLocation={setLocation} setSoil={setSoil} setClimate={setClimate} />
 
        {locationIsOn && <LocationPanel position={position} placeName={placeName} sessionInfo={sessionInfo} /> }

        {soilIsOn && <SoilPanel soilContext={soilContext} /> }

        {climateIsOn && <ClimatePanel placeName={placeName} liveWeather={liveWeather} climContext={climContext} />}
      </div>
      <GenericCardFooter handleConfirmLocation={handleConfirmLocation}/>
    </div>
  )
}