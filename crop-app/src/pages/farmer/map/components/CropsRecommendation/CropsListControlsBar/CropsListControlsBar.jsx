import { useState, useEffect } from "react"
import styles from "./CropsListControlsBar.module.css"
import favoriteStar from "../../ControlsBar/images/Favorite-star.png"
import markerIcon from "../../ControlsBar/images/marker.png"

export function CropsListControlsBar({ onChangeLocation, isSessionFavorited, onFavoriteSession }) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    if (isSessionFavorited) {
      setToastMessage("Session added to favorites!")
      setShowToast(true)
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 2500)
      return () => clearTimeout(timer)
    } else {
      setShowToast(false)
    }
  }, [isSessionFavorited])

  return (
    <>
      {showToast && (
        <div className={styles.toastContainer}>
          {toastMessage}
        </div>
      )}
      <div className={styles.controlsBarContainer}>
        <button className={styles.changeLocationBtn} onClick={onChangeLocation}>
          <span>Change location</span>
          <img src={markerIcon} alt="location" className={styles.icon} />
        </button>
        <button 
          className={`${styles.favoriteBtn} ${isSessionFavorited ? styles.favorited : ""}`}
          onClick={onFavoriteSession}
        >
          <span>{isSessionFavorited ? "Session Favorited" : "Favorite Session"}</span>
          <img 
            src={favoriteStar} 
            alt="star" 
            className={`${styles.icon} ${isSessionFavorited ? styles.starGolden : ""}`} 
          />
        </button>
      </div>
    </>
  )
}
