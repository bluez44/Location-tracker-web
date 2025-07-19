export type LocationRet = {
  _id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  vehicleNumber: string;
  heading?: number;
  speed?: number;
};

export type Location = {
  latitude: number;
  longitude: number;
  displayName: string;
};
