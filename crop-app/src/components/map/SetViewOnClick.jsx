import { useMapEvent } from 'react-leaflet'

export function SetViewOnClick({ setPosition, ignoreMapClickRef }) {
  const map = useMapEvent('click', (e) => {
     if (ignoreMapClickRef.current) return;
    setPosition(e.latlng)
    map.setView(e.latlng, map.getZoom(), )
  })

  return null
}