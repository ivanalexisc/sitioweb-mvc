import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // envía/recibe cookies (JWT httpOnly)
});

http.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  return config;
});

export default http;
