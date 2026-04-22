 
import styles from './ExternalState.module.css'


export function ExternalState({ displayPosition }) { 

  return(
      <p className={styles.externalStateParagraph}>
      latitude: {Number(displayPosition.lat).toFixed(4) }, longitude: {Number(displayPosition.lng).toFixed(4)}{' '} 
    </p>
  )
}