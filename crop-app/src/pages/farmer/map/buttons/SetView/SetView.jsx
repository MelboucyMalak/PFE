 
import styles from '../MapButtons.module.css'

export function SetView({ viewIsOn, setViewOn }) {
   
  return (
    <button className={styles.mapButton} 
      onClick={() => { 
        setViewOn(!viewIsOn)
      }}> 
      {viewIsOn ? 'Disable Set View' : 'Enable Set View'}
    </button>
  )
   
}