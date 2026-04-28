import cross from "@/assets/images/cardCross.png"
import fertIcon from "@/assets/images/fertIcon.png"
import styles from "./FertCardParts.module.css"

export function FertCardHeader({ name}){
  return(
    <div className={styles.fertCardHeader}>
      <img src={fertIcon} alt="" />
      <p>{name}'s Field Analysis</p>
      <button className={styles.closeBtn}>
        <img src={cross} alt="" />
      </button>
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

export function PersonalizationFooter(){
  return(
    <div className={styles.fertCardFooter}>
      <button className={styles.confirmInputsBtn}>
        Confirm Data
      </button>
    </div>
  )
}