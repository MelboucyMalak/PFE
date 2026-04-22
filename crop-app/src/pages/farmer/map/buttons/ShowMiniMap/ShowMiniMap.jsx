
import styles from'../MapButtons.module.css'

export function ShowMiniMap({  miniMapIsVisible, setMiniMapVisible }) {

  return (
    <button 
    className={styles.mapButton} 
      onClick={( ) => { 
        setMiniMapVisible(!miniMapIsVisible); 
      }}>
      {miniMapIsVisible ? 'Hide Mini Map' : 'Show Mini Map'}
    </button>
  )
}