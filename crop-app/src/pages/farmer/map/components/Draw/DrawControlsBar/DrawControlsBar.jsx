import cancelIcon from "../../ControlsBar/images/Cancel.png";
import shapeIcon from "../../ControlsBar/images/Shape.png";
import confirmIcon from "../../ControlsBar/images/Confirm.png";
import { enableMapInteractions, disableMapInteractions } from "../../../utils/MapOverlay";
import styles from "./DrawControlsBar.module.css";

export function DrawControlsBar({
  map,
  setViewOn,
  handleCancel,
  handleReset,
  handleConfirm,
  hasShape,
  isLoading
}) {
  return (
    <div
      className={styles.drawControlsBar}
      onMouseEnter={() => disableMapInteractions(map, setViewOn)}
      onMouseLeave={() => enableMapInteractions(map, setViewOn)}
    >
      <button 
        onClick={handleCancel} 
        className={styles.cancelBtn}
        disabled={isLoading}
      >
        <span>Cancel</span>
        <img src={cancelIcon} alt="Cancel" className={styles.icon} />
      </button>

      <button 
        onClick={handleReset} 
        className={`${styles.resetBtn} ${(!hasShape || isLoading) ? styles.disabled : ""}`}
        disabled={!hasShape || isLoading}
      >
        <span>Reset Shape</span>
        <img src={shapeIcon} alt="Reset Shape" className={styles.icon} />
      </button>

      <button 
        onClick={handleConfirm} 
        className={`${styles.confirmBtn} ${isLoading ? styles.loadingBtn : (!hasShape ? styles.disabled : "")}`}
        disabled={!hasShape || isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.loaderSpinner}></span>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span>Confirm</span>
            <img src={confirmIcon} alt="Confirm" className={styles.icon} />
          </>
        )}
      </button>
    </div>
  );
}