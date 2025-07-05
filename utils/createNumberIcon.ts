import L from "leaflet";

export default function createNumberIcon(number: number) {
  return L.divIcon({
    html: `<div class="number-marker">${number}</div>`,
    className: "", // Remove default leaflet styles
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}
