import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet'
import { ShowLocation } from './buttons/ShowLocation/ShowLocation.jsx'
import { Draggable } from './buttons/Draggable/Draggable.jsx'
import { ShowMarker } from './buttons/ShowMarker/ShowMarker.jsx'
import { SetViewOnClick } from './utils/SetViewOnClick.jsx'
import { SetPositionOnMove } from './utils/SetPositionOnMove.jsx'
import { MarkerComponent } from './components/MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import { ExternalState } from './components/ExternalState.jsx'
import { useMemo, useState } from 'react' 
import { ShowMiniMap } from './buttons/ShowMiniMap/ShowMiniMap.jsx'
import { MapPlaceholder } from './MapPlaceholder.jsx'
import { Draw } from './components/Draw.jsx'
import { SetView } from './buttons/SetView/SetView.jsx'
import { GeocoderControl } from './components/GeocoderControl.jsx'
import { MapRefGrabber } from './utils/MapRefGrabber.jsx'
import styles from "./buttons/MapButtons.module.css"
import MapStyles from "./MapComponent.module.css"


export default function MapComponent() {
  const [map, setMap] = useState(null)
  const center = useMemo(() => ({ lat: 36.7, lng: 3.2 }), [])
  const [position, setPosition] = useState(center)
  const [displayPosition, setDisplayPosition] = useState(center)
  const [draggable, setDraggable] = useState(false)
  const [markerIsVisible, setMarkerVisible] = useState(true)
  const [miniMapIsVisible, setMiniMapVisible] = useState(true)
  const [viewIsOn, setViewOn] = useState(true)  

  return (
    <div className={MapStyles.mapPage}>
      <div className={MapStyles.mapBck}></div>
      <div className={MapStyles.mapContainer}>
        <MapContainer
          center={center} zoom={13}
          scrollWheelZoom={true}
          placeholder={<MapPlaceholder />}
          className={MapStyles.mapComponent}
        >
          <TileLayer
            url='http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            minZoom={5}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
          <MapRefGrabber setMap={setMap} />
          <MarkerComponent position={position} draggable={draggable} markerIsVisible={markerIsVisible} setPosition={setPosition} />
          {miniMapIsVisible && <MiniMapControl position={"topright"}   />}
          <Draw/>
           {viewIsOn && <SetViewOnClick setPosition={setPosition} setViewOn={setViewOn} />}
           <SetPositionOnMove setDisplayPosition={setDisplayPosition} />
           <GeocoderControl />
           <ExternalState displayPosition={displayPosition} />
        </MapContainer>
      </div>

      <div className={styles.mapButtons}>
        <ShowLocation setPosition={setPosition} map={map} /> 
        <Draggable draggable={draggable} setDraggable={setDraggable}  />
        <ShowMarker markerIsVisible={markerIsVisible} setMarkerVisible={setMarkerVisible}  />
         <ShowMiniMap miniMapIsVisible={miniMapIsVisible} setMiniMapVisible={setMiniMapVisible}  />
         <SetView  viewIsOn={viewIsOn} setViewOn={setViewOn} />
         
        
       

      </div>
    </div>
  )
}