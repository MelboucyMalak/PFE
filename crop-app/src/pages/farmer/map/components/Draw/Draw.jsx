import { useRef, useImperativeHandle, forwardRef } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

 
export const Draw = forwardRef(({ setPolygone, setMapBar, setDrawControls }, ref) => {
 
  const featureGroupRef = useRef(null);
 
  useImperativeHandle(ref, () => ({
    // Le parent pourra appeler : drawRef.current.clearMap()
    clearMap: () => {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();  
        setPolygone(null); // Réinitialiser
        console.log("deleted");
      }
    }
  }));

  const handleCreated = (e) => {
    const layer = e.layer;
    let points = {}; 
    if (layer.getLatLngs) {
      const latLngs = layer.getLatLngs();
      points = latLngs[0].map(p => ({
        lat: p.lat,
        lng: p.lng
      }));
    }
    
    setPolygone(points);
    setDrawControls(true)
    setMapBar(false)
  };

  return (
    <FeatureGroup ref={featureGroupRef}>
      <GeomanControls
        options={{ 
          drawMarker: false,
          removalMode: false,
          drawCircleMarker: false,
          drawText: false,
          drawCircle: false,
          drawPolygon: true,
          drawPolyline: false,
          drawRectangle: true,
          editMode: false,
          dragMode: false,
          cutPolygon: false, 
          rotateMode: false, 
        }}
        globalOptions={{ continueDrawing: false }}
        onCreate={handleCreated}
      />
    </FeatureGroup>
  );
});