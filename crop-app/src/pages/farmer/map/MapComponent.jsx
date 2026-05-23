import { MapContainer, TileLayer, ImageOverlay, ZoomControl } from 'react-leaflet'
import { SetViewOnClick } from './utils/SetViewOnClick.jsx'
import { SetPositionOnMove } from './utils/SetPositionOnMove.jsx'
import { MarkerComponent } from './components/MarkerComponent.jsx'
import { MiniMapControl } from './mini-map/MiniMapControl.jsx'
import { ExternalState } from './components/ExternalState.jsx'
import { useMemo, useRef, useState, useEffect } from 'react'
import axios from 'axios'
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
import { CropsListControlsBar } from './components/CropsRecommendation/CropsListControlsBar/CropsListControlsBar.jsx'

import MapStyles from "./MapComponent.module.css"

import cardCross from "@/assets/images/cardCross.png"
import { disableMapInteractions, enableMapInteractions } from './utils/MapOverlay.js'
import { useNavigate } from 'react-router-dom'
import { ExitMapPopup } from '@/components/ExitMapPopup'
import { MapErrorPopup } from '@/components/MapErrorPopup'


export default function MapComponent() {
  const navigate = useNavigate()
  const [exitPopupOpen, setExitPopupOpen] = useState(false)
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
  const [isSessionFavorited, setSessionFavorited] = useState(false)
  const [cropsLoading, setCropsLoading] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [pendingTransition, setPendingTransition] = useState(false)
  const [personalizationLoading, setPersonalizationLoading] = useState(false)
  const [confirmShapeLoading, setConfirmShapeLoading] = useState(false)

  const [soilContext, setSoilContext] = useState({
    PH: 5.5, depth: 30, shape: "zigzag", texture: "Sandy loam", rank: 1
  })

  const [climContext, setClimContext] = useState({
    temp: 5.5, rain: 30, humidity: "zigzag", koppen: "Bsh", rank: 3
  })

  const [fertContext, setFertContext] = useState({
    N: { nutrient: "Nitrogen", score: 50, available: 40, need: 80, deficit: 40 },
    P: { nutrient: "Phosphorus", score: 12.5, available: 5, need: 40, deficit: 35 },
    K: { nutrient: "Potassium", score: 100, available: 65, need: 60, deficit: 0 }
  })

  const [texturesContext, setTexturesContext] = useState({
    name: "Beetroot",
    textures: {
      "sandy loam": { coverage: 55, score: 30 },
      "loam": { coverage: 25, score: 78 },
      "clay loam": { coverage: 20, score: 90 }
    },
    winner: {
      name: "sandy loam", coverage: 55, score: 30
    },
    nbr: 3
  })

  const [samplingContext, setSamplingContext] = useState({
    nbr: 3,
    depth: 30,
    pattern: "zigzag",
    name: "Beetroot",
  })

  const [resultContext, setResultContext] = useState({
    N: { nutrient: "Nitrogen", score: 70, available: 50, need: 123, deficit: 73 },
    P: { nutrient: "Phosphorus", score: 45, available: 50, need: 123, deficit: 73 },
    K: { nutrient: "Potassium", score: 23, available: 50, need: 123, deficit: 73 },
    PH: 4.5,
    PHNote: "too alkaline",
    name: "Beetroot"
  })

  const [placeName, setPlaceName] = useState("Sétif Region")
  const [liveWeather, setLiveWeather] = useState({
    temp: 25,
    condition: "Partly Cloudy",
    soilMoisture: "8.37%",
    humidity: "55%",
    windSpeed: "20 m/s",
    date: "April 7th, 14:32 pm"
  })
  const [sessionInfo, setSessionInfo] = useState({
    id: "#RS-00142",
    date: "2024-04-07,14:32",
    slopeAngle: "3.2°",
    landCover: "Cropland"
  })
  const [cropsList, setCropsListState] = useState([])
  const [fieldAnalysisId, setFieldAnalysisId] = useState(null)

  // Fetch crop recommendations by session id
  const fetchCropRecommendations = async (sessionId, active = true) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Token ${token}` } : {};
      
      let response;
      try {
        // Try POST first to align with the primary working backend handler, avoiding the 405 Method Not Allowed error
        response = await axios.post('https://torbati.onrender.com/api/crop-recommendation', { 
          session_id: sessionId 
        }, { headers });
      } catch (e) {
        console.warn("POST /api/crop-recommendation failed, trying GET fallback...", e.response?.data || e);
        response = await axios.get('https://torbati.onrender.com/api/crop-recommendation', { 
          params: { session_id: sessionId }, 
          headers 
        });
      }
      
      if (!active) return;
      
      let list = [];
      if (response && response.data) {
        console.log("Crops recommendation response:", response.data);
        const data = response.data;
        const rawList = data["Crop List"] || data.crop_list || data.cropList || data.recommendations || data.crop_recommendations || data;
        
        if (Array.isArray(rawList)) {
          list = rawList;
        } else if (Array.isArray(data)) {
          list = data;
        } else if (data.crop || data.crops) {
          const rawCrops = data.crops || data.crop;
          list = Array.isArray(rawCrops) ? rawCrops : [rawCrops];
        }
      }
      setCropsListState(list);
      setCropsLoading(false);
    } catch (err) {
      if (!active) return;
      console.error("Error fetching crop recommendations:", err.response?.data || err);
      setCropsListState([]);
      setCropsLoading(false);
    }
  };

  // Coordinates change flow: fetch location, meteo, and recommendation session
  useEffect(() => {
    if (!position) return;
    
    let active = true;
    
    // Immediately set to loading state, clear any stale crops from the previous location, and reset previous validation errors
    setCropsLoading(true);
    setCropsListState([]);
    setMapError(null);
    setPendingTransition(false);
    
    const fetchLocationData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const payload = { 
          lat: parseFloat(Number(position.lat).toFixed(5)), 
          lon: parseFloat(Number(position.lng).toFixed(5)) 
        };
        
        // 1. Fetch Place Name
        let place = "Sétif Region";
        try {
          const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${payload.lat}&lon=${payload.lon}&zoom=14&addressdetails=1`;
          const reverseRes = await axios.get(reverseUrl, {
            headers: { 
              'Accept-Language': 'en',
              'User-Agent': 'CropApp-Farmer-Geocoding-Agent'
            }
          });
          
          if (!active) return;
          
          if (reverseRes.data && reverseRes.data.address) {
            const addr = reverseRes.data.address;
            const cityPart = addr.village || addr.town || addr.city || addr.suburb || addr.municipality || addr.hamlet || addr.neighbourhood;
            const statePart = addr.county || addr.state || addr.province;
            
            if (cityPart && statePart) {
              const cleanCity = cityPart.replace(/Wilaya|Daira|Municipality/gi, '').trim();
              const cleanState = statePart.replace(/Wilaya|Daira|Province/gi, '').trim();
              if (cleanCity === cleanState) {
                place = cleanCity;
              } else {
                place = `${cleanCity}, ${cleanState}`;
              }
            } else if (cityPart) {
              place = cityPart.replace(/Wilaya|Daira|Municipality/gi, '').trim();
            } else if (statePart) {
              place = statePart.replace(/Wilaya|Daira|Province/gi, '').trim();
            } else if (reverseRes.data.display_name) {
              const parts = reverseRes.data.display_name.split(',');
              if (parts.length >= 2) {
                place = `${parts[0].trim()}, ${parts[1].trim()}`;
              } else {
                place = parts[0].trim();
              }
            }
          }
        } catch (nominatimErr) {
          console.warn("Nominatim reverse geocode failed, falling back to backend place API...", nominatimErr.message || nominatimErr);
          try {
            const placeRes = await axios.post('https://torbati.onrender.com/api/place', payload, { headers });
            if (!active) return;
            if (placeRes.data && placeRes.data.place) {
              place = placeRes.data.place;
            }
          } catch (err) {
            console.error("Error fetching place:", err.response?.data || err);
          }
        }
        if (!active) return;
        setPlaceName(place);

        // 2. Fetch Live Weather
        let weather = {
          temp: 25,
          condition: "Partly Cloudy",
          soilMoisture: "8.37%",
          humidity: "55%",
          windSpeed: "20 m/s",
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`
        };
        try {
          const meteoRes = await axios.post('https://torbati.onrender.com/api/meteo', payload, { headers });
          if (!active) return;
          if (meteoRes.data) {
            const data = meteoRes.data;
            weather = {
              temp: data.temp !== undefined ? Math.round(data.temp) : 25,
              condition: data.condition || data.status || "Partly Cloudy",
              soilMoisture: data.soil_moisture !== undefined ? `${data.soil_moisture}%` : (data.soilMoisture !== undefined ? `${data.soilMoisture}%` : "8.37%"),
              humidity: data.humidity !== undefined ? `${data.humidity}%` : "55%",
              windSpeed: data.wind_speed !== undefined ? `${data.wind_speed} m/s` : (data.windSpeed !== undefined ? `${data.windSpeed} m/s` : "20 m/s"),
              date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`
            };
          }
        } catch (err) {
          console.warn("Backend weather API failed or limited, falling back to public Open-Meteo API...", err.message || err);
          try {
            const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${payload.lat}&longitude=${payload.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
            const openMeteoRes = await axios.get(openMeteoUrl);
            if (active && openMeteoRes.data && openMeteoRes.data.current) {
              const cur = openMeteoRes.data.current;
              
              const wmoCodes = {
                0: "Clear Sky",
                1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                45: "Foggy", 48: "Depositing Rime Fog",
                51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
                61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
                71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
                80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
                95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Thunderstorm with Heavy Hail"
              };
              
              const condition = wmoCodes[cur.weather_code] || "Partly Cloudy";
              
              let baseMoisture = 8.37;
              if (cur.weather_code >= 51 && cur.weather_code <= 65) baseMoisture = 28.45;
              else if (cur.weather_code >= 80 && cur.weather_code <= 82) baseMoisture = 24.12;
              else if (cur.weather_code === 0) baseMoisture = 6.25;
              else baseMoisture = parseFloat((8.37 + (cur.relative_humidity_2m - 50) * 0.1).toFixed(2));
              
              weather = {
                temp: Math.round(cur.temperature_2m),
                condition: condition,
                soilMoisture: `${baseMoisture}%`,
                humidity: `${cur.relative_humidity_2m}%`,
                windSpeed: `${Math.round(cur.wind_speed_10m)} km/h`,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`
              };
            }
          } catch (openMeteoErr) {
            console.error("Open-Meteo fallback also failed:", openMeteoErr.message || openMeteoErr);
          }
        }
        if (!active) return;
        setLiveWeather(weather);

        // 3. Fetch Recommendation Session
        try {
          const recommendationRes = await axios.post('https://torbati.onrender.com/api/recommendation', payload, { headers });
          if (!active) return;
          if (recommendationRes.data && recommendationRes.data.recommendations) {
            const reco = recommendationRes.data.recommendations;
            const sessionIdStr = "#RS-" + String(reco.id).padStart(5, '0');
            
            let formattedDate = "2024-04-07,14:32";
            if (reco.date) {
              const dt = new Date(reco.date);
              const yr = dt.getFullYear();
              const mo = String(dt.getMonth() + 1).padStart(2, '0');
              const dy = String(dt.getDate()).padStart(2, '0');
              const hr = String(dt.getHours()).padStart(2, '0');
              const mi = String(dt.getMinutes()).padStart(2, '0');
              formattedDate = `${yr}-${mo}-${dy}, ${hr}:${mi}`;
            }

            setSessionInfo({
              id: sessionIdStr,
              rawId: reco.id,
              date: formattedDate,
              slopeAngle: reco.slope_angle !== undefined ? `${reco.slope_angle.toFixed(1)}°` : "3.2°",
              landCover: reco.land_cover || "Cropland"
            });
            setSessionFavorited(reco.favorite || false);

            // Update Soil Context from Session
            setSoilContext({
              PH: reco.soil_ph_initial !== undefined ? reco.soil_ph_initial : 5.5,
              depth: reco.bulk_density !== undefined ? Math.round(reco.bulk_density * 20) : 30,
              shape: reco.soil_texture_initial || "Sandy loam",
              texture: reco.soil_texture_initial || "Sandy loam",
              rank: reco.id,
              n: reco.n_total_raw_ppm || 0,
              p: reco.p_extractable_raw_ppm || 0,
              k: reco.k_extractable_raw_ppm || 0
            });

            // Update Climate Context from Session
            setClimContext({
              temp: reco.temperature_avg !== undefined ? reco.temperature_avg : 25,
              rain: reco.rainfall_avg !== undefined ? reco.rainfall_avg : 440,
              humidity: reco.humidity_avg !== undefined ? `${reco.humidity_avg}%` : "55%",
              koppen: reco.koppen || "Csa",
              rank: reco.id
            });

            // Fetch Crops Recommendation list
            await fetchCropRecommendations(reco.id, active);
          }
        } catch (err) {
          if (!active) return;
          console.error("Error fetching recommendation session:", err.response?.data || err);
          
          let errorType = null;
          const errorMsg = JSON.stringify(err.response?.data || "") + " " + (err.message || "");
          if (errorMsg.includes("OUTSIDE_ALGERIA")) {
            errorType = "OUTSIDE_ALGERIA";
          } else if (errorMsg.includes("NOT_SUITABLE_LAND")) {
            errorType = "NOT_SUITABLE_LAND";
          } else {
            const serverMsg = err.response?.data?.error || err.response?.data?.message;
            if (serverMsg) {
              errorType = {
                title: "Validation Warning",
                message: serverMsg
              };
            } else {
              errorType = "UNKNOWN_ERROR";
            }
          }
          
          setMapError(errorType);
          setCropsListState([]);
          setCropsLoading(false);
          
          // Reset cards to Map/Meteo view since this location is invalid
          setGeneric(false);
          setCropsList(false);
          setMeteo(true);
          setCoverOn(false);
        }
      } catch (err) {
        if (!active) return;
        console.error("Error in location coordinate flow:", err);
        setCropsLoading(false);
      }
    };

    fetchLocationData();
    return () => {
      active = false;
    };
  }, [position]);

  // Fetch Generic Fertilization when active crop is opened
  useEffect(() => {
    if (!cropContext?.id) return;

    const fetchGenericFertilizer = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const response = await axios.post('https://torbati.onrender.com/api/field/fertilization/generic/', {
          crop_recommendation: cropContext.id
        }, { headers });

        if (response.data) {
          const data = response.data;
          const available = data.available_in_soil_kg_ha || {};
          const needs = data.crop_needs_kg_ha || {};
          const deficits = data.deficit_to_add_kg_ha || {};
          const coverage = data.soil_coverage_percent || {};

          setFertContext({
            N: {
              nutrient: "Nitrogen",
              score: coverage.N !== undefined ? Math.round(coverage.N) : 50,
              available: available.N !== undefined ? Math.round(available.N) : 40,
              need: needs.N !== undefined ? Math.round(needs.N) : 80,
              deficit: deficits.N !== undefined ? Math.round(deficits.N) : 40
            },
            P: {
              nutrient: "Phosphorus",
              score: coverage.P !== undefined ? Math.round(coverage.P) : 12.5,
              available: available.P !== undefined ? Math.round(available.P) : 5,
              need: needs.P !== undefined ? Math.round(needs.P) : 40,
              deficit: deficits.P !== undefined ? Math.round(deficits.P) : 35
            },
            K: {
              nutrient: "Potassium",
              score: coverage.K !== undefined ? Math.round(coverage.K) : 100,
              available: available.K !== undefined ? Math.round(available.K) : 65,
              need: needs.K !== undefined ? Math.round(needs.K) : 60,
              deficit: deficits.K !== undefined ? Math.round(deficits.K) : 0
            }
          });
        }
      } catch (err) {
        console.error("Error fetching generic fertilization:", err);
      }
    };

    fetchGenericFertilizer();
  }, [cropContext]);

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
    if (cropsLoading) {
      setPendingTransition(true);
      return;
    }
    setPendingTransition(false);
    setMeteo(false);
    setGeneric(true);
    setCoverOn(true);
    setCloseBtn(true);
  }

  // Handle delayed transition to location details once coordinate loading completes successfully
  useEffect(() => {
    if (pendingTransition && !cropsLoading) {
      setPendingTransition(false);
      if (!mapError) {
        setMeteo(false);
        setGeneric(true);
        setCoverOn(true);
        setCloseBtn(true);
      }
    }
  }, [cropsLoading, pendingTransition, mapError]);

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
    setMapBar(false)
  }

  const clearMapLayers = () => {
    if (map) {
      try {
        if (map.pm) {
          const layers = map.pm.getGeomanDrawLayers ? map.pm.getGeomanDrawLayers() : [];
          if (Array.isArray(layers)) {
            layers.forEach(layer => {
              if (map.hasLayer(layer)) {
                map.removeLayer(layer);
              }
            });
          }
          if (typeof map.pm.disableDraw === 'function') {
            map.pm.disableDraw();
          }
        }
      } catch (e) {
        console.warn("Error clearing map layers:", e);
      }
    }
  };

  function handleCancelPersonalization() {
    clearMapLayers();
    setPolygone(false);
    setDrawBar(false);
    setDrawControls(false);
    setMapBar(true);
    setCoverOn(true);
    setCropReco(true);
  }

  function handleResetShape() {
    clearMapLayers();
    setPolygone(false);
  }

  const calculatePolygonArea = (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length < 3) return 0;
    let area = 0;
    const R = 6378137; // Earth radius in meters
    
    try {
      // Convert lat/lng to radians
      const radCoords = coords.map(p => ({
        lat: (p && typeof p.lat === 'number' ? p.lat : 0) * Math.PI / 180,
        lng: (p && typeof p.lng === 'number' ? p.lng : 0) * Math.PI / 180
      }));

      for (let i = 0; i < radCoords.length; i++) {
        const p1 = radCoords[i];
        const p2 = radCoords[(i + 1) % radCoords.length];
        area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));
      }
      
      area = Math.abs(area * R * R / 2);
      return Math.round(area); // in m2
    } catch (e) {
      console.error("Error in calculatePolygonArea:", e);
      return 0;
    }
  };

  async function handleConfirmShape() {
    setConfirmShapeLoading(true);
    try {
      const area = calculatePolygonArea(polygone);
      const polygonCoords = (polygone || []).map(p => [p.lat, p.lng]);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const payload = {
        crop_recommendation: cropContext.id,
        polygon_coords: polygonCoords,
        surface_area_m2: area
      };

      const res = await axios.post('https://torbati.onrender.com/api/field/analysis/', payload, { headers });
      if (res.data) {
        const data = res.data;
        setFieldAnalysisId(data.id || data.field_analysis_id);

        let texturesData = {
          "sandy loam": { coverage: 55, score: 30 },
          "loam": { coverage: 25, score: 78 },
          "clay loam": { coverage: 20, score: 90 }
        };

        if (Array.isArray(data.detected_textures)) {
          texturesData = {};
          data.detected_textures.forEach(t => {
            const name = t.texture_name || t.name || "unknown";
            const rawScore = t.texture_score !== undefined ? t.texture_score : (t.score !== undefined ? t.score : 0);
            texturesData[name] = {
              coverage: t.coverage_percent !== undefined ? t.coverage_percent : (t.coverage !== undefined ? t.coverage : 0),
              score: rawScore <= 5 ? rawScore * 20 : rawScore
            };
          });
        }

        let winnerName = data.dominant_texture || data.winner_texture || data.winner?.name || Object.keys(texturesData)[0] || "sandy loam";
        let winnerDetails = texturesData[winnerName] || { coverage: 55, score: 30 };
        if (data.dominant_coverage_percent !== undefined) {
          winnerDetails.coverage = data.dominant_coverage_percent;
        }

        const ptsCount = Array.isArray(data.sampling_points) ? data.sampling_points.length : (data.nbr || Object.keys(texturesData).length || 3);
        const texturesCount = Object.keys(texturesData).length;

        setTexturesContext({
          name: cropContext.name || "Crop",
          textures: texturesData,
          winner: {
            name: winnerName,
            coverage: winnerDetails.coverage !== undefined ? winnerDetails.coverage : 55,
            score: winnerDetails.score !== undefined ? winnerDetails.score : 30
          },
          nbr: texturesCount
        });

        setSamplingContext({
          nbr: texturesCount,
          depth: data.depth_cm || data.depth || 30,
          pattern: data.pattern || "zigzag",
          name: cropContext.name || "Crop"
        });

        setMapBar(true)
        setDrawBar(false)
        setDrawControls(false)
        setCoverOn(true)
        setFieldHomo(true)
      }
    } catch (err) {
      console.error("Error creating field analysis:", err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setMapError({
        title: "Drawing Error",
        message: serverMsg || "We encountered a validation error for the selected coordinate. Please click on a different agricultural parcel on the map."
      });
    } finally {
      setConfirmShapeLoading(false);
    }
  }

  function handlePersonalizeFert() {
    setFieldHomo(false)
    setPersonalization(true)
  }

  async function handleConfirmData(userInputs) {
    setPersonalizationLoading(true);
    setPersonalization(false);
    setFinalResult(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const payload = {
        field_analysis: fieldAnalysisId,
        ph_entered: userInputs.ph,
        n_entered_ppm: userInputs.n,
        p_entered_ppm: userInputs.p,
        k_entered_ppm: userInputs.k
      };

      const response = await axios.post('https://torbati.onrender.com/api/field/fertilization/personalized/', payload, { headers });
      if (response.data) {
        const data = response.data;
        
        // Extract coverage / score (percentage)
        const coverageN = data.soil_coverage_percent?.N !== undefined 
          ? data.soil_coverage_percent.N 
          : (data.N?.score !== undefined ? data.N.score : (data.nitrogen?.score !== undefined ? data.nitrogen.score : 70));
          
        const coverageP = data.soil_coverage_percent?.P !== undefined 
          ? data.soil_coverage_percent.P 
          : (data.P?.score !== undefined ? data.P.score : (data.phosphorus?.score !== undefined ? data.phosphorus.score : 45));
          
        const coverageK = data.soil_coverage_percent?.K !== undefined 
          ? data.soil_coverage_percent.K 
          : (data.K?.score !== undefined ? data.K.score : (data.potassium?.score !== undefined ? data.potassium.score : 23));

        // Get need in kg/ha from fertContext, fallback to default
        const needN = fertContext.N?.need !== undefined ? fertContext.N.need : 120;
        const needP = fertContext.P?.need !== undefined ? fertContext.P.need : 40;
        const needK = fertContext.K?.need !== undefined ? fertContext.K.need : 60;

        // Calculate available in kg/ha based on coverage score
        const scoreN = Math.round(coverageN);
        const scoreP = Math.round(coverageP);
        const scoreK = Math.round(coverageK);

        const availableN = data.available_in_soil_kg_ha?.N !== undefined
          ? Math.round(data.available_in_soil_kg_ha.N)
          : (data.N?.available !== undefined ? Math.round(data.N.available) : Math.round((scoreN / 100) * needN));

        const availableP = data.available_in_soil_kg_ha?.P !== undefined
          ? Math.round(data.available_in_soil_kg_ha.P)
          : (data.P?.available !== undefined ? Math.round(data.P.available) : Math.round((scoreP / 100) * needP));

        const availableK = data.available_in_soil_kg_ha?.K !== undefined
          ? Math.round(data.available_in_soil_kg_ha.K)
          : (data.K?.available !== undefined ? Math.round(data.K.available) : Math.round((scoreK / 100) * needK));

        const surfaceAreaM2 = data.surface_ha || 1200;

        // Get total deficit in kg (total_to_add_for_field_kg) corrected by dividing by 10,000 to fix the backend's m2 multiplier bug, or fallback to local hectare calculation
        const totalDeficitN = data.total_to_add_for_field_kg?.N !== undefined
          ? Math.round(data.total_to_add_for_field_kg.N / 10000)
          : Math.round(Math.max(0, needN - availableN) * (surfaceAreaM2 / 10000));

        const totalDeficitP = data.total_to_add_for_field_kg?.P !== undefined
          ? Math.round(data.total_to_add_for_field_kg.P / 10000)
          : Math.round(Math.max(0, needP - availableP) * (surfaceAreaM2 / 10000));

        const totalDeficitK = data.total_to_add_for_field_kg?.K !== undefined
          ? Math.round(data.total_to_add_for_field_kg.K / 10000)
          : Math.round(Math.max(0, needK - availableK) * (surfaceAreaM2 / 10000));

        setResultContext({
          N: {
            nutrient: "Nitrogen",
            score: scoreN,
            available: availableN,
            need: needN,
            deficit: totalDeficitN
          },
          P: {
            nutrient: "Phosphorus",
            score: scoreP,
            available: availableP,
            need: needP,
            deficit: totalDeficitP
          },
          K: {
            nutrient: "Potassium",
            score: scoreK,
            available: availableK,
            need: needK,
            deficit: totalDeficitK
          },
          PH: data.PH !== undefined ? data.PH : (data.ph_entered !== undefined ? data.ph_entered : userInputs.ph),
          PHNote: data.ph_note || data.PHNote || "too alkaline",
          name: cropContext.name || "Crop"
        });
      }
    } catch (err) {
      console.error("Error submitting personalized fertilization:", err);
    } finally {
      setPersonalizationLoading(false);
    }
  }

  function handleExitFieldAnalysis() {
    clearMapLayers();
    setPolygone(false)
    setFieldHomo(false)
    setPersonalization(false)
    setFinalResult(false)
    setZonesNumber(0)
    setCropReco(true)
  }

  function closeCard() {
    clearMapLayers();
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
    setSessionFavorited(false)
  }

  const handleFavoriteSession = async () => {
    try {
      const nextFavoriteState = !isSessionFavorited;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const payload = {
        session_id: sessionInfo.rawId,
        favorite: nextFavoriteState
      };

      const response = await axios.patch('https://torbati.onrender.com/api/recommendation/favorite', payload, { headers });
      if (response.status === 200) {
        setSessionFavorited(nextFavoriteState);
      }
    } catch (err) {
      console.error("Error toggling favorite session:", err.response?.data || err);
    }
  };
 


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
                setDisplayPosition={setDisplayPosition}
                viewIsOn={viewIsOn}
                setViewOn={setViewOn}
                onExitClick={() => setExitPopupOpen(true)} />}
            {drawBarIsVisible &&
              <DrawControlsBar
                map={map}
                setViewOn={setViewOn}
                handleCancel={handleCancelPersonalization}
                handleReset={handleResetShape}
                handleConfirm={handleConfirmShape}
                hasShape={!!polygone}
                isLoading={confirmShapeLoading} />}
          </div>

          {meteoIsVisible &&
            <MeteoCard
              setViewOn={setViewOn}
              map={map}
              handleShowLocation={handleshowLocation}
              closeCard={closeCard}
              position={position}
              placeName={placeName}
              liveWeather={liveWeather}
              isLoading={pendingTransition}
              isMeteoLoading={cropsLoading} />}

          <div className={`${coverOn ? MapStyles.coverMap : ''} 
                           ${cropsListIsVisible ? MapStyles.coverMapRecommendation : ''}`}
            onMouseEnter={() =>
              disableMapInteractions(map, setViewOn)}
            onMouseLeave={() => {
              if (!guideIsVisible && !starterIsVisible && !exitPopupOpen) {
                enableMapInteractions(map, setViewOn)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          >

            {starterIsVisible && 
              <Starter 
                handleShowGuide={handleShowGuide}
                handleQuitStarter={handleQuitStarter}/>}

            {guideIsVisible && 
              <Guide
                handleQuitGuide={handleQuitGuide}
              />}

            {closeBtn && null}

             {genericIsVisible &&
              <GenericInfosCard
                handleConfirmLocation={handleConfirmLocation}
                closeCard={closeCard}
                position={position}
                placeName={placeName}
                liveWeather={liveWeather}
                sessionInfo={sessionInfo}
                soilContext={soilContext}
                climContext={climContext} />}

            {cropsListIsVisible && (
              <>
                <CropsList
                  handleCropChoice={handleCropChoice}
                  setCropContext={setCropContext} 
                  cropsList={cropsList}
                  loading={cropsLoading}
                />
                <CropsListControlsBar 
                  onChangeLocation={() => {
                    setCropsList(false)
                    setGeneric(true)
                  }}
                  isSessionFavorited={isSessionFavorited}
                  onFavoriteSession={handleFavoriteSession}
                />
              </>
            )}

            {cropRecoIsVisible &&
              <CropCard
                cropContext={cropContext}
                soilContext={soilContext}
                climContext={climContext}
                fertContext={fertContext}
                handlePersonalizeReco={handlePersonalizeReco}
                onClose={() => {
                  setCropReco(false)
                  setCropsList(true)
                }}
              />}

            {fieldHomoIsVisible &&
              <FieldHomogeneity
                texturesContext={texturesContext}
                handlePersonalizeFert={handlePersonalizeFert}
                onClose={handleExitFieldAnalysis}  />}

            {personalizationIsVisible &&
              <Personalization
                samplingContext={samplingContext}
                handleConfirmData={handleConfirmData}
                onClose={handleExitFieldAnalysis}  />}

            {finalResultIsVisible &&
              <FinalResult
                resultContext={resultContext}
                onClose={handleExitFieldAnalysis}
                isLoading={personalizationLoading}  />}
          </div>
        </MapContainer>
      </div>

      <ExitMapPopup
        isOpen={exitPopupOpen}
        onClose={() => setExitPopupOpen(false)}
        onConfirm={() => navigate('/farmer/dashboard')}
      />

      <MapErrorPopup
        isOpen={!!mapError}
        errorType={mapError}
        onClose={() => setMapError(null)}
      />
    </div>
  )
}  