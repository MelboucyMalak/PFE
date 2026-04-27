import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet'
import { SetViewOnClick } from './utils/SetViewOnClick.jsx'
import { SetPositionOnMove } from './utils/SetPositionOnMove.jsx'
import { MarkerComponent } from './components/MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import { ExternalState } from './components/ExternalState.jsx'
import { useMemo, useState } from 'react'
import { MapPlaceholder } from './MapPlaceholder.jsx'
import { Draw } from './components/Draw.jsx'
import { MapRefGrabber } from './utils/MapRefGrabber.jsx'
import { ControlsBar } from "./components/ControlsBar/ControlsBar.jsx"
import { MeteoCard } from './components/Cards/meteoCard/MeteoCard.jsx'
import { GenericInfosCard } from './components/Cards/GenericInfosCard/GenericInfosCard.jsx'
import { CropsList } from './components/CropsRecommendation/CropsList.jsx'
import { CropCard } from './components/Cards/CropCard/CropCard.jsx'
import MapStyles from "./MapComponent.module.css"

import { disableMapInteractions, enableMapInteractions } from './utils/MapOverlay.js'


export default function MapComponent() {
  const [map, setMap] = useState(null)
  const center = useMemo(() => ({ lat: 36.7, lng: 3.2 }), [])
  const [position, setPosition] = useState(center)
  const [displayPosition, setDisplayPosition] = useState(center)
  const [draggable, setDraggable] = useState(false)
  const [markerIsVisible, setMarkerVisible] = useState(true)
  const [miniMapIsVisible, setMiniMapVisible] = useState(true)
  const [viewIsOn, setViewOn] = useState(true)
  const [coverOn, setCoverOn] = useState(false)
  const [meteoIsVisible, setMeteo] = useState(true)
  const [genericIsVisible, setGeneric] = useState(false)
  const [cropsListIsVisible, setCropsList] = useState(false)
  const [cropContext, setCropContext] = useState({})
  const [cropRecoIsVisible, setCropReco] = useState(false)

  const soilContext ={
    PH: 5.5, depth: 30, shape: "zigzag", texture: "Sandy loam", rank: 1
  }

  const climContext ={
    temp: 5.5, rain: 30, humidity: "zigzag", koppen: "Bsh", rank: 3
  }


  function handleshowLocation() {
    setMeteo(false)
    setGeneric(true)
    setCoverOn(true)
  }

  function handleConfirmLocation() {
    setGeneric(false)
    setCropsList(true)
  }

  function handleCropChoice() {
    setCropsList(false)
    setCropReco(true) 
  }


  return (
    <div className={MapStyles.mapPage}>
      <div className={MapStyles.mapBck}></div>

      <div className={MapStyles.mapContainer}>

        <MapContainer
          center={center} zoom={13}
          scrollWheelZoom={true}
          placeholder={<MapPlaceholder />}
          className={MapStyles.mapComponent}>
        
          <TileLayer
            url='http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            minZoom={5}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}/>
          
          <MapRefGrabber 
            setMap={setMap} />

          <MarkerComponent 
            position={position} 
            draggable={draggable} 
            markerIsVisible={markerIsVisible} 
            setPosition={setPosition} />

          {miniMapIsVisible &&
            <MiniMapControl 
              position={"topright"} />}

          <Draw />

          {viewIsOn &&
            <SetViewOnClick setPosition={setPosition} />}
            <SetPositionOnMove 
            setDisplayPosition={setDisplayPosition} />

          <ExternalState 
            displayPosition={displayPosition} />

          <div className={MapStyles.mapButtons}>
            <ControlsBar 
            map={map} 
            setPosition={setPosition} 
            viewIsOn={viewIsOn} 
            setViewOn={setViewOn} />
          </div>

          {meteoIsVisible && 
          <MeteoCard
            setViewOn={setViewOn} 
            map={map} 
            handleShowLocation={handleshowLocation} />}

          <div className={`${coverOn ? MapStyles.coverMap : ''} 
                           ${cropsListIsVisible ? MapStyles.coverMapRecommendation : ''}`}
            onMouseEnter={() => 
              disableMapInteractions(map, setViewOn)}
            onMouseLeave={() =>
              enableMapInteractions(map, setViewOn) }>
         
            {genericIsVisible && 
              <GenericInfosCard 
              handleConfirmLocation={handleConfirmLocation} />}

            {cropsListIsVisible &&
             <CropsList 
              handleCropChoice={handleCropChoice} 
              setCropContext={setCropContext}  />}

            {cropRecoIsVisible && 
            <CropCard 
              cropContext={cropContext} soilContext={soilContext}
              climContext={climContext} />}
          </div>
        </MapContainer>
      </div>


    </div>
  )
}  