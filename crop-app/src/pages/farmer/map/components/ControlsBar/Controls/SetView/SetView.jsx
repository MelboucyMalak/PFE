 
import styles from '../MapButtons.module.css'
import marker from '../../images/marker.png'

export function SetView({ viewIsOn, setViewOn }) {
   
  return (
    <button className={`${styles.mapButton} ${styles.setViewBtn}`}
      onClick={() => { 
        setViewOn(!viewIsOn)
      }}> 
      <p className={styles.btnText} >{viewIsOn ? 'Pinpoint manually ON' : 'Pinpoint manually OFF'}</p>
      <img src={marker} alt="" />
    </button>
  )
   
}