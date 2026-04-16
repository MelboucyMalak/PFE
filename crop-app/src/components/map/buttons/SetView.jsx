import { blockMapEvents } from '../utils/blockMapEvents'; 
import styles from './SetView.module.css'

export function SetView({ ignoreMapClickRef, viewIsOn, setViewOn }) {
   
  return (
    <button className={styles.setViewButton}
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
       blockMapEvents(e, ignoreMapClickRef) 
       ignoreMapClickRef.current = false
        setViewOn(!viewIsOn)
      }}> 
      {viewIsOn ? 'Disable Set View' : 'Enable Set View'}
    </button>
  )
   
}