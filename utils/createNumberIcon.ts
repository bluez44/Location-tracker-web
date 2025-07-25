import L from "leaflet";

export default function createNumberIcon(
  isLast: boolean,
  index: number,
  heading?: number
) {
  const color = isLast ? "green" : "#007bff";

  return L.divIcon({
    html: `
      <div 
        style="
          transform: rotate(${heading}deg); 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          width: 50px; 
          height: 50px; 
          background-color: white; 
          border-radius: 50%; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          padding: 5px;
          padding-top: 0px;
          position: relative;
        ">
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
        <span style="position: absolute; bottom: -20px; color: black; font-size: 16px; font-weight: bold;">${
          index + 1
        }</span>
      </div>
    `,
    className: "",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -15],
  });
}
