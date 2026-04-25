 
import styles from './ExternalState.module.css'


export function ExternalState({ displayPosition }) { 

  return(
      <p className={styles.externalStateParagraph}>
      lat: {Number(displayPosition.lat).toFixed(4) }, long: {Number(displayPosition.lng).toFixed(4)}{' '} 
    </p>
  )
}