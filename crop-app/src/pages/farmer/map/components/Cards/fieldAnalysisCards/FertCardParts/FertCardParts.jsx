import fertIcon from "@/assets/images/fertIcon.png"
import styles from "./FertCardParts.module.css"

export function FertCardHeader({ name, onClose }){
  return(
    <div className={styles.fertCardHeader}>
      <img src={fertIcon} alt="" />
      <p>{name}'s Field Analysis</p> 
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} title="Exit Field Analysis">
          <img className={styles.defaultExit} src="/guidePages/Exit-button.png" alt="close" />
          <img className={styles.hoverExit} src="/guidePages/Exit-button-hover.png" alt="close hover" />
        </button>
      )}
    </div>
  )
}

export function FieldHomoFooter({handlePersonalizeFert}){
  return(
    <div className={styles.fertCardFooter}>
      <button className={styles.personalizeBtn}
        onClick={handlePersonalizeFert}>
        Personalize Fertilization
      </button>
    </div>
  )
}

export function PersonalizationFooter({handleConfirmData, isLoading}){
  return(
    <div className={styles.fertCardFooter}>
      <button 
        className={`${styles.confirmInputsBtn} ${isLoading ? styles.loadingBtn : ""}`}
        onClick={isLoading ? undefined : handleConfirmData}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.loaderSpinner}></span>
            <span>Calculating...</span>
          </>
        ) : (
          "Confirm Data"
        )}
      </button>
    </div>
  )
}