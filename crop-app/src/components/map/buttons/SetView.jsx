import { blockMapEvents } from '../utils/blockMapEvents'; 
import './SetView.css'

export function SetView({ ignoreMapClickRef, viewIsOn, setViewOn }) {
   
  return (
    <button className='set-view-button'
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
       blockMapEvents(e, ignoreMapClickRef) 
       ignoreMapClickRef.current = false
        setViewOn(!viewIsOn)
      }}> 
      {viewIsOn ? 'Disable Set View' : 'Enable Set View'}
    </button>
  )
   
}