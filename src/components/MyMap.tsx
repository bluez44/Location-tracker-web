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
import { getAddressFromLatLong } from "../../utils/location";
import type { LocationRet } from "../models/location";
import React from "react";

function MyMap({
  locations,
  setLocation,
}: {
  locations: LocationRet[];
  setLocation: any;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const popup = marker.getPopup();
      if (popup) {
        popup.options.autoPan = false;
      }
      marker.openPopup();
    }
  }, [markerRef.current]);

  const handleReverseGeocode = async (lat: number, lon: number) => {
    try {
      const address = await getAddressFromLatLong(lat, lon);
      setLocation({
        latitude: lat,
        longitude: lon,
        displayName: address.display_name || "Unknown location",
      });
    } catch (error) {
      console.error(error);
    }
  };

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
            icon={createNumberIcon(isLast, index, isLast ? 0 : loc.heading)}
            ref={isLast ? markerRef : null}
            eventHandlers={{
              popupopen: () => {
                handleReverseGeocode(loc.latitude, loc.longitude);
              },
            }}
          >
            <Popup>
              <p>
                Saved at{" "}
                {new DateObject(loc.timestamp).format("DD/MM/YYYY HH:mm:ss")}
              </p>
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
