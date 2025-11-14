// src/api/api.js
import axios from "axios";
import { loader } from "./loaderManager";

// 🌐 Load API URL from .env
const API_BASE = process.env.REACT_APP_API_BASE;

if (!API_BASE) {
  console.error("❌ REACT_APP_API_BASE is missing in .env");
}

// 🔧 Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 🧭 Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    loader.start();  // 🔥 SHOW LOADER
    console.log(`➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    loader.stop();
    return Promise.reject(error);
  }
);

// 🧩 Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    loader.stop();   // 🔥 HIDE LOADER
    return response;
  },
  (error) => {
    loader.stop();
    console.error("❌ API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🚀 Generic API service
const apiService = async ({ url, method = "GET", data = null, params = null }) => {
  try {
    const m = method.toUpperCase();
    let response;

    switch (m) {
      case "GET":
        response = await apiClient.get(url, { params });
        break;
      case "POST":
        response = await apiClient.post(url, data);
        break;
      case "PUT":
        response = await apiClient.put(url, data);
        break;
      case "PATCH":
        response = await apiClient.patch(url, data);
        break;
      case "DELETE":
        response = await apiClient.delete(url, { data });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Network or server error";
    throw new Error(msg);
  }
};

export default apiService;
