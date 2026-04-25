import locate from "../../images/locate.png"
import styles from '../MapButtons.module.css'

export function ShowLocation({ setPosition, map }) {

  function handleLocate() {
    if (!map) return
    map.locate()
    map.on('locationfound', (e) => {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 18)
    })
  }
 
  return (
    <button className={`${styles.mapButton} ${styles.locateBtn}`}
      onClick={handleLocate}>
      <p className={styles.btnText}>Locate me</p>
      <img src={locate} alt="" />
    </button>
  )
}