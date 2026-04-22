import { FeatureGroup } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export function Draw() {

  const handleCreated = (e) => {
    const layer = e.layer;
    let points = {}
    if (layer.getLatLngs) {
      const latLngs = layer.getLatLngs();
       points = latLngs[0].map(p => ({
        lat: p.lat,
        lng: p.lng
      }));
    }
 
    console.log('Extracted Points:', points);
  };
  return (
    <FeatureGroup>
      <GeomanControls
        options={{
          position: 'topleft',
          drawMarker: true,
          drawCircleMarker: false,
          drawCircle: true,
          drawPolygon: true,
          drawPolyline: false,
          drawRectangle: true,
          editMode: true,
          dragMode: false,
          cutPolygon: false,
          removalMode: true,
          rotateMode: false
        }}
        globalOptions={{
          continueDrawing: false,
        }}
        onCreate={handleCreated}
      />
    </FeatureGroup>
  );
}