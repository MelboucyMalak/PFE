import { Circle, LayerGroup, LayersControl } from 'react-leaflet'

export function ShowCircles({ center }) {
  return (
    <LayersControl.Overlay checked name="Layer group with circles">
      <LayerGroup>
        <Circle
          center={center}
          pathOptions={{ fillColor: 'blue' }}
          radius={200}
        />
        <Circle
          center={center}
          pathOptions={{ fillColor: 'red' }}
          radius={100}
          stroke={false}
        />
      </LayerGroup>
    </LayersControl.Overlay>
  )
}