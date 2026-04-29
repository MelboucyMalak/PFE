import { useState } from "react"
import styles from "./Guide.module.css"

export function Guide(){ 
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
    <div className={styles.guideContainer}>
      <button className={styles.arrowBtn} onClick={handleLeftArrow}>
        <img src={`/guidePages/leftArrow.png`}  alt="left" />
      </button>
      <img className={styles.page} src={`/guidePages/${pageOn}.png`} alt="page" />
      <button className={styles.arrowBtn} onClick={handleRightArrow} >
        <img src={`/guidePages/rightArrow.png`}  alt="right" />
      </button>

    </div>
  )
}