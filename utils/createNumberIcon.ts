import L from "leaflet";

export default function createNumberIcon(number: number, isLast: boolean) {
  const bgColor = isLast ? "green" : "";

  return L.divIcon({
    html: `<div class="number-marker" ${
      isLast && `style="background-color: ${bgColor}"`
    }>${!isLast ? number : ""}</div>`,
    className: "", // Remove default leaflet styles
    iconSize: [30, 60],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}
