import { Marker, Popup } from 'react-leaflet'
import { useRef, useMemo, useEffect } from 'react'

export function MarkerComponent({ position, draggable, setPosition, visible }) {
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
      if (marker) {
        setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
      }
    }
  }), [setPosition]);


  return (
    <Marker position={position} draggable={draggable}
        eventHandlers={eventHandlers}
        ref={markerRef}
        opacity={visible ? 1 : 0}>
        <Popup>
          A popup. <br />
        </Popup>
      </Marker> 
  );
}