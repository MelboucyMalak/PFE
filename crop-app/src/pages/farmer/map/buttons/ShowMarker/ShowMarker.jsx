import styles from '../MapButtons.module.css' 

export function ShowMarker({ markerIsVisible, setMarkerVisible }) {

  return (
    <button className={styles.mapButton} 
      onClick={( ) => { 
        setMarkerVisible(!markerIsVisible); 
      }} >
      {markerIsVisible ? 'Hide Marker' : 'Show Marker'}
    </button>
  );
}