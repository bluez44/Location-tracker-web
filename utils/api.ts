import instance from "../api";

const getAllLocations = async (vehicleNumber: string, limit: number) => {
  const res = await instance.get(
    `/api/locations?vehicleNumber=${vehicleNumber}&limit=${limit}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

const getTodayLocations = async (vehicleNumber: string, limit: number) => {
  const res = await instance.get(
    `/api/locations/today?vehicleNumber=${vehicleNumber}&limit=${limit}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

const getTimeRangeLocations = async (
  vehicleNumber: string,
  limit: number,
  startDate: Date,
  endDate: Date
) => {
  const res = await instance.get(
    `/api/locations/date-range?vehicleNumber=${vehicleNumber}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  );

  if (res.status === 200) {
    return res.data;
  }

  return null;
};

export { getAllLocations, getTodayLocations, getTimeRangeLocations };
