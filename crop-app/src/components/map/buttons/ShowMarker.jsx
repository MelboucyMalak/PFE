import styles from './ShowMarker.module.css'
import { blockMapEvents } from '../utils/blockMapEvents';

export function ShowMarker({ markerIsVisible, setMarkerVisible, ignoreMapClickRef }) {

  return (
    <button className={styles.showButton}
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
        blockMapEvents(e, ignoreMapClickRef); 
        setMarkerVisible(!markerIsVisible);
        ignoreMapClickRef.current = false
      }} >
      {markerIsVisible ? 'Hide Marker' : 'Show Marker'}
    </button>
  );
}