import { useRef } from "react"
import { GeocoderControl } from "./Controls/GeocoderControl"
import { ShowLocation } from "./Controls/ShowLocation/ShowLocation"
import { SetView } from "./Controls/SetView/SetView"
import endCross from "@/assets/images/cross.png"
import { enableMapInteractions, disableMapInteractions } from "../../utils/MapOverlay"
import styles from "./ControlsBar.module.css"

export function ControlsBar({ map, setPosition, viewIsOn, setViewOn }) {
  const barRef = useRef(null)

  return (
    <div  className={styles.mapBar}
      onMouseEnter={() => disableMapInteractions(map, setViewOn)}
        onMouseLeave={() => enableMapInteractions(map, setViewOn)}>
      <button className={styles.endSessionBtn}>
        <img src={endCross} alt="x" />
      </button>
      <div ref={barRef} className={styles.controlsBar}>
        <GeocoderControl map={map} barRef={barRef} />
        <ShowLocation setPosition={setPosition} map={map} />
        <SetView viewIsOn={viewIsOn} setViewOn={setViewOn} /> 
      </div>
    </div>
  )
}