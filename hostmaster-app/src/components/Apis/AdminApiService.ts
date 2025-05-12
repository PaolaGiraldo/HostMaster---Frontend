import axios from "axios";

const API_URL = "http://3.85.88.149:8000/admin"; // backend
//const API_URL = "http://localhost:3001"; // mocks

const adminApiService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0NzE0MzExOH0.Zn8Yd4YT43cd6iuxX_KmgV_uQTCfiBH0mbrUvZZDByU"
  },
});

// Interceptor para manejar errores (opcional)
adminApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default adminApiService;
