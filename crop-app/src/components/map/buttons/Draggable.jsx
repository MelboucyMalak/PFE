import { blockMapEvents } from '../utils/blockMapEvents'
import styles from './Draggable.module.css'

export function Draggable({ draggable, setDraggable, ignoreMapClickRef }) {
   
  return (
    <button className={styles.dragButton}
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