 import marker from "@/assets/images/soilWeatherRelated/marker.png" 
 import { changeWindow } from "../../../../utils/changeWindow"
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
  return(
    <div className={styles.bodyHeader}>
      <button className={`${styles.bodyHeaderBtn} ${locationIsOn ? styles.active : ""}`}
      onClick={()=>changeWindow(setLocation, setSoil, setClimate)}
      >Location</button>
      <button className={`${styles.bodyHeaderBtn} ${soilIsOn ? styles.active : ""}`} 
      onClick={()=>changeWindow( setSoil, setLocation,  setClimate )}>Soil</button>
      <button className={`${styles.bodyHeaderBtn} ${climateIsOn ? styles.active : ""}`}
      onClick={()=>changeWindow( setClimate,setLocation, setSoil )} >Climate</button>
    </div>
  )
}

export function GenericCardFooter({setGeneric, setCropsList}){ 
  return(
    <div className={styles.genericCardFooter}>
    <button className={styles.confLocationBtn}
    onClick={() => {
      setGeneric(false)
      setCropsList(true)
      }}
       >Confirm Location</button>
  </div>
  ) 
}