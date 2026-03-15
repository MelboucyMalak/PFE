import { MapContainer, TileLayer } from 'react-leaflet' 
import { ShowLocation } from './ShowLocation.jsx' 
import { Draggable } from './Draggable.jsx'
import { ShowMarker } from './ShowMarker.jsx'
import {  MarkerComponent } from './MarkerComponent.jsx'
import {  useState } from 'react'



export default function MapComponent() {  
  const center = [36.7, 3.2]
  const [position, setPosition] = useState(center) 
  const [draggable, setDraggable] = useState(false)
  const [visible, setVisible] = useState(true)
   const [ignoreMapClick, setIgnoreMapClick] = useState(false);
 
 
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

      
      <MarkerComponent position={position} draggable={draggable} visible={visible} /> 
      <ShowLocation setPosition={setPosition} /> 
      
      <Draggable draggable={draggable} setDraggable={setDraggable} />
      <ShowMarker visible={visible} setVisble={setVisible} ignoreMapClick={ignoreMapClick} setIgnoreMapClick={setIgnoreMapClick} />
  
    </MapContainer>
  )
}