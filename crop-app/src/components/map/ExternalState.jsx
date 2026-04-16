import { blockMapEvents } from './utils/blockMapEvents';
import styles from './ExternalState.module.css'


export function ExternalState({ displayPosition, setDisplayPosition, ignoreMapClickRef }) {
  const onClick = (e) => {
    blockMapEvents(e, ignoreMapClickRef);
    setDisplayPosition({ lat: 0, lng: 0 });
    ignoreMapClickRef.current = false
  };

  return(
      <p className={styles.externalStateParagraph}>
      latitude: {Number(displayPosition.lat).toFixed(4) }, longitude: {Number(displayPosition.lng).toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
    </p>
  )
}