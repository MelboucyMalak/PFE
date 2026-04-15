import { useCallback, useState, useMemo } from 'react'
import { useMap, useMapEvent } from 'react-leaflet'
import { Rectangle } from 'react-leaflet' 
import {useEventHandlers} from '@react-leaflet/core'

export function MiniMapBounds({parentMap, zoom }) {
  const minimap = useMap()
 
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)
 
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
 
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])
 
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [onChange ])
  useEventHandlers({ instance: parentMap }, handlers)

  const BOUNDS_STYLE = { weight: 1 }

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}