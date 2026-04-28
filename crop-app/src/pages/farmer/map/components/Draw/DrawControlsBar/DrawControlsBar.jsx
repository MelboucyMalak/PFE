import cancel from "@/assets/images/cancel.png"
import confirm from "@/assets/images/confirm.png"
import { enableMapInteractions, disableMapInteractions } from "../../../utils/MapOverlay";
import styles from "./DrawControlsBar.module.css"

export function DrawControlsBar({map, setViewOn,handleClearShape, handleConfirmShape }) {

   
  return (
    <div className={styles.drawControlsBar}
       onMouseEnter={() => disableMapInteractions(map, setViewOn)}
              onMouseLeave={() => enableMapInteractions(map, setViewOn)}>
      <button onClick={handleClearShape}
        className={styles.clearShapeBtn} >
        <p>Clear</p>
        <img src={cancel} alt="" />
      </button>
      <button onClick={handleConfirmShape}
        className={styles.confirmBtn}>
        <p>Confirm</p>
        <img src={confirm} alt="" />
      </button>


      {/* You can add other drawing-related buttons here later */}
    </div>
  );
}