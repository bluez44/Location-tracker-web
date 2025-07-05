import axios from "axios";

const instance = axios.create({
  baseURL: "https://location-tracker-api-black.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default instance