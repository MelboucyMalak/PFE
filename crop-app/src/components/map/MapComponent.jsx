import { MapContainer, TileLayer } from 'react-leaflet' 
import { ShowLocation } from './buttons/ShowLocation.jsx' 
import { Draggable } from './buttons/Draggable.jsx'
import { ShowMarker } from './buttons/ShowMarker.jsx'
import { SetViewOnClick } from './SetViewOnClick.jsx'
import { SetPositionOnMove } from './SetPositionOnMove.jsx'
import {  MarkerComponent } from './MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import { ExternalState } from './ExternalState.jsx'
import {  useEffect, useMemo, useState } from 'react'
import { useRef } from 'react'
import { ShowMiniMap } from './buttons/ShowMiniMap.jsx'
 


export default function MapComponent() {  
  const center = useMemo(() => ({lat: 36.7, lng: 3.2}), [])
  const [position, setPosition] = useState(center) 

    const [displayPosition, setDisplayPosition] = useState(center)
  const [draggable, setDraggable] = useState(false)
  const [markerIsVisible, setMarkerVisible] = useState(true)
  
   const [miniMapIsVisible, setMiniMapVisible] = useState(true)

  const ignoreMapClickRef = useRef(false);

  useEffect(() => {
    console.log('Position updated:', position)
  }, [position])

  const [map, setMap] = useState(null)
 
  const displayMap = useMemo(() => (
    <MapContainer
      center={center} zoom={13}
      scrollWheelZoom={true}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
      }}
    >
      <TileLayer
        url='http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' 
        minZoom={5}
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
      /> 

      
      <MarkerComponent position={position} draggable={draggable} markerIsVisible={markerIsVisible} setPosition={setPosition} /> 

      <ShowLocation setPosition={setPosition}
      ignoreMapClickRef={ignoreMapClickRef} /> 
      
      <Draggable draggable={draggable} setDraggable={setDraggable}
      ignoreMapClickRef={ignoreMapClickRef} />

      <ShowMarker markerIsVisible={markerIsVisible} setMarkerVisible={setMarkerVisible} ignoreMapClickRef={ignoreMapClickRef}  />

      <SetViewOnClick setPosition={setPosition} ignoreMapClickRef={ignoreMapClickRef} /> 

<<<<<<< HEAD
=======
      <SetPositionOnMove setDisplayPosition={setDisplayPosition} /> 

>>>>>>> 7a54b12 (Add show mini-map button)
      {miniMapIsVisible && <MiniMapControl  position={"topright"} miniMapIsVisible={miniMapIsVisible} /> }

      <ShowMiniMap miniMapIsVisible={miniMapIsVisible}
      setMiniMapVisible={setMiniMapVisible} ignoreMapClickRef={ignoreMapClickRef}/> 

<<<<<<< HEAD
=======
      <ExternalState displayPosition={displayPosition} setDisplayPosition={setDisplayPosition} ignoreMapClickRef={ignoreMapClickRef} />
>>>>>>> 7a54b12 (Add show mini-map button)
    </MapContainer>
  ),[center, position, draggable, markerIsVisible, miniMapIsVisible, ignoreMapClickRef, setPosition, setDisplayPosition, setDraggable, setMarkerVisible,displayPosition,])
 
  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  )
}