import starter from "@/assets/images/guideRelated/starter.png"
import styles from "./Starter.module.css"

export function Starter({handleShowGuide, handleQuitStarter}){
  return (
    <div className={styles.starter}
         onClick={(e) => e.stopPropagation()}
         onMouseDown={(e) => e.stopPropagation()}
         onMouseUp={(e) => e.stopPropagation()}
         onDoubleClick={(e) => e.stopPropagation()}
    >
      <img src={starter} alt="" />
      <div className={styles.starterControls}>
        <button className={styles.startBtn}
        onClick={(e) => { e.stopPropagation(); handleQuitStarter(); }}>
          Get Started
        </button>
        <button className={styles.showGuideBtn}
        onClick={(e) => { e.stopPropagation(); handleShowGuide(); }}>How it works</button>
      </div>
    </div>
  )
}