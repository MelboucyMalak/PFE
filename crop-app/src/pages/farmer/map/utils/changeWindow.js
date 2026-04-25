export function changeWindow(setActive, ...setOthers) {
  setActive(true)
  setOthers.forEach(set => set(false)) 
}