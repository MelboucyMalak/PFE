import { useEffect } from 'react'; 
import L from 'leaflet';
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

 export function GeocoderControl({ map, barRef }) { 
  
  useEffect(() => { 
    if (!map) return  
    const bar = barRef.current

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode:false,
      collapsed: false, 
    }) 
    
    const container = geocoder.onAdd(map)
    bar.prepend(container)

    geocoder.on('markgeocode', (e) => {
      const { center, name,} = e.geocode;
      console.log('Found:', name, center);
       map.setView(center, 13); 
     
       
      L.marker(center).addTo(map).bindPopup(name).openPopup();
    });
 
    return () => {
       bar?.removeChild(container);
    };
  }, [map, barRef]);

  return null;
}