import { useState } from "react"
import styles from "./Guide.module.css"

export function Guide({ handleQuitGuide }){ 
  const [pageOn, setPage] = useState(1)

  function handleLeftArrow(){
    if (pageOn > 1){
      setPage(pageOn - 1)
    }
      else setPage(12)
  }

  function handleRightArrow(){
    if (pageOn < 12){
      setPage(pageOn + 1)
    }
      else setPage(1)
  }
  
  return (
    <div className={styles.guideContainer}
         onClick={(e) => e.stopPropagation()}
         onMouseDown={(e) => e.stopPropagation()}
         onMouseUp={(e) => e.stopPropagation()}
         onDoubleClick={(e) => e.stopPropagation()}
    >
      <button className={styles.arrowBtn} onClick={(e) => { e.stopPropagation(); handleLeftArrow(); }}>
        <img src={`/guidePages/leftArrow.png`}  alt="left" />
      </button>
      <img className={styles.page} src={`/guidePages/${pageOn}.png`} alt="page" />
      
      <div className={styles.rightControlWrapper}>
        <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); handleQuitGuide(); }} title="Close Guide">
          <img className={styles.defaultExit} src="/guidePages/Exit-button.png" alt="exit" />
          <img className={styles.hoverExit} src="/guidePages/Exit-button-hover.png" alt="exit hover" />
        </button>
        <button className={styles.arrowBtn} onClick={(e) => { e.stopPropagation(); handleRightArrow(); }} >
          <img src={`/guidePages/rightArrow.png`}  alt="right" />
        </button>
      </div>
    </div>
  )
}