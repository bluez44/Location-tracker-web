import instance from "../api";

const getAllLocations = async (vehicleNumber: string) => {
  const res = await instance.get(
    `/api/locations?vehicleNumber=${vehicleNumber}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

const getTodayLocations = async (vehicleNumber: string) => {
  const res = await instance.get(
    `/api/locations/today?vehicleNumber=${vehicleNumber}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

const getTimeRangeLocations = async (
  vehicleNumber: string,
  startDate: Date,
  endDate: Date
) => {
  const res = await instance.get(
    `/api/locations/date-range?vehicleNumber=${vehicleNumber}&startDate=${startDate}&endDate=${endDate}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

export { getAllLocations, getTodayLocations, getTimeRangeLocations };
