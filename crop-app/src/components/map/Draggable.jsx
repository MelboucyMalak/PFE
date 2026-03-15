import './Draggable.css'

export function Draggable({ draggable, setDraggable }) {
   
  return (
    <button className='drag-button'
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setDraggable(!draggable)
      }}>
      {draggable ? 'Disable Drag' : 'Enable Drag'}
    </button>
  )
   
}