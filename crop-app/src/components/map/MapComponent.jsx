import { MapContainer, TileLayer } from 'react-leaflet' 
import { ShowLocation } from './buttons/ShowLocation.jsx' 
import { Draggable } from './buttons/Draggable.jsx'
import { ShowMarker } from './buttons/ShowMarker.jsx'
import { SetViewOnClick } from './SetViewOnClick.jsx'
import {  MarkerComponent } from './MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import {  useEffect, useState } from 'react'
import { useRef } from 'react'



export default function MapComponent() {  
  const center = [36.7, 3.2]
  const [position, setPosition] = useState(center) 
  const [draggable, setDraggable] = useState(false)
  const [visible, setVisible] = useState(true)
  const ignoreMapClickRef = useRef(false);

  useEffect(() => {
    console.log('Position updated:', position)
  }, [position])
 
 
  return (
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
        maxZoom={19}
        minZoom={5}
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
      /> 

      
      <MarkerComponent position={position} draggable={draggable} visible={visible} setPosition={setPosition} /> 

      <ShowLocation setPosition={setPosition}
      ignoreMapClickRef={ignoreMapClickRef} /> 
      
      <Draggable draggable={draggable} setDraggable={setDraggable}
      ignoreMapClickRef={ignoreMapClickRef} />

      <ShowMarker visible={visible} setVisble={setVisible} ignoreMapClickRef={ignoreMapClickRef}  />

      <SetViewOnClick setPosition={setPosition} ignoreMapClickRef={ignoreMapClickRef} /> 

      <MiniMapControl position={"topright"}/> 
  
    </MapContainer>
  )
}