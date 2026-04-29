import starter from "@/assets/images/guideRelated/starter.png"
import styles from "./Starter.module.css"

export function Starter({handleShowGuide, handleQuitStarter}){
  return (
    <div className={styles.starter}>
      <img src={starter} alt="" />
      <div className={styles.starterControls}>
        <button className={styles.startBtn}
        onClick={handleQuitStarter}>
          Get Started
        </button>
        <button className={styles.showGuideBtn}
        onClick={handleShowGuide}>How it works</button>
      </div>
    </div>
  )
}