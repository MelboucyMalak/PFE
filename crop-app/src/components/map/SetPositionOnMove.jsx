import { useMapEvent } from 'react-leaflet'

export function SetPositionOnMove({ setDisplayPosition }) {
  useMapEvent('move', (e) => {
    setDisplayPosition(e.target.getCenter())
  })

  return null
}
 