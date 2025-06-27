import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Data
const locations = [
  { id: 1, name: 'Place A', position: [51.505, -0.09] },
  { id: 2, name: 'Place B', position: [51.51, -0.1] },
  { id: 3, name: 'Place C', position: [51.49, -0.08] },
];

// Numbered icon creator
function createNumberIcon(number) {
  return L.divIcon({
    html: `<div class="number-marker">${number}</div>`,
    className: '', // Remove default leaflet styles
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

export default function FullscreenMap() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc, index) => (
          <Marker
            key={loc.id}
            position={loc.position}
            icon={createNumberIcon(index + 1)}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .number-marker {
          background-color: #007bff;
          color: white;
          font-weight: bold;
          text-align: center;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
