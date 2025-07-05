import "./App.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useLayoutEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import Button from "@mui/material/Button";

import createNumberIcon from "../utils/createNumberIcon";
import {
  getAllLocations,
  getTimeRangeLocations,
  getTodayLocations,
} from "../utils/api";

import type { LocationRet } from "../models/location";
import DateObject from "react-date-object";
import type { LatLngTuple } from "leaflet";

function App() {
  const [locations, setLocations] = useState<LocationRet[]>([]);
  const [getLocationsTimer, setGetLocationsTimer] = useState(0);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [vehicleNumber, setVehicleNumber] = useState(
    localStorage.getItem("vehicleNumber") || ""
  );

  const [isSearching, setIsSearching] = useState(false);

  const [location, setLocation] = useState<LatLngTuple>([0, 0]);

  useLayoutEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  const handleGetAllLocations = async () => {
    if (!vehicleNumber) return;
    const res = await getAllLocations(vehicleNumber);

    if (res.data.length > 0) {
      setLocations(res.data);
    } else {
      setLocations([]);
      alert("No locations found");
    }

    setIsSearching(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (getLocationsTimer === 0) {
        handleSearch();
        setGetLocationsTimer(10);
        return;
      }

      setGetLocationsTimer(getLocationsTimer - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [getLocationsTimer]);

  const [queryType, setQueryType] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setQueryType(event.target.value as string);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    if (queryType === "Today") {
      const res = await getTodayLocations(vehicleNumber);

      if (res.data.length > 0) {
        setLocations(res.data);
      } else {
        setLocations([]);
        alert("No locations found for today");
      }

      setIsSearching(false);
    } else if (queryType === "Time range") {
      if (startDate && endDate) {
        const res = await getTimeRangeLocations(
          vehicleNumber,
          startDate,
          endDate
        );

        if (res.data.length > 0) {
          setLocations(res.data);
        } else {
          setLocations([]);
          alert("No locations found for time range");
        }

        setIsSearching(false);
      } else {
        setIsSearching(false);
        alert("Please select both start and end dates.");
      }
    } else {
      handleGetAllLocations();
    }
    
    setIsSearching(false);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <h1 className="text-2xl my-10">
        Auto get location after 10s. Time left: {getLocationsTimer}s
      </h1>
      <div className="flex gap-4 items-center mb-5">
        <div className="min-w-100">
          <FormControl fullWidth>
            <InputLabel id="query_type" className="text-white">
              Chose data time
            </InputLabel>
            <Select
              labelId="query_type"
              id="query_type"
              value={queryType}
              label="Chose data time"
              onChange={handleChange}
            >
              <MenuItem value={"Today"}>Today</MenuItem>
              <MenuItem value={"Time range"}>Time range</MenuItem>
              <MenuItem value={"All time"}>All time</MenuItem>
            </Select>
          </FormControl>
          {queryType === "Time range" && (
            <div className="flex mt-3 justify-content-between">
              <DatePicker
                className="py-2 px-2 border-1 rounded mx-3"
                selected={startDate}
                dateFormat={"dd/MM/yyyy"}
                onChange={(date) => setStartDate(date as Date | null)}
              />
              <DatePicker
                className="py-2 px-2 border-1 rounded mx-3"
                selected={endDate}
                dateFormat={"dd/MM/yyyy"}
                onChange={(date) => setEndDate(date as Date | null)}
              />
            </div>
          )}
        </div>
        <TextField
          label="Vehicle number"
          variant="outlined"
          placeholder="Enter vehicle number"
          value={vehicleNumber}
          onChange={(e) => {
            setVehicleNumber(e.target.value);
            localStorage.setItem("vehicleNumber", e.target.value);
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {!isSearching ? (
        <MapContainer
          center={
            locations.length > 0
              ? [locations[0].latitude, locations[0].longitude]
              : [...location]
          }
          zoom={13}
          className="h-full w-full z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc: LocationRet, index) => (
            <Marker
              key={loc._id}
              position={[loc.latitude, loc.longitude]}
              icon={createNumberIcon(index + 1)}
            >
              <Popup>
                Saved at{" "}
                {new DateObject(loc.timestamp).format("DD/MM/YYYY HH:mm:ss")}
              </Popup>
            </Marker>
          ))}
          <Polyline
            positions={locations.map((loc) => [loc.latitude, loc.longitude])}
            pathOptions={{ color: "lime" }}
          />
        </MapContainer>
      ) : (
        <div className="h-full flex items-center">
          <div className="loader"></div>
        </div>
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
