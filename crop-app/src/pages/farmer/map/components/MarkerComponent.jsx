import { Marker, Popup } from 'react-leaflet'
import { useRef, useMemo, useEffect } from 'react'

export function MarkerComponent({ position, draggable, setPosition, markerIsVisible }) {
  const markerRef = useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (draggable) {
      marker.dragging.enable();
    } else {
      marker.dragging.disable();
    }
  }, [draggable]);


  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
          setPosition(marker.getLatLng())
        }
    }
  }), [setPosition]);


  return (
    <Marker position={position} draggable={draggable}
        eventHandlers={eventHandlers}
        ref={markerRef}
        opacity={markerIsVisible ? 1 : 0}> 
      </Marker> 
  );
}