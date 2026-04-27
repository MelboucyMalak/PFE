 import marker from "@/assets/images/soilWeatherRelated/marker.png"  
import styles from "./CardParts.module.css" 

export function GenericCardHeader(){ 
  return(
    <div className={
      styles.genericCardHeader
    }>
      <div className={styles.cardMeta}>
        <img src={marker} alt="" />
        <div className={styles.region}> 
          <p className={styles.regionName}>Sétif Region</p>
          <p className={styles.coord}>Lat:36.1°N, Long:5.4°E </p>
        </div>
        
      </div> 
    </div>
  )
}

export function GenericCardBodyHeader({locationIsOn, soilIsOn, climateIsOn, setLocation, setSoil, setClimate}){

  const panels = { location: setLocation, soil: setSoil, climate: setClimate }

  function switchPanel(active) {
    Object.entries(panels).forEach(([key, set]) => set(key === active))
  }

  return(
    <div className={styles.bodyHeader}>
      <button className={`${styles.bodyHeaderBtn} ${locationIsOn ? styles.active : ""}`}
        onClick={() => switchPanel('location')}>Location</button>
      <button className={`${styles.bodyHeaderBtn} ${soilIsOn ? styles.active : ""}`}
        onClick={() => switchPanel('soil')}>Soil</button>
      <button className={`${styles.bodyHeaderBtn} ${climateIsOn ? styles.active : ""}`}
        onClick={() => switchPanel('climate')}>Climate</button>
    </div>
  )
}

export function GenericCardFooter({handleConfirmLocation}){ 
  return(
    <div className={styles.genericCardFooter}>
    <button className={styles.confLocationBtn}
    onClick={handleConfirmLocation}
       >Confirm Location</button>
  </div>
  ) 
}