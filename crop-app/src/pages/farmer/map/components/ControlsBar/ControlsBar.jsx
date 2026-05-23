import { useRef } from "react"
import { GeocoderControl } from "./Controls/GeocoderControl"
import { ShowLocation } from "./Controls/ShowLocation/ShowLocation"
import { SetView } from "./Controls/SetView/SetView"
import endCross from "@/assets/images/cross.png"
import whiteCross from "./images/Exit-map-hover.png"
import { enableMapInteractions, disableMapInteractions } from "../../utils/MapOverlay"
import styles from "./ControlsBar.module.css"

export function ControlsBar({ map, setPosition, setDisplayPosition, viewIsOn, setViewOn, onExitClick }) {
  const barRef = useRef(null)

  return (
    <div  className={styles.mapBar}
      onMouseEnter={() => disableMapInteractions(map, setViewOn)}
        onMouseLeave={() => enableMapInteractions(map, setViewOn)}>
      <button className={styles.endSessionBtn} onClick={onExitClick}>
        <img className={styles.defaultCross} src={endCross} alt="x" />
        <img className={styles.hoverCross} src={whiteCross} alt="x" />
      </button>
      <div ref={barRef} className={styles.controlsBar}>
        <GeocoderControl map={map} barRef={barRef} setPosition={setPosition} setDisplayPosition={setDisplayPosition} />
        <ShowLocation setPosition={setPosition} map={map} />
        <SetView viewIsOn={viewIsOn} setViewOn={setViewOn} /> 
      </div>
    </div>
  )
}