import { blockMapEvents } from '../utils/blockMapEvents'
import './Draggable.css'

export function Draggable({ draggable, setDraggable, ignoreMapClickRef }) {
   
  return (
    <button className='drag-button'
      onMouseDown={() => (ignoreMapClickRef.current = true)}
      onClick={(e) => {
       blockMapEvents(e, ignoreMapClickRef)
       setDraggable(!draggable)
       ignoreMapClickRef.current = false
      }}>
      {draggable ? 'Disable Drag' : 'Enable Drag'}
    </button>
  )
   
}