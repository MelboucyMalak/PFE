import styles from '../MapButtons.module.css'

export function Draggable({ draggable, setDraggable  }) {
   
  return (
    <button className={styles.mapButton} 
      onClick={( ) => { 
       setDraggable(!draggable) 
      }}>
      {draggable ? 'Disable Drag' : 'Enable Drag'}
    </button>
  )
   
}