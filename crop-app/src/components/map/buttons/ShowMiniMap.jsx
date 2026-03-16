import { blockMapEvents } from '../utils/blockMapEvents';
import './ShowMiniMap.css'

export function ShowMiniMap({ ignoreMapClickRef, miniMapIsVisible, setMiniMapVisible }) {

  return (
    <button 
    className='mini-map-button'
    onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
        blockMapEvents(e, ignoreMapClickRef); 
        setMiniMapVisible(!miniMapIsVisible);
        ignoreMapClickRef.current = false
      }}>
      {miniMapIsVisible ? 'Hide Mini Map' : 'Show Mini Map'}
    </button>
  )
}