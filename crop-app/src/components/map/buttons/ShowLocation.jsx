import { useMap } from 'react-leaflet'
import styles from './ShowLocation.module.css'
import { blockMapEvents } from '../utils/blockMapEvents'
export function ShowLocation({ setPosition, ignoreMapClickRef }) { 
  const map = useMap()

  function handleLocate() {
     map.locate()
      map.on('locationfound', (e) => {
        setPosition(e.latlng)
        console.log('Location found:', e.latlng)
        map.flyTo(e.latlng, 18)
        
      })
  }
 

  return (
    <button className={styles.locateButton}
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
        blockMapEvents(e, ignoreMapClickRef)
        ignoreMapClickRef.current = false
        handleLocate() 
      }}>
      Locate me
    </button>
  )
}