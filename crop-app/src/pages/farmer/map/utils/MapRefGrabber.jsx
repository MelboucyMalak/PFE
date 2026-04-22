import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

export function MapRefGrabber({ setMap }) {
  const map = useMap()
  useEffect(() => { setMap(map) }, [map, setMap])
  return null
}