import L from "leaflet";

export default function createNumberIcon(isLast: boolean, heading?: number) {
  const color = isLast ? "green" : "#007bff";

  return L.divIcon({
    html: `
      <div style="transform: rotate(${heading}deg); className: "w-20 h-20">
        ${
          isLast
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 24 24" fill="${color}">
                <path 
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"
                >
                </path>
              </svg>`
            : `
            <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 24 24" fill="${color}">
              <path d="M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path>
            </svg>
            `
        }
      </div>
    `,
    className: "",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -15],
  });
}
