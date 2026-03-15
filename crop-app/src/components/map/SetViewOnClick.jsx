import { useMapEvent } from 'react-leaflet'

export function SetViewOnClick({ setPosition, ignoreMapClick }) {
  const map = useMapEvent('click', (e) => {
     if (ignoreMapClick) return;
    setPosition(e.latlng)
    map.setView(e.latlng, map.getZoom(), )
  })

  return null
}