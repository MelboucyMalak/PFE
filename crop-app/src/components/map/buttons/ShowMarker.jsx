import './ShowMarker.css'
import { blockMapEvents } from '../utils/blockMapEvents';  

export function ShowMarker({ visible, setVisble , ignoreMapClickRef }) { 

  return (
    <button className="show-button" 
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => { blockMapEvents(e, ignoreMapClickRef); setVisble(!visible);
        console.log('ShowMarker clicked, visible:', !visible);
        ignoreMapClickRef.current = false }} >
      {visible ? 'Hide Marker' : 'Show Marker'}
    </button>
  );
}