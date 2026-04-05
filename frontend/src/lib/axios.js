import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5001/api";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? DEFAULT_API_URL : "/api");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
