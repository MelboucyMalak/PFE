import {FeatureGroup} from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export function Draw() {

  const handleCreated = (e) => {
    const layer = e.layer; 
    const latLngs = layer.getLatLngs();  
    const points = latLngs[0].map(p => ({
      lat: p.lat,
      lng: p.lng
    }));

    console.log('Extracted Points:', points);
  };
  return (
    <FeatureGroup>
        <GeomanControls
          options={{
            position: 'topleft',
            drawMarker: true,
            drawCircle: true,
            drawPolygon: true,
            drawPolyline: false,
            drawRectangle: true, // Disable rectangle (you can draw squares with polygon)
            editMode: true,
            dragMode: true,
            cutPolygon: true,
            removalMode: true,
          }}
          globalOptions={{
            continueDrawing: false,
          }}
           onCreate={handleCreated}
        />
      </FeatureGroup>
  );
}