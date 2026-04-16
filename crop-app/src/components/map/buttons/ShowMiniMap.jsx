import { blockMapEvents } from '../utils/blockMapEvents';
import styles from'./ShowMiniMap.module.css'

export function ShowMiniMap({ ignoreMapClickRef, miniMapIsVisible, setMiniMapVisible }) {

  return (
    <button 
    className={styles.miniMapButton}
    onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
        blockMapEvents(e, ignoreMapClickRef); 
        setMiniMapVisible(!miniMapIsVisible);
        ignoreMapClickRef.current = false
      }}>
      {miniMapIsVisible ? 'Hide Mini Map' : 'Show Mini Map'}
    </button>
  )
}