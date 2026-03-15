import './ShowMarker.css'

export function ShowMarker({ visible, setVisble  }) {

  const handleEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  return (
    <button className="show-button" 
      onClick={(e) => { handleEvent(e); setVisble(!visible); }}
      onMouseDown={handleEvent}
      onMouseUp={handleEvent}
      onMouseMove={handleEvent}
      onPointerDown={handleEvent}
      onPointerUp={handleEvent}
      onPointerMove={handleEvent}
      onTouchStart={handleEvent}
      onTouchEnd={handleEvent}
      onTouchMove={handleEvent}>
      {visible ? 'Hide Marker' : 'Show Marker'}
    </button>
  );
}