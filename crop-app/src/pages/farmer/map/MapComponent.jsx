import { MapContainer, TileLayer, ImageOverlay, ZoomControl } from 'react-leaflet'
import { SetViewOnClick } from './utils/SetViewOnClick.jsx'
import { SetPositionOnMove } from './utils/SetPositionOnMove.jsx'
import { MarkerComponent } from './components/MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import { ExternalState } from './components/ExternalState.jsx'
import { useMemo, useRef, useState } from 'react'
import { MapPlaceholder } from './MapPlaceholder.jsx'
import { Starter } from './components/Starter/Starter.jsx'
import { Guide } from './components/Guide/Guide.jsx'
import { Draw } from './components/Draw/Draw.jsx'
import { MapRefGrabber } from './utils/MapRefGrabber.jsx'
import { ControlsBar } from "./components/ControlsBar/ControlsBar.jsx"
import { MeteoCard } from './components/Cards/meteoCard/MeteoCard.jsx'
import { GenericInfosCard } from './components/Cards/GenericInfosCard/GenericInfosCard.jsx'
import { CropsList } from './components/CropsRecommendation/CropsList.jsx'
import { CropCard } from './components/Cards/CropCard/CropCard.jsx'
import { DrawControlsBar } from './components/Draw/DrawControlsBar/DrawControlsBar.jsx'
import { FieldHomogeneity } from './components/Cards/fieldAnalysisCards/FieldHomogeneity/FieldHomogeneity.jsx'
import { Personalization } from './components/Cards/fieldAnalysisCards/Personalization/Personalization.jsx'
import { FinalResult } from './components/Cards/fieldAnalysisCards/FinalResult/FinalResult.jsx'

import MapStyles from "./MapComponent.module.css"

