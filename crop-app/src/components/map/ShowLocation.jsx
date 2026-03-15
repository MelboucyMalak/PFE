
 
import { useMap } from 'react-leaflet'
import './ShowLocation.css'
export function ShowLocation({ setPosition }) { 
  const map = useMap()

  function handleLocate() {
     map.locate()
      map.on('locationfound', (e) => {
        setPosition(e.latlng)
        console.log('Location found:', e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      })
  }
 

  return (
    <button className='locate-button'
      onClick={handleLocate}>Locate me</button>
  )
}