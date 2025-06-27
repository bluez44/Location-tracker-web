import "./App.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

class location {
  _id: string;
  latitude: number;
  longitude: number;
  constructor() {
    this._id = "";
    this.latitude = 0;
    this.longitude = 0;
  }
}

// Numbered icon creator
function createNumberIcon(number: number) {
  return L.divIcon({
    html: `<div class="number-marker">${number}</div>`,
    className: "", // Remove default leaflet styles
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

function App() {
  const [locations, setLocations] = useState<location[]>([]);
  const [getLocationsTimer, setGetLocationsTimer] = useState(0);

  const getLocation = () => {
    fetch("https://location-tracker-api-black.vercel.app/api/locations")
      .then((response) => response.json())
      .then((res) => setLocations(res.data.slice(res.data.length-2)))
      .catch((error) => console.error(error))
      .finally(() => console.log("Locations fetched"));
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (getLocationsTimer === 0) {
        getLocation();
        setGetLocationsTimer(10);
        return;
      }

      setGetLocationsTimer(getLocationsTimer - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [getLocationsTimer]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <h1>Auto get location after 10s. Time left: {getLocationsTimer}s</h1>
      {locations.length > 0 ? (
        <MapContainer
          center={[locations[0].latitude, locations[0].longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc: any, index) => (
            <Marker
              key={loc._id}
              position={[loc.latitude, loc.longitude]}
              icon={createNumberIcon(index + 1)}
            >
              <Popup>Hehe</Popup>
            </Marker>
          ))}
          <Polyline
            positions={locations.map((loc) => [loc.latitude, loc.longitude])}
            pathOptions={{ color: "lime" }}
          />
        </MapContainer>
      ) : (
        <p>Loading...</p>
      )}

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

export default App;
