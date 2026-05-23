import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { FeatureGroup, useMap } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

 
export const Draw = forwardRef(({ setPolygone, setMapBar, setDrawControls }, ref) => {
  const map = useMap();
  const featureGroupRef = useRef(null);
 
  useImperativeHandle(ref, () => ({
    clearMap: () => {
      if (featureGroupRef.current) {
        try {
          featureGroupRef.current.clearLayers();
        } catch (e) {
          console.warn("FeatureGroup clear layers warning:", e);
        }
      }
      if (map && map.pm) {
        try {
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
        } catch (e) {
          console.warn("Geoman clean layers warning:", e);
        }
      }
      setPolygone(null);
    }
  }));

  useEffect(() => {
    if (map && map.pm) {
      map.pm.setGlobalOptions({
        templineStyle: {
          color: '#FFFFFF',
          weight: 3,
        },
        hintlineStyle: {
          color: '#FFFFFF',
          dashArray: [5, 5],
          weight: 2,
        },
        pathOptions: {
          color: '#FFFFFF',
          fillColor: '#FFFFFF',
          fillOpacity: 0.25,
          weight: 3,
        },
      });
    }
  }, [map]);

  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer && layer.setStyle) {
      layer.setStyle({
        color: '#FFFFFF',
        fillColor: '#FFFFFF',
        fillOpacity: 0.25,
        weight: 3,
      });
    }

    let points = []; 
    if (layer && typeof layer.getLatLngs === 'function') {
      try {
        const latLngs = layer.getLatLngs();
        if (Array.isArray(latLngs)) {
          // Leaflet polygons can be nested arrays. Let's flatten to get the outer boundary.
          const flatLatLngs = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
          if (Array.isArray(flatLatLngs)) {
            points = flatLatLngs.map(p => {
              if (p && typeof p.lat === 'number' && typeof p.lng === 'number') {
                return { lat: p.lat, lng: p.lng };
              } else if (Array.isArray(p) && p.length >= 2) {
                return { lat: p[0], lng: p[1] };
              }
              return p;
            }).filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number');
          }
        }
      } catch (err) {
        console.error("Error parsing drawn shape coordinates:", err);
      }
    }
    
    setPolygone(points.length >= 3 ? points : null);
    setDrawControls(points.length >= 3);
    setMapBar(false);
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