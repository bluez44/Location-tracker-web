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
import type { LocationRet } from "./models/location";
import DateObject from "react-date-object";
import type { LatLngTuple } from "leaflet";
import { Box, Drawer } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import createNumberIcon from "../utils/createNumberIcon";
import {
  getAllLocations,
  getTimeRangeLocations,
  getTodayLocations,
} from "../utils/api";

import NotFound from "./components/Notfound";

function App() {
  const [locations, setLocations] = useState<LocationRet[]>([]);
  const [getLocationsTimer, setGetLocationsTimer] = useState(0);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [vehicleNumber, setVehicleNumber] = useState(
    localStorage.getItem("vehicleNumber") || ""
  );
  const [limit, setLimit] = useState(
    Number(localStorage.getItem("limit")) || 0
  );

  const [isSearching, setIsSearching] = useState(false);

  const [_, setLocation] = useState<LatLngTuple>([0, 0]);

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

  const saveLatestLocationToLocal = (locationPosition: LatLngTuple) => {
    localStorage.setItem("latestLocation", JSON.stringify(locationPosition));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    if (queryType === "Today") {
      const res = await getTodayLocations(vehicleNumber, limit);

      if (res.data.length > 0) {
        setLocations(res.data);
        saveLatestLocationToLocal([
          res.data[res.data.length - 1].latitude,
          res.data[res.data.length - 1].longitude,
        ]);
      } else {
        setLocations([]);
      }

      setIsSearching(false);
    } else if (queryType === "Time range") {
      if (startDate && endDate) {
        const res = await getTimeRangeLocations(
          vehicleNumber,
          limit,
          startDate,
          endDate
        );

        if (res.data.length > 0) {
          setLocations(res.data);
          saveLatestLocationToLocal([
            res.data[res.data.length - 1].latitude,
            res.data[res.data.length - 1].longitude,
          ]);
        } else {
          setLocations([]);
        }

        setIsSearching(false);
      } else {
        setIsSearching(false);
        alert("Please select both start and end dates.");
      }
    } else {
      const res = await getAllLocations(vehicleNumber, limit);

      if (res.data.length > 0) {
        setLocations(res.data);
        saveLatestLocationToLocal([
          res.data[res.data.length - 1].latitude,
          res.data[res.data.length - 1].longitude,
        ]);
      } else {
        setLocations([]);
      }

      setIsSearching(false);
    }
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

  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (newOpen: boolean) => (e: React.KeyboardEvent | React.MouseEvent) => {
      console.log(e);
      e.preventDefault();
      setOpen(newOpen);
    };

  const DrawerList = (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <div
        className="w-full py-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row mt-3 justify-content-between items-center">
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
      <div className="flex flex-col gap-3 w-full">
        <TextField
          label="Vehicle number"
          variant="outlined"
          placeholder="Enter vehicle number"
          value={vehicleNumber}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setVehicleNumber(e.target.value);
            localStorage.setItem("vehicleNumber", e.target.value);
          }}
        />
        <TextField
          label="Limit"
          type="number"
          variant="outlined"
          placeholder="Enter limit"
          value={Number(limit)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            localStorage.setItem("limit", e.target.value);
          }}
        />
        <Button
          className="text-center mx-auto"
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </Box>
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center relative">
      <h1 className="text-2xl text-center fw-bold bg-slate-50 opacity-[0.8] p-2 absolute text-black z-1 right-0 top-0">
        Auto reload: {getLocationsTimer}s
      </h1>
      <div className="absolute bottom-10 z-1 right-0">
        <div className="text-center">
          <Button onClick={toggleDrawer(true)}>
            <SettingsIcon sx={{ fontSize: 60 }} />
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
            {DrawerList}
          </Drawer>
        </div>
      </div>
      {locations.length > 0 ? (
        <MapContainer
          center={[locations[0].latitude, locations[0].longitude]}
          zoom={13}
          className="h-full w-full z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc: LocationRet, index) => (
            <Marker
              key={loc._id}
              position={[loc.latitude, loc.longitude]}
              icon={createNumberIcon(index + 1, index === locations.length - 1)}
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
      ) : isSearching ? (
        <div className="h-full flex justify-content-center items-center">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
            <p className="mt-3">Searching</p>
          </div>
        </div>
      ) : (
        <NotFound />
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
