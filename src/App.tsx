import "./App.css";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import Button from "@mui/material/Button";
import { type Location, type LocationRet } from "./models/location";
import type { LatLngTuple } from "leaflet";
import { Box, Drawer } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  getAllLocations,
  getTimeRangeLocations,
  getTodayLocations,
} from "../utils/api";

import NotFound from "./components/Notfound";
import MyMap from "./components/MyMap";

function App() {
  const [locations, setLocations] = useState<LocationRet[]>([]);
  const [getLocationsTimer, setGetLocationsTimer] = useState(0);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [vehicleNumber, setVehicleNumber] = useState(
    localStorage.getItem("vehicleNumber") || "",
  );
  const [limit, setLimit] = useState(
    Number(localStorage.getItem("limit")) || 0,
  );

  const [onClickLocation, setOnClickLocation] = useState<Location | null>(null);

  const [isSearching, setIsSearching] = useState(false);

  const [queryType, setQueryType] = useState(
    JSON.parse(localStorage.getItem("queryType") || '"All time"'),
  );

  const handleSearch = useCallback(async () => {
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
          endDate,
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
  }, [endDate, limit, queryType, startDate, vehicleNumber]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

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
  }, [getLocationsTimer, handleSearch]);

  const handleChange = (event: SelectChangeEvent) => {
    setQueryType(event.target.value as string);
    localStorage.setItem("queryType", JSON.stringify(event.target.value));
  };

  const saveLatestLocationToLocal = (locationPosition: LatLngTuple) => {
    localStorage.setItem("latestLocation", JSON.stringify(locationPosition));
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, [handleSearch]);

  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (newOpen: boolean) => (e: React.KeyboardEvent | React.MouseEvent) => {
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
    <div className="h-dvh w-dvw flex flex-col items-center">
      <h1 className="text-2xl text-center fw-bold bg-slate-50 opacity-[0.8] p-2 fixed text-black z-1 right-0 top-0">
        Auto reload: {getLocationsTimer}s
      </h1>
      <div className="fixed bottom-10 z-1 right-0">
        <div className="text-center">
          <Button onClick={toggleDrawer(true)}>
            <SettingsIcon sx={{ fontSize: 60 }} />
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
            {DrawerList}
          </Drawer>
        </div>
      </div>
      {onClickLocation && (
        <p className="fixed bottom-0 left-0 right-0 text-center bg-slate-50 opacity-[0.8] p-2 z-10">
          Opened location: {onClickLocation?.displayName || "Unknown location"}
        </p>
      )}
      {locations.length > 0 ? (
        <MyMap locations={locations} setLocation={setOnClickLocation} />
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
    </div>
  );
}

export default App;
