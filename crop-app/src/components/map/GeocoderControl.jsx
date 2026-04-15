import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

 export function GeocoderControl() {
  const map = useMap();

  useEffect(() => {
    // Check if the control is available
    if (!L.Control.geocoder) {
      console.error('L.Control.geocoder is not available');
      return;
    }

    // Create and add the control
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false, // We'll handle it ourselves
      position: 'topleft'
    }).addTo(map);

    // Handle the geocoding result
    geocoder.on('markgeocode', (e) => {
      const { center, name, bbox } = e.geocode;
      console.log('Found:', name, center);
      
      // Center the map on the found location
      map.setView(center, 13);
      
      // Optional: Add a marker
      L.marker(center).addTo(map).bindPopup(name).openPopup();
    });

    // Cleanup function
    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
}