import cardCross from "@/assets/images/cardCross.png"
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
  const [mapBarIsVisible, setMapBar] = useState(true)
  const [starterIsVisible, setStarter] =useState(true)
  const [guideIsVisible, setGuide] = useState(false)
  const [closeGuide, setCloseGuideBtn] = useState(false)
  const [coverOn, setCoverOn] = useState(true)
  const [meteoIsVisible, setMeteo] = useState(false)
  const [genericIsVisible, setGeneric] = useState(false)
  const [closeBtn, setCloseBtn] = useState(false)
  const [cropsListIsVisible, setCropsList] = useState(false)
  const [cropContext, setCropContext] = useState({})
  const [cropRecoIsVisible, setCropReco] = useState(false)
  const [drawBarIsVisible, setDrawBar] = useState(false)
  const [polygone, setPolygone] = useState(false)
  const [drawControlsIsVisible, setDrawControls] = useState(false)
  const drawRef = useRef()
  const [fieldHomoIsVisible, setFieldHomo] = useState(false)
  const [zonesNumber, setZonesNumber] = useState(0)
  const [personalizationIsVisible, setPersonalization] = useState(false)
  const [finalResultIsVisible, setFinalResult] = useState(false)

  const soilContext = {
    PH: 5.5, depth: 30, shape: "zigzag", texture: "Sandy loam", rank: 1
  }

  const climContext = {
    temp: 5.5, rain: 30, humidity: "zigzag", koppen: "Bsh", rank: 3
  }

  const fertContext = {
    N: { nutrient: "Nitrogen", score: 45, available: 50, need: 123, deficit: 73 },
    P: { nutrient: "Phosphorus", score: 45, available: 50, need: 123, deficit: 73 },
    K: { nutrient: "Potassium", score: 45, available: 50, need: 123, deficit: 73 }
  }

  const texturesContext = {
    name: "Potato",
    textures: {
      "sandy loam": { coverage: 50, score: 30 },
      "silt": { coverage: 30, score: 78 },
      "clay loam": { coverage: 20, score: 90 }
    },

    winner: {
      name: "sandy loam", coverage: 52, score: 30
    },

    nbr: 3
  }

  const samplingContext = {
    nbr: texturesContext.nbr,
    depth: 30,
    pattern: "zigzag",
    name: "potato",
  }

  const resultContext = {
    N: { nutrient: "Nitrogen", score: 70, available: 50, need: 123, deficit: 73 },
    P: { nutrient: "Phosphorus", score: 45, available: 50, need: 123, deficit: 73 },
    K: { nutrient: "Potassium", score: 23, available: 50, need: 123, deficit: 73 },
    PH: 4.5,
    PHNote: "too alkaline",
    name: "potatoes"
  }

  function handleShowGuide(){
    setStarter(false)
    setGuide(true) 
    setCloseGuideBtn(true)
  }

  function handleQuitGuide(){
    setGuide(false) 
    setStarter(true)
    setCloseGuideBtn(false)
  }

  function handleQuitStarter(){
    setCoverOn(false)
    setStarter(false)
    setMeteo(true)
    
  }

  function handleshowLocation() {
    setMeteo(false)
    setGeneric(true)
    setCoverOn(true)
    setCloseBtn(true)
  }

  function handleConfirmLocation() {
    setGeneric(false)
    setCropsList(true)
  }

  function handleCropChoice() {
    setCropsList(false)
    setCropReco(true)
  }

  function handlePersonalizeReco() {
    setCropReco(false)
    setDrawBar(true)
    setCoverOn(false)
  }

  function handleClearShape() {
    if (drawRef && drawRef.current) {
      drawRef.current.clearMap();
      setMapBar(true)
    }
  }


  function handleConfirmShape() {
    setMapBar(true)
    setDrawBar(false)
    setDrawControls(false)
    setCoverOn(true)
    setFieldHomo(true)
  }

  function handlePersonalizeFert() {
    setFieldHomo(false)
    setPersonalization(true)
  }

  function handleConfirmData() {
    setPersonalization(false)
    setFinalResult(true)
    console.log("used")
  }

  function closeCard() {
    setMapBar(true)
    setCoverOn(false)
    setMeteo(true)
    setGeneric(false)
    setCropsList(false)
    setCropContext({})
    setCropReco(false)
    setDrawBar(false)
    setPolygone(false)
    setDrawControls(false)
    setFieldHomo(false)
    setZonesNumber(0)
    setPersonalization(false)
    setFinalResult(false)
  }
 


  return (
    <div className={MapStyles.mapPage}>
      <div className={MapStyles.mapBck}></div>

      <div className={MapStyles.mapContainer}>

        <MapContainer
          center={center} zoom={13}
          zoomControl={false}
          placeholder={<MapPlaceholder />}
          className={MapStyles.mapComponent}>

          <TileLayer
            url='http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            minZoom={5}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']} />

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

          {drawBarIsVisible &&
            <Draw
              setPolygone={setPolygone}
              setMapBar={setMapBar}
              setDrawControls={setDrawControls}
              ref={drawRef} />}



          {viewIsOn &&
            <SetViewOnClick setPosition={setPosition} />}
          <SetPositionOnMove
            setDisplayPosition={setDisplayPosition} />

          <ExternalState
            displayPosition={displayPosition} />

          <div className={MapStyles.mapButtons}>
            {mapBarIsVisible &&
              <ControlsBar
                map={map}
                setPosition={setPosition}
                viewIsOn={viewIsOn}
                setViewOn={setViewOn} />}
            {drawControlsIsVisible &&
              <DrawControlsBar
                map={map}
                setViewOn={setViewOn}
                handleClearShape={handleClearShape}
                handleConfirmShape={handleConfirmShape} />}
          </div>

          {meteoIsVisible &&
            <MeteoCard
              setViewOn={setViewOn}
              map={map}
              handleShowLocation={handleshowLocation}
              closeCard={closeCard} />}

          <div className={`${coverOn ? MapStyles.coverMap : ''} 
                           ${cropsListIsVisible ? MapStyles.coverMapRecommendation : ''}`}
            onMouseEnter={() =>
              disableMapInteractions(map, setViewOn)}
            onMouseLeave={() =>
              enableMapInteractions(map, setViewOn)}>

            {starterIsVisible && 
              <Starter 
                handleShowGuide={handleShowGuide}
                handleQuitStarter={handleQuitStarter}/>}

            {closeGuide &&
              <img className="cardCross" src={cardCross} alt="" onClick={handleQuitGuide} />
            }

            {guideIsVisible && 
              <Guide
                handleShowGuide={handleShowGuide}
                handleQuitStarter={handleQuitStarter}
              />}

            {closeBtn &&
              <img className="cardCross" src={cardCross} alt="" onClick={closeCard} />
            }

            {genericIsVisible &&
              <GenericInfosCard
                handleConfirmLocation={handleConfirmLocation}  />}

            {cropsListIsVisible &&
              <CropsList
                handleCropChoice={handleCropChoice}
                setCropContext={setCropContext} />}

            {cropRecoIsVisible &&
              <CropCard
                cropContext={cropContext}
                soilContext={soilContext}
                climContext={climContext}
                fertContext={fertContext}
                handlePersonalizeReco={handlePersonalizeReco}  />}

            {fieldHomoIsVisible &&
              <FieldHomogeneity
                texturesContext={texturesContext}
                handlePersonalizeFert={handlePersonalizeFert}  />}

            {personalizationIsVisible &&
              <Personalization samplingContext={samplingContext} handleConfirmData={handleConfirmData}  />}

            {finalResultIsVisible &&
              <FinalResult resultContext={resultContext}  />}
          </div>
        </MapContainer>
      </div>


    </div>
  )
}  