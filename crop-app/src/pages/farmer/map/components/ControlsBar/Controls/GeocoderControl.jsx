import { useEffect } from 'react'; 
import L from 'leaflet';
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

 export function GeocoderControl({ map, barRef, setPosition, setDisplayPosition }) { 
  
  useEffect(() => { 
    if (!map) return  
    const bar = barRef.current

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode:false,
      collapsed: false, 
    }) 
    
    const container = geocoder.onAdd(map)
    bar.prepend(container)

    const clearSuggestions = () => {
      if (geocoder && typeof geocoder._clearResults === 'function') {
        try {
          geocoder._clearResults();
        } catch (e) {
          console.error(e);
        }
      }
      const alternatives = container.querySelector('.leaflet-control-geocoder-alternatives');
      if (alternatives) {
        alternatives.innerHTML = '';
        alternatives.classList.add('leaflet-control-geocoder-alternatives-minimized');
      }
      if (container) {
        container.classList.remove('leaflet-control-geocoder-options-open');
        container.classList.remove('leaflet-control-geocoder-options-error');
      }
    };

    geocoder.on('markgeocode', (e) => {
      const { center, name } = e.geocode;
      console.log('Found:', name, center);
      map.setView(center, 13); 
      L.marker(center).addTo(map).bindPopup(name).openPopup();
      
      if (typeof setPosition === 'function') {
        setPosition(center);
      }
      if (typeof setDisplayPosition === 'function') {
        setDisplayPosition(center);
      }
      
      // Dismiss suggestions when a place is chosen
      clearSuggestions();
    });

    // Dismiss suggestions when the map is clicked
    map.on('click', clearSuggestions);

    // Dismiss suggestions when clicking outside the geocoder component
    const handleDocumentClick = (event) => {
      if (container && !container.contains(event.target)) {
        clearSuggestions();
      }
    };
    document.addEventListener('click', handleDocumentClick);

    // Dismiss suggestions and blur input when Escape key is pressed
    const input = container.querySelector('input');
    let keydownHandler;
    let inputHandler;
    if (input) {
      keydownHandler = (e) => {
        if (e.key === 'Escape') {
          clearSuggestions();
          input.blur();
        }
      };
      input.addEventListener('keydown', keydownHandler);

      // Dismiss suggestions when the search input is cleared (e.g. via the browser native 'x' clear button)
      inputHandler = () => {
        setTimeout(() => {
          if (input.value.trim() === '') {
            clearSuggestions();
          }
        }, 0);
      };
      input.addEventListener('input', inputHandler);
      input.addEventListener('search', inputHandler);
      input.addEventListener('change', inputHandler);
      input.addEventListener('mouseup', inputHandler);
      input.addEventListener('click', inputHandler);
    }

    // Execute search when the geocoder icon (magnifying glass) is pressed
    const searchIcon = container.querySelector('.leaflet-control-geocoder-icon');
    let searchIconClickHandler;
    if (searchIcon) {
      searchIconClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (input && input.value.trim() !== '') {
          if (typeof geocoder._geocode === 'function') {
            geocoder._geocode();
          } else {
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              keyCode: 13,
              code: 'Enter',
              which: 13,
              bubbles: true,
              cancelable: true
            });
            input.dispatchEvent(enterEvent);
          }
        }
      };
      searchIcon.addEventListener('click', searchIconClickHandler);
    }
 
    return () => {
      map.off('click', clearSuggestions);
      document.removeEventListener('click', handleDocumentClick);
      if (input) {
        if (keydownHandler) input.removeEventListener('keydown', keydownHandler);
        if (inputHandler) {
          input.removeEventListener('input', inputHandler);
          input.removeEventListener('search', inputHandler);
          input.removeEventListener('change', inputHandler);
          input.removeEventListener('mouseup', inputHandler);
          input.removeEventListener('click', inputHandler);
        }
      }
      if (searchIcon && searchIconClickHandler) {
        searchIcon.removeEventListener('click', searchIconClickHandler);
      }
      bar?.removeChild(container);
    };
  }, [map, barRef]);

  return null;
}