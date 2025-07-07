import { useEffect, useRef } from "react";
import DateObject from "react-date-object";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Marker as LeafletMarker } from "leaflet";
import createNumberIcon from "../../utils/createNumberIcon";
import type { LocationRet } from "../models/location";
import React from "react";

function MyMap({ locations }: { locations: LocationRet[] }) {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  });

  return (
    <MapContainer
      center={[locations[0].latitude, locations[0].longitude]}
      zoom={13}
      className="h-full w-full z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc: LocationRet, index) => {
        const isLast = index === locations.length - 1;
        return (
          <Marker
            key={loc._id}
            position={[loc.latitude, loc.longitude]}
            icon={createNumberIcon(index + 1, isLast)}
            ref={isLast ? markerRef : null}
          >
            <Popup>
              Saved at{" "}
              {new DateObject(loc.timestamp).format("DD/MM/YYYY HH:mm:ss")}
            </Popup>
          </Marker>
        );
      })}
      <Polyline
        positions={locations.map((loc) => [loc.latitude, loc.longitude])}
        pathOptions={{ color: "lime" }}
      />
    </MapContainer>
  );
}

export default React.memo(MyMap);
