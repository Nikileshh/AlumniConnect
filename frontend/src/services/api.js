import axios from "axios";

const API = axios.create({
  baseURL: "https://alumniconnect-backend-ig3r.onrender.com/api",
});
// AUTO‑ATTACH TOKEN IF PRESENT
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
