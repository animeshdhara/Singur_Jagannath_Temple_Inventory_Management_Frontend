import axios from "axios";

// Use environment variable or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL
});

export default API;