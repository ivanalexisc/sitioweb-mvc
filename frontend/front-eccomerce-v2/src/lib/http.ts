import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // envía/recibe cookies (JWT httpOnly)
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
