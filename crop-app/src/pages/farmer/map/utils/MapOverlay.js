 
export function disableMapInteractions(map, setViewOn) {
  map.doubleClickZoom.disable()
  map.scrollWheelZoom.disable() 
  map.dragging.disable()
  setViewOn(false)
}

export function enableMapInteractions(map, setViewOn) {
  map.doubleClickZoom.enable()
  map.scrollWheelZoom.enable() 
  map.dragging.enable()
  setViewOn(true)
}