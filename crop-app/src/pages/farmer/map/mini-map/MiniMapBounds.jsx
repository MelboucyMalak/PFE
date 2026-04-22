import { useState, useEffect } from 'react'
import { useMap, Rectangle } from 'react-leaflet'

export function MiniMapBounds({ parentMap, zoomOffset }) {
  const minimap = useMap()
  const [bounds, setBounds] = useState(parentMap.getBounds())

  useEffect(() => {
    const onChange = () => { 
      setBounds(parentMap.getBounds()) 
      const targetZoom = parentMap.getZoom() + zoomOffset;
      minimap.setView(parentMap.getCenter(), targetZoom)
    }

    // Listen to move
    parentMap.on('move zoom', onChange)

    // Cleanup
    return () => {
      parentMap.off('move zoom', onChange)
    }
  }, [parentMap, minimap, zoomOffset])

  return <Rectangle bounds={bounds} pathOptions={{ weight: 2 }} />
}