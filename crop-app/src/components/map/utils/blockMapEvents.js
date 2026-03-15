export function blockMapEvents(e,  ignoreMapClickRef) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    ignoreMapClickRef.current = true;


  }