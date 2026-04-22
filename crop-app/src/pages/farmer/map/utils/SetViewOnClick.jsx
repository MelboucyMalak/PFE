import { useMapEvent } from 'react-leaflet'

export function SetViewOnClick({ setPosition }) {
  const map = useMapEvent('click', (e) => { 
    setPosition(e.latlng) 
    map.setView(e.latlng, map.getZoom(), )
  })

  return null
}