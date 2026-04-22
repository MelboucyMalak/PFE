import { useMemo } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { MiniMapBounds } from './MiniMapBounds'

export function MiniMapControl({ position }) {
  const parentMap = useMap()

  

  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }

  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={parentMap.getZoom() -5} // Use the calculated initial zoom
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}>
        <TileLayer
          url='http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        {/* Pass parentMap. We don't need to pass 'zoom' state anymore. */}
        <MiniMapBounds parentMap={parentMap} zoomOffset={-5} />
      </MapContainer>
    ),
    [parentMap ]
  )

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}