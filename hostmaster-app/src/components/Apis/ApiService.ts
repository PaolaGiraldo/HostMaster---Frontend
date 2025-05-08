import axios from "axios";

const API_URL = "http://3.85.88.149:8000/hotel"; // backend
//const API_URL = "http://localhost:3001"; // mocks

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0NjcyMTY0NH0.y-9xyZpgUPHbXcEKaMMwuuDtPSi5QtUKYRyZmsGPrj4"
  },
});

// Interceptor para manejar errores (opcional)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiService;
